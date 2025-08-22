import { setCurrentUser, 
    getCurrentUser, 
    showLoading, 
    showFaceRecognition, 
    hideLoading, 
    showAlert, 
    closeModal,
    loadAccounts, 
    showBankingInterface,
    setIsSignupMode,
    validateEmail,
    validatePhone,
    isEmailOrPhone

} from "./script.js";
console.log(API_URL);
document.getElementById("loginFormSubmit").addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailOrPhone = document.getElementById("loginIdentifier").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!emailOrPhone || !password) {
        showAlert("Please fill in all fields");
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrPhone, password })
        });

        hideLoading();

        let data;
        try {
            data = await response.json();
        } catch {
            showAlert("Invalid response from server");
            return;
        }

        if (!response.ok) {
            showAlert(data.message || "Login failed");
            return;
        }

        // Store token
        localStorage.setItem("token", data.token);

        // Save current user
        setCurrentUser({
            id: data.id,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            token: data.token
        });

        console.log("Logged in user:", getCurrentUser());

        // Show face recognition step
        showFaceRecognition(false);

        // ✅ Load accounts after login
        document.addEventListener("DOMContentLoaded", () => {
            loadAccounts();
        });
        // showBankingInterface();

    } catch (error) {
        hideLoading();
        console.error("Login error:", error);
        showAlert("An error occurred during login. Please try again.");
    }
});
export function startFaceRecognition() {
    const scanningText = document.getElementById('scanningText');
    const startBtn = document.getElementById('startScanBtn');

    startBtn.disabled = true;
    startBtn.textContent = 'Scanning...';

    // Simulate scanning process
    let step = 0;
    const steps = [
        'Detecting face...',
        'Analyzing features...',
        'Verifying identity...',
        'Authentication successful!'
    ];

    const interval = setInterval(() => {
        if (step < steps.length) {
            scanningText.textContent = steps[step];
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                location.href = "markups/SecureBanking.html";
              
            }, 1000);
        }
    }, 1500);
}
// document.getElementById('startScanBtn').addEventListener("click", () => startFaceRecognition());
function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('faceRecognition').classList.add('hidden');
    setIsSignupMode(true)
}
document.getElementById('signUpbtn').addEventListener('click',()=> showSignup())
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupFormSubmit");

    if (!signupForm) {
        console.error("Signup form not found in DOM ❌");
        return;
    }

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submitted ✅");

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            showAlert("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address");
            return;
        }

        if (!validatePhone(phone)) {
            showAlert("Please enter a valid phone number");
            return;
        }

        if (password.length < 6) {
            showAlert("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match");
            return;
        }

        try {
            showLoading();
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                }),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);
            localStorage.setItem("token", data.token);

            hideLoading();

            if (!response.ok) {
                showAlert(data.message || data.error || "An error occurred");
                return;
            }

            // Store user
            setCurrentUser({
                id: data.user.id,
                name: `${data.user.firstName} ${data.user.lastName}`,
                email: data.user.email,
                phone: data.user.phone,
            });

            console.log("Current user set:",getCurrentUser());

            // ✅ Now call face recognition
            showFaceRecognition(true);
            console.log("Face recognition called ✅");

        } catch (error) {
            console.error("Register error:", error);
            showAlert("An error occurred while creating your account. Please try again later.");
        }
    });
});

document.getElementById('closeModal').addEventListener('click',()=> closeModal() );

// Start face recognition scan
async function startFaceScan() {
    const videoElement = document.getElementById("faceVideo");
    const scanningText = document.getElementById("scanningText");

    try {
        scanningText.innerText = "Requesting camera access...";
        
        // Request access to webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Show video feed
        videoElement.srcObject = stream;
        scanningText.innerText = "Scanning... Please keep your face centered.";

        // Simulate scanning animation (optional)
        setTimeout(() => {
            scanningText.innerText = "Face captured successfully!";
            stopFaceScan(stream);
              location.href = "markups/SecureBanking.html";
        }, 5000); // 5-second fake scan
    } catch (err) {
        console.error("Camera error:", err);
        scanningText.innerText = "Unable to access camera. Please allow permissions.";
    }
}

// Stop the webcam stream
function stopFaceScan(stream) {
    stream.getTracks().forEach(track => track.stop());
}

document.getElementById("startScanBtn").addEventListener("click", startFaceScan);

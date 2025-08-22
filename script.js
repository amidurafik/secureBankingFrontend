// tailwind.config.js
// module.exports = {
//     content: [
//         "./frontend/**/*.html",
//         "./frontend/**/*.js",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }

// Dark mode detection


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// User data storage simulation
let currentUser = null;
let isSignupMode = false;

export function setIsSignupMode(bool) {
    isSignupMode = bool;
}

export function setCurrentUser(user) {
    currentUser = user;
}

async function getUserAccount() {
    const token = localStorage.getItem("token");
    try{
        if (!token) return null;
       const res = `${API_URL}/api/accounts/getaccount`;
       const response = await fetch(res, {
           headers: { Authorization: `Bearer ${token}` }
       });
       if (!response.ok) {
           console.error("Failed to fetch user account:", await response.text());
           return null;
       }
       const account = await response.json();
       return account;
    } catch (error) {
        console.error("Error fetching user account:", error);
        return null;
    }

 
}

export async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("Failed to fetch user:", await response.text());
            return null;
        }
        const user = await response.json();
        return user;

    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}

// Custom modal functions
export function showAlert(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('customModal').classList.remove('hidden');
}

export function closeModal() {
    document.getElementById('customModal').classList.add('hidden');
}





export function showFaceRecognition(isSignup = false) {
    const login = document.getElementById('loginForm');
    const signup = document.getElementById('signupForm');
    const face = document.getElementById('faceRecognition');
    const title = document.getElementById('faceTitle');
    const subtitle = document.getElementById('faceSubtitle');

    if (!login || !signup || !face || !title || !subtitle) {
        console.error('Missing elements:', { login, signup, face, title, subtitle });
        return;
    }

    // Make sure the container is visible
    const container = document.getElementById('authContainer');
    if (container) container.classList.remove('hidden');

    login.classList.add('hidden');
    signup.classList.add('hidden');
    face.classList.remove('hidden');

    title.textContent = isSignup ? 'Face Registration' : 'Face Verification';
    subtitle.textContent = isSignup
        ? 'Register your face for secure access'
        : 'Please look at the camera';


}

// Validation functions
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
//signupformsubmit
export function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function isEmailOrPhone(input) {
    return validateEmail(input) || validatePhone(input);
}






function skipFaceRecognition() {
    showAlert('Face recognition skipped. Your account security may be reduced.');
    setTimeout(() => {
        showBankingInterface();
    }, 2000);
}


// Show banking interface
export function showBankingInterface() {
    // document.getElementById('authContainer').classList.add('hidden');
    // document.getElementById('bankingInterface').classList.remove('hidden');
    // Load current user data
    const currentUser = getCurrentUser();

    if (currentUser) {
        document.getElementById('userGreeting') ? document.getElementById('userGreeting').textContent = `Welcome back, ${currentUser.name}!` : null;
    }
   
}


async function renderBankingInterface() {
    const currentUser = await getCurrentUser();
    const account = currentUser.accounts || [];



    // if (!currentUser) {
    //     // If token or user is missing, redirect to login
    //     location.href = "index.html"; // Redirect to login if no user
    //     return;
    // }

    // Set greeting
    if (document.getElementById('userGreeting')) {
        document.getElementById('userGreeting').textContent = `Welcome back, ${currentUser.firstName}!`;
    }
    // Render accounts
    const accountContainer = document.getElementById("accountOverview");
    if (!accountContainer) {
        // console.error("Account container not found in DOM");
        return;
    }
    accountContainer.innerHTML = ""; // Clear old content
    account.forEach(account => {
        const card = document.createElement("div");
        card.className = "account-card text-white p-6 rounded-2xl shadow-lg";

        let bgColor = "bg-blue-500"; // default
        if (account.type === "SAVINGS") bgColor = "bg-green-500";
        if (account.type === "CREDIT") bgColor = "bg-orange-500";

        card.classList.add(bgColor);

        card.innerHTML = `
            <h3 class="text-lg font-semibold opacity-90">${account.type || "Checking"} Account</h3>
            <p class="text-3xl font-bold mt-2">$${account.balance.toFixed(2)}</p>
            <p class="text-sm opacity-75 mt-1">****${account.id.slice(-4)}</p>
        `;

        accountContainer.appendChild(card);
    });


 
}

document.addEventListener('DOMContentLoaded', renderBankingInterface);


// Action modal functions
function showActionModal(actionName) {
    document.getElementById('actionTitle').textContent = actionName;
    document.getElementById('actionModal').classList.remove('hidden');
}

function closeActionModal() {
    document.getElementById('actionModal').classList.add('hidden');
}

// Transaction modal functions
function showTransactionModal(transaction) {
    document.getElementById('transactionTitle').textContent = transaction.title;
    document.getElementById('transactionAmount').textContent = transaction.amount;
    document.getElementById('transactionAmount').className = transaction.amount.startsWith('+') ? 'text-3xl font-bold mb-2 text-green-600' : 'text-3xl font-bold mb-2 text-red-600';
    document.getElementById('transactionDate').textContent = transaction.date;
    document.getElementById('transactionId').textContent = transaction.id;
    document.getElementById('transactionIcon').innerHTML = `<span class="text-white text-2xl">${transaction.icon}</span>`;
    document.getElementById('transactionIcon').className = `w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${transaction.iconBg}`;
    document.getElementById('transactionModal').classList.remove('hidden');
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.add('hidden');
}
document.getElementById('closeTransactionModalBtn') ? document.getElementById('closeTransactionModalBtn').addEventListener('click', () => closeTransactionModal()) : null;

// Loading overlay
export function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

export function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}


// Enhanced transaction interactions
function addTransactionClickHandlers() {
    const transactions = document.querySelectorAll('.transaction-item');
    const transactionData = [
        {
            title: 'Salary Deposit',
            amount: '+$3,200.00',
            date: 'Dec 15, 2024 at 9:00 AM',
            id: 'TXN001234567',
            icon: '💰',
            iconBg: 'bg-green-500'
        },
        {
            title: 'Grocery Store',
            amount: '-$127.45',
            date: 'Dec 14, 2024 at 2:30 PM',
            id: 'TXN001234568',
            icon: '🏪',
            iconBg: 'bg-red-500'
        },
        {
            title: 'Electric Bill',
            amount: '-$89.20',
            date: 'Dec 13, 2024 at 11:15 AM',
            id: 'TXN001234569',
            icon: '⚡',
            iconBg: 'bg-blue-500'
        }
    ];

    transactions.forEach((transaction, index) => {
        transaction.addEventListener('click', () => {
            showTransactionModal(transactionData[index]);
        });
    });
}

// Enhanced form validation with visual feedback
function addFormValidation() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('border-red-500', 'border-green-500');

            if (this.value.trim()) {
                if (this.type === 'email' && !validateEmail(this.value)) {
                    this.classList.add('border-red-500');
                } else if (this.type === 'tel' && !validatePhone(this.value)) {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.add('border-green-500');
                }
            }
        });

        input.addEventListener('blur', function () {
            if (!this.value.trim()) {
                this.classList.remove('border-red-500', 'border-green-500');
            }
        });
    });
}

// Balance animation
function animateBalances() {
    const balances = document.querySelectorAll('.account-card p:nth-child(2)');
    balances.forEach(balance => {
        balance.classList.add('balance-animation');
    });
}

// Add touch/swipe support for mobile
function addTouchSupport() {
    let startX, startY, distX, distY;
    const threshold = 150;
    const restraint = 100;
    const allowedTime = 300;
    let startTime;

    document.addEventListener('touchstart', function (e) {
        const touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
    });

    document.addEventListener('touchend', function (e) {
        const touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        const elapsedTime = new Date().getTime() - startTime;

        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                // Add swipe gestures for navigation if needed
                if (distX > 0) {
                    // Right swipe
                } else {
                    // Left swipe
                }
            }
        }
    });
}

// Initialize enhanced features
function initializeEnhancements() {
    addFormValidation();
    addTouchSupport();

    // Add transition classes to elements
    document.querySelectorAll('.account-card, .quick-action, .transaction-item').forEach(el => {
        el.classList.add('fade-in');
    });
}

// Enhanced logout with confirmation
function logout() {
    showLoading();
    location.href = '../index.html'

    setTimeout(() => {
        hideLoading();
        currentUser = null;
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('bankingInterface').classList.add('hidden');
        showLogin();

        // Reset forms
        document.getElementById('loginFormSubmit').reset();
        document.getElementById('signupFormSubmit').reset();

        // Reset form validation styles
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('border-red-500', 'border-green-500');
        });
    }, 1000);
}
//logout button handler
if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', () => {
        if (confirm("Are you sure you want to log out?")) {

            logout();
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeEnhancements();
});

// Override showBankingInterface to include animations
const originalShowBankingInterface = showBankingInterface;
showBankingInterface = function () {
    originalShowBankingInterface();
    setTimeout(() => {
        animateBalances();
        addTransactionClickHandlers();
    }, 100);
};


export async function loadAccounts() {
    const token = localStorage.getItem("token");
    if (!token) {
        showAlert("You are not logged in.");
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_URL}/api/accounts`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        hideLoading();

        if (!response.ok) {
            if (response.status === 401) {
                showAlert("Session expired. Please log in again.");
                logout(); // You can create a logout() that clears localStorage and redirects
                return;
            }
            const errorData = await response.json();
            showAlert(errorData.message || "Failed to load accounts.");
            return;
        }

        const data = await response.json();
        const accounts = data.accounts || [];
        console.log("Accounts:", accounts);

        // Render accounts into the UI
        const accountContainer = document.getElementById("accountOverview");
        if (!accountContainer) {
            console.error("Account container not found in DOM");
            return;
        }
        accountContainer.innerHTML = ""; // Clear old content

        accounts.forEach(account => {
            const card = document.createElement("div");
            card.className = "account-card text-white p-6 rounded-2xl shadow-lg";

            let bgColor = "bg-blue-500"; // default
            if (account.type === "SAVINGS") bgColor = "bg-green-500";
            if (account.type === "CREDIT") bgColor = "bg-orange-500";

            card.classList.add(bgColor);

            card.innerHTML = `
                <h3 class="text-lg font-semibold opacity-90">${account.type || "Checking"} Account</h3>
                <p class="text-3xl font-bold mt-2">$${account.balance.toFixed(2)}</p>
                <p class="text-sm opacity-75 mt-1">****${account.id.slice(-4)}</p>
            `;

            accountContainer.appendChild(card);
        });

    } catch (error) {
        hideLoading();
        console.error("Error loading accounts:", error);
        showAlert("An error occurred while loading accounts. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = getCurrentUser();

    if (!user) {
        location.href = "index.html"; // Redirect to login if no user
        return;
    }

    showBankingInterface();
});
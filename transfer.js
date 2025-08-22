
document.querySelector('.back-svg').addEventListener("click",()=>{
    location.href = document.q;
    console.log('hi')
})

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

// Form elements
const form = document.getElementById('transferForm');
const transferTypeInputs = document.querySelectorAll('input[name="transferType"]');
const transferAmountInput = document.getElementById('transferAmount');
const transferNoteInput = document.getElementById('transferNote');

// Section elements
const bankAccountSection = document.getElementById('bankAccountSection');
const mobileMoneySection = document.getElementById('mobileMoneySection');
const internationalSection = document.getElementById('internationalSection');

// Modal elements
const reviewModal = document.getElementById('reviewModal');
const processingModal = document.getElementById('processingModal');
const successModal = document.getElementById('successModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const newTransferBtn = document.getElementById('newTransferBtn');
const viewTransactionBtn = document.getElementById('viewTransactionBtn');

// Add visual selection for transfer type cards
transferTypeInputs.forEach(input => {
    input.addEventListener('change', function () {
        // Remove selection from all cards
        document.querySelectorAll('input[name="transferType"]').forEach(radio => {
            const card = radio.closest('label');
            card.classList.remove('ring-2', 'ring-primary', 'bg-primary/5');
        });

        // Add selection to current card
        if (this.checked) {
            const card = this.closest('label');
            card.classList.add('ring-2', 'ring-primary', 'bg-primary/5');

            // Hide all sections
            bankAccountSection.classList.add('hidden');
            mobileMoneySection.classList.add('hidden');
            internationalSection.classList.add('hidden');

            // Show relevant section
            if (this.value === 'internal') {
                bankAccountSection.classList.remove('hidden');
            } else if (this.value === 'mobile-money') {
                mobileMoneySection.classList.remove('hidden');
            } else if (this.value === 'international') {
                internationalSection.classList.remove('hidden');
            }

            // Clear previous errors
            document.getElementById('transferTypeError').classList.add('hidden');
        }
    });
});

// Form validation
function validateForm() {
    let isValid = true;

    // Reset errors
    document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));

    // Validate transfer type
    const selectedType = document.querySelector('input[name="transferType"]:checked');
    if (!selectedType) {
        document.getElementById('transferTypeError').classList.remove('hidden');
        isValid = false;
    }

    // Validate amount
    const amount = parseFloat(transferAmountInput.value);
    if (!amount || amount <= 0) {
        document.getElementById('transferAmountError').classList.remove('hidden');
        isValid = false;
    } else if (amount > 12486.50) { // Check against available balance
        document.getElementById('transferAmountError').textContent = 'Amount exceeds available balance';
        document.getElementById('transferAmountError').classList.remove('hidden');
        isValid = false;
    }

    // Validate based on transfer type
    if (selectedType) {
        if (selectedType.value === 'internal') {
            if (!document.getElementById('recipientBank').value) {
                document.getElementById('recipientBankError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('recipientAccountNumber').value ||
                !/^[0-9]{8,15}$/.test(document.getElementById('recipientAccountNumber').value)) {
                document.getElementById('recipientAccountNumberError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('recipientName').value.trim()) {
                document.getElementById('recipientNameError').classList.remove('hidden');
                isValid = false;
            }
        } else if (selectedType.value === 'mobile-money') {
            if (!document.getElementById('mobileNetwork').value) {
                document.getElementById('mobileNetworkError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('mobileNumber').value ||
                !/^[0-9]{9}$/.test(document.getElementById('mobileNumber').value)) {
                document.getElementById('mobileNumberError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('mobileRecipientName').value.trim()) {
                document.getElementById('mobileRecipientNameError').classList.remove('hidden');
                isValid = false;
            }
        } else if (selectedType.value === 'international') {
            if (!document.getElementById('recipientCountry').value) {
                document.getElementById('recipientCountryError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('currency').value) {
                document.getElementById('currencyError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('swiftCode').value.trim()) {
                document.getElementById('swiftCodeError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('internationalAccountNumber').value.trim()) {
                document.getElementById('internationalAccountNumberError').classList.remove('hidden');
                isValid = false;
            }
            if (!document.getElementById('internationalRecipientName').value.trim()) {
                document.getElementById('internationalRecipientNameError').classList.remove('hidden');
                isValid = false;
            }
        }
    }

    return isValid;
}

// Form submission
form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
        populateReviewModal();
        reviewModal.classList.remove('hidden');
    }
});

// Populate review modal
function populateReviewModal() {
    const selectedType = document.querySelector('input[name="transferType"]:checked');
    const amount = parseFloat(transferAmountInput.value);
    const selectedSpeed = document.querySelector('input[name="transferSpeed"]:checked');
    const fee = selectedSpeed.value === 'instant' ? 2.99 : 0;
    const total = amount + fee;

    // Transfer type
    const typeLabels = {
        'internal': 'Bank Account',
        'mobile-money': 'Mobile Money',
        'international': 'International'
    };
    document.getElementById('reviewTransferType').textContent = typeLabels[selectedType.value];

    // Recipient
    let recipientText = '';
    if (selectedType.value === 'internal') {
        recipientText = document.getElementById('recipientName').value;
    } else if (selectedType.value === 'mobile-money') {
        recipientText = document.getElementById('mobileRecipientName').value;
    } else if (selectedType.value === 'international') {
        recipientText = document.getElementById('internationalRecipientName').value;
    }
    document.getElementById('reviewRecipient').textContent = recipientText;

    // Amount, fee, total
    document.getElementById('reviewTransferAmount').textContent = formatCurrency(amount);
    document.getElementById('reviewFee').textContent = fee === 0 ? 'Free' : formatCurrency(fee);
    document.getElementById('reviewTotal').textContent = formatCurrency(total);

    // Note
    const note = transferNoteInput.value.trim();
    if (note) {
        document.getElementById('reviewNote').textContent = note;
        document.getElementById('reviewNoteRow').classList.remove('hidden');
    } else {
        document.getElementById('reviewNoteRow').classList.add('hidden');
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Modal event listeners
cancelBtn.addEventListener('click', function () {
    reviewModal.classList.add('hidden');
});

confirmBtn.addEventListener('click', function () {
    reviewModal.classList.add('hidden');
    processingModal.classList.remove('hidden');

    // Simulate processing time
    setTimeout(() => {
        processingModal.classList.add('hidden');
        document.getElementById('transactionId').textContent = generateTransactionId();
        successModal.classList.remove('hidden');
    }, 3000);
});

newTransferBtn.addEventListener('click', function () {
    successModal.classList.add('hidden');
    form.reset();

    // Reset transfer type cards
    document.querySelectorAll('input[name="transferType"]').forEach(radio => {
        const card = radio.closest('label');
        card.classList.remove('ring-2', 'ring-primary', 'bg-primary/5');
    });

    // Hide all sections
    bankAccountSection.classList.add('hidden');
    mobileMoneySection.classList.add('hidden');
    internationalSection.classList.add('hidden');

    // Reset errors
    document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
});

viewTransactionBtn.addEventListener('click', function () {
    successModal.classList.add('hidden');
    // In a real app, this would navigate to transaction details
    console.log('Navigate to transaction details');
});

// Close modals when clicking outside
[reviewModal, successModal].forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Input formatting and validation
document.getElementById('recipientAccountNumber').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length >= 8) {
        document.getElementById('recipientAccountNumberError').classList.add('hidden');
    }
});

document.getElementById('mobileNumber').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    if (/^[0-9]{9}$/.test(this.value)) {
        document.getElementById('mobileNumberError').classList.add('hidden');
    }
});

document.getElementById('internationalAccountNumber').addEventListener('input', function () {
    if (this.value.trim()) {
        document.getElementById('internationalAccountNumberError').classList.add('hidden');
    }
});

// Remove errors when users type in name fields
['recipientName', 'mobileRecipientName', 'internationalRecipientName'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        if (this.value.trim()) {
            document.getElementById(id + 'Error').classList.add('hidden');
        }
    });
});

// Remove errors when users select from dropdowns
['recipientBank', 'mobileNetwork', 'recipientCountry', 'currency'].forEach(id => {
    document.getElementById(id).addEventListener('change', function () {
        if (this.value) {
            document.getElementById(id + 'Error').classList.add('hidden');
        }
    });
});

document.getElementById('swiftCode').addEventListener('input', function () {
    if (this.value.trim()) {
        document.getElementById('swiftCodeError').classList.add('hidden');
    }
});

transferAmountInput.addEventListener('input', function () {
    const amount = parseFloat(this.value);
    if (amount && amount > 0) {
        if (amount <= 12486.50) {
            document.getElementById('transferAmountError').classList.add('hidden');
        }
    }
});

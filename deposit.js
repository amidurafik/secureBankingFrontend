
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
        const form = document.getElementById('depositForm');
        const accountSelect = document.getElementById('account');
        const amountInput = document.getElementById('amount');
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const descriptionInput = document.getElementById('description');
        const mobileNetworkSection = document.getElementById('mobileNetworkSection');
        const mobileNetworkSelect = document.getElementById('mobileNetwork');
        const phoneNumberSection = document.getElementById('phoneNumberSection');
        const phoneNumberInput = document.getElementById('phoneNumber');
        
        // Debit card elements
        const debitCardSection = document.getElementById('debitCardSection');
        const cardNumberInput = document.getElementById('cardNumber');
        const cardHolderInput = document.getElementById('cardHolder');
        const expiryDateInput = document.getElementById('expiryDate');
        const cvvInput = document.getElementById('cvv');
        
        // Bank transfer elements
        const bankTransferSection = document.getElementById('bankTransferSection');
        const bankNameSelect = document.getElementById('bankName');
        const accountNumberInput = document.getElementById('accountNumber');
        const accountHolderNameInput = document.getElementById('accountHolderName');
        
        // Modal elements
        const reviewModal = document.getElementById('reviewModal');
        const successModal = document.getElementById('successModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const confirmBtn = document.getElementById('confirmBtn');
        const newDepositBtn = document.getElementById('newDepositBtn');

        // Review elements
        const reviewAccount = document.getElementById('reviewAccount');
        const reviewAmount = document.getElementById('reviewAmount');
        const reviewPayment = document.getElementById('reviewPayment');
        const reviewDescription = document.getElementById('reviewDescription');

        // Validation functions
        function validateForm() {
            let isValid = true;
            
            // Reset errors
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
            
            // Validate account
            if (!accountSelect.value) {
                document.getElementById('accountError').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate amount
            const amount = parseFloat(amountInput.value);
            if (!amount || amount <= 0) {
                document.getElementById('amountError').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate payment method
            const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
            if (!selectedPayment) {
                document.getElementById('paymentError').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate based on payment method
            if (selectedPayment) {
                if (selectedPayment.value === 'check') {
                    // Validate mobile network
                    if (!mobileNetworkSelect.value) {
                        document.getElementById('mobileNetworkError').classList.remove('hidden');
                        isValid = false;
                    }
                    // Validate phone number
                    if (mobileNetworkSelect.value && (!phoneNumberInput.value || !/^[0-9]{9}$/.test(phoneNumberInput.value))) {
                        document.getElementById('phoneNumberError').classList.remove('hidden');
                        isValid = false;
                    }
                } else if (selectedPayment.value === 'debit-card') {
                    // Validate debit card fields
                    if (!cardNumberInput.value || !/^[0-9\s]{13,19}$/.test(cardNumberInput.value.replace(/\s/g, ''))) {
                        document.getElementById('cardNumberError').classList.remove('hidden');
                        isValid = false;
                    }
                    if (!cardHolderInput.value.trim()) {
                        document.getElementById('cardHolderError').classList.remove('hidden');
                        isValid = false;
                    }
                    if (!expiryDateInput.value || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiryDateInput.value)) {
                        document.getElementById('expiryDateError').classList.remove('hidden');
                        isValid = false;
                    }
                    if (!cvvInput.value || !/^[0-9]{3,4}$/.test(cvvInput.value)) {
                        document.getElementById('cvvError').classList.remove('hidden');
                        isValid = false;
                    }
                } else if (selectedPayment.value === 'bank-transfer') {
                    // Validate bank transfer fields
                    if (!bankNameSelect.value) {
                        document.getElementById('bankNameError').classList.remove('hidden');
                        isValid = false;
                    }
                    if (!accountNumberInput.value || !/^[0-9]{8,15}$/.test(accountNumberInput.value)) {
                        document.getElementById('accountNumberError').classList.remove('hidden');
                        isValid = false;
                    }
                    if (!accountHolderNameInput.value.trim()) {
                        document.getElementById('accountHolderNameError').classList.remove('hidden');
                        isValid = false;
                    }
                }
            }
            
            return isValid;
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }

        // Get account display name
        function getAccountDisplayName(value) {
            const option = accountSelect.querySelector(`option[value="${value}"]`);
            return option ? option.textContent : value;
        }

        // Get payment method display name
        function getPaymentDisplayName(value) {
            const paymentLabels = {
                'bank-transfer': 'Bank Transfer',
                'debit-card': 'Debit Card',
                'check': 'Mobile Check Deposit'
            };
            return paymentLabels[value] || value;
        }

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Populate review modal
                const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
                
                reviewAccount.textContent = getAccountDisplayName(accountSelect.value);
                reviewAmount.textContent = formatCurrency(parseFloat(amountInput.value));
                reviewPayment.textContent = getPaymentDisplayName(selectedPayment.value);
                reviewDescription.textContent = descriptionInput.value || 'No description';
                
                // Show mobile network if check deposit is selected
                const reviewMobileNetworkRow = document.getElementById('reviewMobileNetworkRow');
                const reviewMobileNetwork = document.getElementById('reviewMobileNetwork');
                
                if (selectedPayment.value === 'check' && mobileNetworkSelect.value) {
                    const networkOption = mobileNetworkSelect.querySelector(`option[value="${mobileNetworkSelect.value}"]`);
                    reviewMobileNetwork.textContent = networkOption ? networkOption.textContent : mobileNetworkSelect.value;
                    reviewMobileNetworkRow.classList.remove('hidden');
                } else {
                    reviewMobileNetworkRow.classList.add('hidden');
                }
                
                // Show review modal
                reviewModal.classList.remove('hidden');
            }
        });

        // Cancel review
        cancelBtn.addEventListener('click', function() {
            reviewModal.classList.add('hidden');
        });

        // Confirm deposit
        confirmBtn.addEventListener('click', function() {
            reviewModal.classList.add('hidden');
            
            // Simulate processing delay
            setTimeout(() => {
                successModal.classList.remove('hidden');
            }, 500);
        });

        // New deposit
        newDepositBtn.addEventListener('click', function() {
            successModal.classList.add('hidden');
            form.reset();
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
        });

        // Close modals when clicking outside
        [reviewModal, successModal].forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Format amount input as user types
        amountInput.addEventListener('input', function() {
            let value = this.value;
            if (value && !isNaN(value)) {
                // Remove any existing error when user starts typing valid amount
                if (parseFloat(value) > 0) {
                    document.getElementById('amountError').classList.add('hidden');
                }
            }
        });

        // Remove errors when user makes selections
        accountSelect.addEventListener('change', function() {
            if (this.value) {
                document.getElementById('accountError').classList.add('hidden');
            }
        });

        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                document.getElementById('paymentError').classList.add('hidden');
                
                // Hide all payment sections first
                debitCardSection.classList.add('hidden');
                bankTransferSection.classList.add('hidden');
                mobileNetworkSection.classList.add('hidden');
                phoneNumberSection.classList.add('hidden');
                
                // Reset all form values and errors
                resetPaymentSectionErrors();
                
                // Show relevant section based on payment method
                if (this.value === 'debit-card') {
                    debitCardSection.classList.remove('hidden');
                } else if (this.value === 'bank-transfer') {
                    bankTransferSection.classList.remove('hidden');
                } else if (this.value === 'check') {
                    mobileNetworkSection.classList.remove('hidden');
                }
            });
        });
        
        // Helper function to reset payment section errors
        function resetPaymentSectionErrors() {
            const errorElements = [
                'cardNumberError', 'cardHolderError', 'expiryDateError', 'cvvError',
                'bankNameError', 'accountNumberError', 'accountHolderNameError',
                'mobileNetworkError', 'phoneNumberError'
            ];
            errorElements.forEach(id => {
                document.getElementById(id).classList.add('hidden');
            });
        }

        // Remove mobile network error when user makes selection and show phone number
        mobileNetworkSelect.addEventListener('change', function() {
            if (this.value) {
                document.getElementById('mobileNetworkError').classList.add('hidden');
                phoneNumberSection.classList.remove('hidden');
            } else {
                phoneNumberSection.classList.add('hidden');
            }
        });

        // Card number formatting and validation
        cardNumberInput.addEventListener('input', function() {
            // Remove non-digits and format with spaces
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            this.value = value;
            
            // Remove error if valid
            if (value.replace(/\s/g, '').length >= 13) {
                document.getElementById('cardNumberError').classList.add('hidden');
            }
        });

        // Expiry date formatting and validation
        expiryDateInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
            
            // Remove error if valid format
            if (/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)) {
                document.getElementById('expiryDateError').classList.add('hidden');
            }
        });

        // CVV validation
        cvvInput.addEventListener('input', function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            // Remove error if valid
            if (this.value.length >= 3) {
                document.getElementById('cvvError').classList.add('hidden');
            }
        });

        // Phone number validation
        phoneNumberInput.addEventListener('input', function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            // Remove error if valid
            if (/^[0-9]{9}$/.test(this.value)) {
                document.getElementById('phoneNumberError').classList.add('hidden');
            }
        });

        // Account number validation
        accountNumberInput.addEventListener('input', function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            // Remove error if valid
            if (this.value.length >= 8) {
                document.getElementById('accountNumberError').classList.add('hidden');
            }
        });

        // Remove errors when users type in text fields
        cardHolderInput.addEventListener('input', function() {
            if (this.value.trim()) {
                document.getElementById('cardHolderError').classList.add('hidden');
            }
        });

        accountHolderNameInput.addEventListener('input', function() {
            if (this.value.trim()) {
                document.getElementById('accountHolderNameError').classList.add('hidden');
            }
        });

        // Remove errors when users select from dropdowns
        bankNameSelect.addEventListener('change', function() {
            if (this.value) {
                document.getElementById('bankNameError').classList.add('hidden');
            }
        });
 
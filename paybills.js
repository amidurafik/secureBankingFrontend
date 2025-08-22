

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

        // Bill categories and billers data
        const billersData = {
            utilities: [
                { value: 'ecg', name: 'Electricity Company of Ghana (ECG)' },
                { value: 'gwcl', name: 'Ghana Water Company Limited' },
                { value: 'gridco', name: 'GRIDCo' },
                { value: 'ned', name: 'Northern Electricity Distribution' }
            ],
            telecom: [
                { value: 'mtn', name: 'MTN Ghana' },
                { value: 'vodafone', name: 'Vodafone Ghana' },
                { value: 'airteltigo', name: 'AirtelTigo' },
                { value: 'telecel', name: 'Telecel Ghana' }
            ],
            entertainment: [
                { value: 'dstv', name: 'DStv' },
                { value: 'gotv', name: 'GOtv' },
                { value: 'startimes', name: 'StarTimes' },
                { value: 'canal', name: 'Canal+' }
            ],
            insurance: [
                { value: 'sic', name: 'State Insurance Company' },
                { value: 'enterprise', name: 'Enterprise Insurance' },
                { value: 'metropolitan', name: 'Metropolitan Insurance' },
                { value: 'glico', name: 'GLICO General Insurance' }
            ],
            education: [
                { value: 'ucc', name: 'University of Cape Coast' },
                { value: 'ug', name: 'University of Ghana' },
                { value: 'knust', name: 'KNUST' },
                { value: 'uew', name: 'University of Education, Winneba' },
                { value: 'uenr', name: 'University of Energy and Natural Resources' },
                { value: 'uhas', name: 'University Of Health And Allied Sciences' },
                { value: 'umat', name: 'University Of Mines And Technology' },
                { value: 'upsa', name: 'University Of Professional Studies' }
            ],
            government: [
                { value: 'gra', name: 'Ghana Revenue Authority' },
                { value: 'dvla', name: 'Driver and Vehicle Licensing Authority' },
                { value: 'ssnit', name: 'Social Security and National Insurance Trust' },
                { value: 'passport', name: 'Passport Office' }
            ],
            credit: [
                { value: 'gcb-credit', name: 'GCB Bank Credit Card' },
                { value: 'ecobank-credit', name: 'Ecobank Credit Card' },
                { value: 'stanbic-credit', name: 'Stanbic Bank Credit Card' },
                { value: 'cal-credit', name: 'CAL Bank Credit Card' }
            ],
            other: [
                { value: 'rent', name: 'Rent Payment' },
                { value: 'loan', name: 'Loan Payment' },
                { value: 'subscription', name: 'Subscription Services' },
                { value: 'other-bill', name: 'Other Bills' }
            ]
        };

        // Elements
        const billCategoryCards = document.querySelectorAll('.bill-category-card');
        const billPaymentForm = document.getElementById('billPaymentForm');
        const formTitle = document.getElementById('formTitle');
        const backBtn = document.getElementById('backBtn');
        const billerSelect = document.getElementById('biller');
        const accountReferenceInput = document.getElementById('accountReference');
        const billAmountInput = document.getElementById('billAmount');
        const lookupBtn = document.getElementById('lookupBtn');
        const paymentOptions = document.querySelectorAll('input[name="paymentOption"]');
        const scheduleSection = document.getElementById('scheduleSection');
        const recurringSection = document.getElementById('recurringSection');
        const paymentForm = document.getElementById('paymentForm');
        
        // Modals
        const reviewModal = document.getElementById('reviewModal');
        const processingModal = document.getElementById('processingModal');
        const successModal = document.getElementById('successModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const confirmBtn = document.getElementById('confirmBtn');
        const newPaymentBtn = document.getElementById('newPaymentBtn');
        const viewReceiptBtn = document.getElementById('viewReceiptBtn');

        let selectedCategory = '';

        // Category selection
        billCategoryCards.forEach(card => {
            card.addEventListener('click', function() {
                selectedCategory = this.dataset.category;
                showBillForm(selectedCategory);
            });
        });

        // Show bill form
        function showBillForm(category) {
            const categoryNames = {
                utilities: 'Utilities',
                telecom: 'Telecom',
                entertainment: 'TV/Cable',
                insurance: 'Insurance',
                education: 'Education',
                government: 'Government',
                credit: 'Credit Cards',
                other: 'Other Bills'
            };

            formTitle.textContent = categoryNames[category] || 'Pay Bill';
            
            // Populate billers
            billerSelect.innerHTML = '<option value="">Choose a biller</option>';
            billersData[category].forEach(biller => {
                const option = document.createElement('option');
                option.value = biller.value;
                option.textContent = biller.name;
                billerSelect.appendChild(option);
            });

            // Update account label based on category
            const accountLabel = document.getElementById('accountLabel');
            if (category === 'telecom' || category === 'entertainment') {
                accountLabel.textContent = 'Account/Phone Number';
            } else if (category === 'credit') {
                accountLabel.textContent = 'Card Number';
            } else if (category === 'education') {
                accountLabel.textContent = 'Student ID';
            } else {
                accountLabel.textContent = 'Account Number';
            }

            billPaymentForm.classList.remove('hidden');
            lookupBtn.classList.remove('hidden');
        }

        // Back button
        backBtn.addEventListener('click', function() {
            billPaymentForm.classList.add('hidden');
            resetForm();
        });

        // Payment option change
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                scheduleSection.classList.add('hidden');
                recurringSection.classList.add('hidden');
                
                if (this.value === 'schedule') {
                    scheduleSection.classList.remove('hidden');
                } else if (this.value === 'recurring') {
                    recurringSection.classList.remove('hidden');
                }
                
                updateSubmitButton();
            });
        });

        // Update submit button text
        function updateSubmitButton() {
            const selectedOption = document.querySelector('input[name="paymentOption"]:checked');
            const submitText = document.getElementById('submitText');
            
            if (selectedOption.value === 'pay-now') {
                submitText.textContent = 'Continue to Review';
            } else if (selectedOption.value === 'schedule') {
                submitText.textContent = 'Schedule Payment';
            } else if (selectedOption.value === 'recurring') {
                submitText.textContent = 'Set Up Recurring Payment';
            }
        }

        // Account lookup
        lookupBtn.addEventListener('click', function() {
            if (accountReferenceInput.value.trim()) {
                // Simulate bill lookup
                const randomAmount = (Math.random() * 500 + 50).toFixed(2);
                billAmountInput.value = randomAmount;
                document.getElementById('outstandingValue').textContent = randomAmount;
                document.getElementById('outstandingAmount').classList.remove('hidden');
            }
        });

        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Reset errors
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
            
            // Validate biller
            if (!billerSelect.value) {
                document.getElementById('billerError').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate account reference
            if (!accountReferenceInput.value.trim()) {
                document.getElementById('accountReferenceError').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate amount
            const amount = parseFloat(billAmountInput.value);
            if (!amount || amount <= 0) {
                document.getElementById('billAmountError').classList.remove('hidden');
                isValid = false;
            }
            
            return isValid;
        }

        // Form submission
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                populateReviewModal();
                reviewModal.classList.remove('hidden');
            }
        });

        // Populate review modal
        function populateReviewModal() {
            const selectedBiller = billerSelect.options[billerSelect.selectedIndex].text;
            const amount = parseFloat(billAmountInput.value);
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
            const selectedPaymentOption = document.querySelector('input[name="paymentOption"]:checked');
            
            document.getElementById('reviewBiller').textContent = selectedBiller;
            document.getElementById('reviewAccount').textContent = accountReferenceInput.value;
            document.getElementById('reviewAmount').textContent = formatCurrency(amount);
            
            // Payment method
            const paymentMethodLabels = {
                checking: 'Checking Account (****-001)',
                savings: 'Savings Account (****-002)'
            };
            document.getElementById('reviewPaymentMethod').textContent = paymentMethodLabels[selectedPaymentMethod.value];
            
            // Payment type
            const paymentTypeLabels = {
                'pay-now': 'Pay Now',
                'schedule': 'Scheduled Payment',
                'recurring': 'Recurring Payment'
            };
            document.getElementById('reviewPaymentType').textContent = paymentTypeLabels[selectedPaymentOption.value];
            
            // Schedule info
            if (selectedPaymentOption.value === 'schedule') {
                const scheduleDate = document.getElementById('scheduleDate').value;
                const scheduleTime = document.getElementById('scheduleTime').value;
                document.getElementById('reviewSchedule').textContent = `${scheduleDate} at ${scheduleTime}`;
                document.getElementById('reviewScheduleRow').classList.remove('hidden');
            } else if (selectedPaymentOption.value === 'recurring') {
                const frequency = document.getElementById('recurringFrequency').value;
                const startDate = document.getElementById('recurringStart').value;
                document.getElementById('reviewSchedule').textContent = `${frequency} starting ${startDate}`;
                document.getElementById('reviewScheduleRow').classList.remove('hidden');
            } else {
                document.getElementById('reviewScheduleRow').classList.add('hidden');
            }
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS'
            }).format(amount);
        }

        // Generate reference number
        function generateReference() {
            return 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        // Modal event listeners
        cancelBtn.addEventListener('click', function() {
            reviewModal.classList.add('hidden');
        });

        confirmBtn.addEventListener('click', function() {
            reviewModal.classList.add('hidden');
            processingModal.classList.remove('hidden');
            
            // Simulate processing time
            setTimeout(() => {
                processingModal.classList.add('hidden');
                document.getElementById('paymentReference').textContent = generateReference();
                successModal.classList.remove('hidden');
            }, 3000);
        });

        newPaymentBtn.addEventListener('click', function() {
            successModal.classList.add('hidden');
            billPaymentForm.classList.add('hidden');
            resetForm();
        });

        viewReceiptBtn.addEventListener('click', function() {
            successModal.classList.add('hidden');
            // In a real app, this would show the receipt
            console.log('Show receipt');
        });

        // Reset form
        function resetForm() {
            paymentForm.reset();
            scheduleSection.classList.add('hidden');
            recurringSection.classList.add('hidden');
            document.getElementById('outstandingAmount').classList.add('hidden');
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
            updateSubmitButton();
        }

        // Close modals when clicking outside
        [reviewModal, successModal].forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Input validation and formatting
        billAmountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value);
            if (amount && amount > 0) {
                document.getElementById('billAmountError').classList.add('hidden');
            }
        });

        accountReferenceInput.addEventListener('input', function() {
            if (this.value.trim()) {
                document.getElementById('accountReferenceError').classList.add('hidden');
            }
        });

        billerSelect.addEventListener('change', function() {
            if (this.value) {
                document.getElementById('billerError').classList.add('hidden');
            }
        });

        // Set minimum date for scheduling
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('scheduleDate').min = today;
        document.getElementById('recurringStart').min = today;

        // Quick action buttons
        const recentBillsBtn = document.getElementById('recentBillsBtn');
        const autoPayBtn = document.getElementById('autoPayBtn');
        const scheduledBtn = document.getElementById('scheduledBtn');
        const historyBtn = document.getElementById('historyBtn');

        // Quick action modals
        const recentBillsModal = document.getElementById('recentBillsModal');
        const autoPayModal = document.getElementById('autoPayModal');
        const scheduledModal = document.getElementById('scheduledModal');
        const historyModal = document.getElementById('historyModal');

        // Close buttons for quick action modals
        const closeRecentBills = document.getElementById('closeRecentBills');
        const closeAutoPay = document.getElementById('closeAutoPay');
        const closeScheduled = document.getElementById('closeScheduled');
        const closeHistory = document.getElementById('closeHistory');

        // Quick action button event listeners
        recentBillsBtn.addEventListener('click', function() {
            recentBillsModal.classList.remove('hidden');
        });

        autoPayBtn.addEventListener('click', function() {
            autoPayModal.classList.remove('hidden');
        });

        scheduledBtn.addEventListener('click', function() {
            scheduledModal.classList.remove('hidden');
        });

        historyBtn.addEventListener('click', function() {
            historyModal.classList.remove('hidden');
        });

        // Close button event listeners
        closeRecentBills.addEventListener('click', function() {
            recentBillsModal.classList.add('hidden');
        });

        closeAutoPay.addEventListener('click', function() {
            autoPayModal.classList.add('hidden');
        });

        closeScheduled.addEventListener('click', function() {
            scheduledModal.classList.add('hidden');
        });

        closeHistory.addEventListener('click', function() {
            historyModal.classList.add('hidden');
        });

        // Close quick action modals when clicking outside
        [recentBillsModal, autoPayModal, scheduledModal, historyModal].forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Initialize
        updateSubmitButton();

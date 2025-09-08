// Contact page functionality for SUPER VITRIER website
document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    setupFAQ();
    
    // Form enhancements
    setupContactForm();
});

// Setup FAQ accordion functionality
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');
            const isOpen = !answer.classList.contains('hidden');
            
            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('svg');
                    
                    otherAnswer.classList.add('hidden');
                    otherAnswer.classList.remove('show');
                    otherIcon.style.transform = 'rotate(0deg)';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                answer.classList.add('hidden');
                answer.classList.remove('show');
                icon.style.transform = 'rotate(0deg)';
                question.setAttribute('aria-expanded', 'false');
            } else {
                answer.classList.remove('hidden');
                answer.classList.add('show');
                icon.style.transform = 'rotate(180deg)';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Setup contact form enhancements
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = this;
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
                <div class="loading"></div>
                <span data-translate-key="contact.sending">${getTranslation('contact.sending', currentLanguage)}</span>
            </div>
        `;
        submitButton.disabled = true;
        
        // Submit to Formspree using fetch
        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                showNotification(getTranslation('contact.success_notification', currentLanguage), 'success');
                form.reset();
                // Also clear any lingering validation styles
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => clearFieldError(input));
            } else {
                response.json().then(data => {
                    const errorMessage = data.errors ? data.errors.map(error => error.message).join(', ') : 'An unknown error occurred.';
                    showNotification(`Error: ${errorMessage}`, 'error');
                }).catch(() => {
                    showNotification('An error occurred while submitting the form.', 'error');
                });
            }
        }).catch(error => {
            showNotification('Network error. Please check your connection and try again.', 'error');
        }).finally(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Form validation
function validateForm(data) {
    let isValid = true;
    
    // Required fields
    const requiredFields = ['name', 'email', 'message'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, getTranslation('contact.validation.required', currentLanguage));
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', getTranslation('contact.validation.email', currentLanguage));
        isValid = false;
    }
    
    // Phone validation (if provided)
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', getTranslation('contact.validation.phone', currentLanguage));
        isValid = false;
    }
    
    // Consent checkbox
    if (!data.consent) {
        showFieldError('consent', getTranslation('contact.validation.consent', currentLanguage));
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const name = input.name;
    
    clearFieldError(input);
    
    // Required field validation
    if (input.required && !value) {
        showFieldError(name, getTranslation('contact.validation.required', currentLanguage));
        return false;
    }
    
    // Email validation
    if (name === 'email' && value && !isValidEmail(value)) {
        showFieldError(name, getTranslation('contact.validation.email', currentLanguage));
        return false;
    }
    
    // Phone validation
    if (name === 'phone' && value && !isValidPhone(value)) {
        showFieldError(name, getTranslation('contact.validation.phone', currentLanguage));
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remove existing error
    clearFieldError(field);
    
    // Add error styling
    field.classList.add('border-red-500', 'focus:ring-red-500');
    field.classList.remove('border-gray-300', 'focus:ring-blue-500');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1 field-error';
    errorDiv.textContent = message;
    
    // Insert error message
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    // Remove error styling
    field.classList.remove('border-red-500', 'focus:ring-red-500');
    field.classList.add('border-gray-300', 'focus:ring-blue-500');
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
                ${type === 'success' ? 
                    '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' :
                    '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
                }
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button class="flex-shrink-0 ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}
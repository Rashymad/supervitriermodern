// Main JavaScript file for SUPER VITRIER website
let currentLanguage = 'fr'; // Set 'fr' as the default language

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Setup the language toggle button
    const languageToggleButton = document.getElementById('language-toggle-button');
    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', () => {
            const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
            setLanguage(newLang);
        });
    }

    // Set the initial language of the page
    setLanguage(currentLanguage);

    // Lazy loading for images
    initLazyLoading();
});

/**
 * Sets the language of the page by updating all elements with a `data-translate-key`.
 * @param {string} lang - The language to set ('fr' or 'en').
 */
function setLanguage(lang) {
    if (!['fr', 'en'].includes(lang)) return;
    currentLanguage = lang;
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll('[data-translate-key]');
    elements.forEach(el => {
        const key = el.dataset.translateKey;
        const translation = getTranslation(key, lang);
        if (translation) {
            // Use innerHTML to support simple HTML tags like &copy;
            el.innerHTML = translation;
        }
    });

    // Update the language toggle button text
    const languageToggleButton = document.getElementById('language-toggle-button');
    if (languageToggleButton) {
        const buttonSpan = languageToggleButton.querySelector('span');
        buttonSpan.textContent = getTranslation('lang_toggle', lang);
    }
}

/**
 * Retrieves a translation string from the translations object using a dot-notation key.
 * @param {string} key - The key for the translation (e.g., 'hero.title').
 * @param {string} lang - The language to use.
 * @returns {string|null} The translated string or null if not found.
 */
function getTranslation(key, lang) {
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            // Fallback to French if the key is not found in the current language
            let fallbackResult = translations.fr;
            for (const fk of keys) {
                fallbackResult = fallbackResult?.[fk];
            }
            return fallbackResult || key; // Return the key itself as a last resort
        }
    }
    return result;
}

// Initialize lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Utility function for smooth scrolling
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
    if (window.innerWidth >= 768) {
        // Close mobile menu on desktop
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
}, 250));

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
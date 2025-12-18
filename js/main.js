// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');

    // Enhanced loading page management
    let loadingPercentage = 0;
    const loadingProgressBar = document.querySelector('.loading-progress');
    const loadingPercentageText = document.querySelector('.loading-percentage');
    
    // Simulate loading progress
    const loadingInterval = setInterval(() => {
        loadingPercentage += Math.random() * 15;
        if (loadingPercentage > 100) loadingPercentage = 100;
        
        if (loadingProgressBar) {
            loadingProgressBar.style.width = loadingPercentage + '%';
        }
        if (loadingPercentageText) {
            loadingPercentageText.textContent = Math.floor(loadingPercentage) + '%';
        }
        
        if (loadingPercentage >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                const loadingPage = document.getElementById('loading-page');
                if (loadingPage) {
                    console.log('Hiding loading page');
                    loadingPage.classList.add('fade-out');
                }
            }, 500);
        }
    }, 100);

    // Loading Animation (fallback)
    const loaderWrapper = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loaderWrapper) {
                loaderWrapper.classList.add('fade-out');
            }
        }, 500);
    });

    // ===== DARK MODE FUNCTIONALITY (FIXED) =====
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const body = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;

    // Apply initial theme
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', 'true');
        }
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            
            const isDarkMode = body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                // Switch to light mode
                body.classList.remove('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                themeToggle.setAttribute('aria-pressed', 'false');
                localStorage.setItem('theme', 'light');
                console.log('Switched to light mode');
            } else {
                // Switch to dark mode
                body.classList.add('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                themeToggle.setAttribute('aria-pressed', 'true');
                localStorage.setItem('theme', 'dark');
                console.log('Switched to dark mode');
            }

            // Announce theme change to screen readers
            const announcement = isDarkMode ? 'Light theme activated' : 'Dark theme activated';
            announceToScreenReader(announcement);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            } else {
                body.classList.remove('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        }
    });

    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // ===== MOBILE NAVIGATION =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const navMenu = document.querySelector('.nav-menu');

    function openMobileMenu() {
        if (navMenu) {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu?.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn?.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnMenuBtn && navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===== CUSTOM CURSOR =====
    const cursor = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursor && cursorOutline && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            }, 100);
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
            cursorOutline.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-category, .filter-btn');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorOutline.style.transform = 'scale(1.5)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
            });
        });
    }

    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Keyboard accessibility
        scrollTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== PROJECT FILTER FUNCTIONALITY =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter project cards
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .education-card, .certification-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('.form-control');

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        const showError = (input, message) => {
            input.classList.add('error');
            const errorElement = input.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        };

        const hideError = (input) => {
            input.classList.remove('error');
            const errorElement = input.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        };

        const validateInput = (input) => {
            const value = input.value.trim();
            const type = input.type;
            const name = input.name;

            hideError(input);

            if (!value && input.hasAttribute('required')) {
                showError(input, 'This field is required.');
                return false;
            }

            if (type === 'email' && value && !validateEmail(value)) {
                showError(input, 'Please enter a valid email address.');
                return false;
            }

            if (name === 'name' && value && value.length < 2) {
                showError(input, 'Name must be at least 2 characters long.');
                return false;
            }

            return true;
        };

        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                try {
                    // Simulate form submission
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    announceToScreenReader('Message sent successfully!');
                    contactForm.reset();
                    
                    // Show success message
                    const successDiv = document.createElement('div');
                    successDiv.className = 'alert alert-success';
                    successDiv.textContent = 'Thank you! Your message has been sent successfully.';
                    contactForm.appendChild(successDiv);
                    
                    setTimeout(() => {
                        if (successDiv.parentNode) {
                            successDiv.parentNode.removeChild(successDiv);
                        }
                    }, 5000);
                    
                } catch (error) {
                    announceToScreenReader('Error sending message. Please try again.');
                    console.error('Form submission error:', error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } else {
                announceToScreenReader('Please correct the errors in the form.');
                const firstErrorField = contactForm.querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    console.log('All functionality initialized successfully');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Page is visible');
    } else {
        console.log('Page is hidden');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}

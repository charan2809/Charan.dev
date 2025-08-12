/**
 * TECHCORP PREMIUM CORPORATE WEBSITE JAVASCRIPT
 * ============================================
 * 
 * Features:
 * - Theme toggle functionality
 * - Smooth scroll animations
 * - Parallax effects
 * - Form validation and handling
 * - Navigation interactions
 * - Testimonial carousel
 * - Counter animations
 * - Intersection Observer for scroll animations
 * - Performance optimizations
 */

class TechcorpWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initTheme();
        this.initScrollAnimations();
        this.initNavigation();
        this.initTestimonialCarousel();
        this.initCounterAnimations();
        this.initFormValidation();
        this.initSmoothScrolling();
        this.initParallaxEffects();
        this.handleVideoPlayback();
    }

    // Theme Toggle Functionality
    initTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        const defaultDark = prefersDark.matches;
        
        if (savedTheme === 'dark' || (!savedTheme && defaultDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add smooth transition effect
            document.documentElement.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });

        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    // Navigation Functionality
    initNavigation() {
        const nav = document.querySelector('.nav');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu?.classList.toggle('active');
            
            // Animate hamburger
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.setAttribute('aria-expanded', 'false');
                navToggle?.classList.remove('active');
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav?.style.setProperty('transform', 'translateY(-100%)');
            } else {
                nav?.style.setProperty('transform', 'translateY(0)');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });

        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                    navLinks.forEach(link => link.classList.remove('active'));
                    activeLink?.classList.add('active');
                }
            });
        }, { threshold: 0.6 });

        sections.forEach(section => navObserver.observe(section));
    }

    // Scroll Animations
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseFloat(delay) * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Testimonial Carousel
    initTestimonialCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialBtns = document.querySelectorAll('.testimonial-btn');
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            testimonialCards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            
            testimonialBtns.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide);
        };

        const startAutoPlay = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(slideInterval);
        };

        // Button controls
        testimonialBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        // Auto-play
        startAutoPlay();

        // Pause on hover
        const testimonialCarousel = document.querySelector('.testimonials-carousel');
        testimonialCarousel?.addEventListener('mouseenter', stopAutoPlay);
        testimonialCarousel?.addEventListener('mouseleave', startAutoPlay);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
                showSlide(currentSlide);
                stopAutoPlay();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            }
        });
    }

    // Counter Animations
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Form Validation and Handling
    initFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactForm) return;

        const validateField = (field) => {
            const errorElement = document.getElementById(`${field.name}-error`);
            let isValid = true;
            let errorMessage = '';

            // Clear previous errors
            field.classList.remove('error');
            if (errorElement) errorElement.textContent = '';

            // Required field validation
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = `${field.labels[0]?.textContent || field.name} is required.`;
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Message length validation
            if (field.name === 'message' && field.value.length > 0 && field.value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }

            if (!isValid) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                }
            }

            return isValid;
        };

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Focus on first error field
                const firstError = contactForm.querySelector('.error');
                firstError?.focus();
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                this.showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                
            } catch (error) {
                this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Parallax Effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-video, .about-image img, .product-image img');
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;
                
                if (isVisible) {
                    const speed = 0.1 + (index * 0.05); // Different speeds for different elements
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Video Handling
    handleVideoPlayback() {
        const heroVideo = document.querySelector('.hero-video');
        
        if (!heroVideo) return;

        // Intersection Observer for video performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => {
                        console.log('Video autoplay failed:', e);
                        // Fallback: add poster image or show static background
                        heroVideo.style.display = 'none';
                    });
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.25 });

        videoObserver.observe(heroVideo);

        // Handle video loading errors
        heroVideo.addEventListener('error', () => {
            heroVideo.style.display = 'none';
            // Add fallback background image to hero section
            const heroSection = document.querySelector('.hero');
            heroSection?.style.setProperty('background-image', 
                'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")');
            heroSection?.style.setProperty('background-size', 'cover');
            heroSection?.style.setProperty('background-position', 'center');
        });

        // Reduce motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            heroVideo.pause();
            heroVideo.style.display = 'none';
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Close functionality
        const closeBtn = notification.querySelector('.notification__close');
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        };

        closeBtn.addEventListener('click', closeNotification);

        // Auto close after 5 seconds
        setTimeout(closeNotification, 5000);
    }

    // Utility function for debouncing
    debounce(func, wait) {
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

    // Setup Event Listeners
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            // Recalculate layouts if needed
            this.handleResize();
        }, 250));

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            const heroVideo = document.querySelector('.hero-video');
            if (document.hidden) {
                heroVideo?.pause();
            } else {
                heroVideo?.play().catch(e => console.log('Video play failed:', e));
            }
        });

        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => {
            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.setAttribute('aria-expanded', 'false');
                    navToggle?.focus();
                }
            }
        });

        // Handle scroll to top
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Add scroll to top button (optional)
        if (window.scrollY > 300) {
            this.showScrollToTopButton();
        }

        window.addEventListener('scroll', this.debounce(() => {
            if (window.scrollY > 300) {
                this.showScrollToTopButton();
            } else {
                this.hideScrollToTopButton();
            }
        }, 100));
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    }

    showScrollToTopButton() {
        let scrollBtn = document.querySelector('.scroll-to-top');
        if (!scrollBtn) {
            scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.innerHTML = '↑';
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
            `;
            
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            document.body.appendChild(scrollBtn);
        }
        
        scrollBtn.style.opacity = '1';
        scrollBtn.style.transform = 'translateY(0)';
    }

    hideScrollToTopButton() {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    }
}

// Performance optimization: Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TechcorpWebsite();
    });
} else {
    new TechcorpWebsite();
}

// Handle page load performance
window.addEventListener('load', () => {
    // Mark interactive time for performance monitoring
    if ('performance' in window && 'mark' in window.performance) {
        window.performance.mark('techcorp-interactive');
    }
    
    // Remove loading class if present
    document.body.classList.remove('loading');
    
    // Optimize images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechcorpWebsite;
}

// Service Worker Registration (Progressive Web App features)
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
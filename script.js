// ===================================
// GLOBAL VARIABLES AND STATE
// ===================================
let currentTheme = localStorage.getItem('theme') || 'light';
let currentTestimonial = 0;
let currentCaseStudy = 0;
let testimonialInterval;
let isScrolling = false;

// Portfolio filter state
let currentFilter = 'all';

// ===================================
// DOM CONTENT LOADED EVENT
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollAnimations();
    initializeSkillBars();
    initializePortfolioFilters();
    initializeCaseStudies();
    initializeTestimonials();
    initializeContactForm();
    initializeModal();
    initializeSmoothScrolling();
    
    // Start auto-play for testimonials
    startTestimonialAutoPlay();
    
    console.log('WebCraft Agency website initialized successfully!');
});

// ===================================
// THEME MANAGEMENT
// ===================================
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Apply saved theme
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Theme toggle event listener
    themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const body = document.body;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class for smooth theme change
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Update theme
    currentTheme = newTheme;
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update icon
    updateThemeIcon();
    
    // Remove transition after change
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    if (icon) {
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===================================
// NAVIGATION
// ===================================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    
    // Mobile menu toggle
    hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Initial active link
    updateActiveNavLink();
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu?.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.style.overflow = '';
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all sections and animated elements
    const sections = document.querySelectorAll('section');
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    
    sections.forEach(section => {
        section.classList.add('fade-in-on-scroll');
        observer.observe(section);
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger skill bar animations if in about section
            if (entry.target.id === 'about') {
                animateSkillBars();
            }
        }
    });
}

// ===================================
// SKILL BARS ANIMATION
// ===================================
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, index * 200);
    });
}

// ===================================
// PORTFOLIO FILTERS
// ===================================
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilterClick(button));
    });
}

function handleFilterClick(button) {
    const filter = button.getAttribute('data-filter');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter portfolio items
    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    currentFilter = filter;
}

// ===================================
// CASE STUDIES CAROUSEL
// ===================================
function initializeCaseStudies() {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const indicators = document.querySelectorAll('.case-study-indicators .indicator');
    
    // Initialize first case study as active
    if (caseStudyCards.length > 0) {
        showCaseStudy(0);
    }
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showCaseStudy(index));
    });
}

function navigateCaseStudy(direction) {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const totalCards = caseStudyCards.length;
    
    currentCaseStudy += direction;
    
    if (currentCaseStudy >= totalCards) {
        currentCaseStudy = 0;
    } else if (currentCaseStudy < 0) {
        currentCaseStudy = totalCards - 1;
    }
    
    showCaseStudy(currentCaseStudy);
}

function showCaseStudy(index) {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const indicators = document.querySelectorAll('.case-study-indicators .indicator');
    
    // Hide all cards
    caseStudyCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Update indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show selected card and indicator
    if (caseStudyCards[index]) {
        caseStudyCards[index].classList.add('active');
    }
    
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentCaseStudy = index;
}

// ===================================
// TESTIMONIALS SLIDER
// ===================================
function initializeTestimonials() {
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    
    if (testimonialCards.length === 0) return;
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showTestimonial(index);
            restartTestimonialAutoPlay();
        });
    });
    
    // Show first testimonial
    showTestimonial(0);
}

function navigateTestimonial(direction) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const totalCards = testimonialCards.length;
    
    currentTestimonial += direction;
    
    if (currentTestimonial >= totalCards) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = totalCards - 1;
    }
    
    showTestimonial(currentTestimonial);
    restartTestimonialAutoPlay();
}

function showTestimonial(index) {
    const testimonialTrack = document.querySelector('.testimonial-track');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    
    if (!testimonialTrack) return;
    
    // Calculate transform
    const translateX = -index * 100;
    testimonialTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTestimonial = index;
}

function startTestimonialAutoPlay() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialCards.length <= 1) return;
    
    testimonialInterval = setInterval(() => {
        navigateTestimonial(1);
    }, 5000);
}

function restartTestimonialAutoPlay() {
    clearInterval(testimonialInterval);
    startTestimonialAutoPlay();
}

// ===================================
// CONTACT FORM VALIDATION
// ===================================
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form?.querySelectorAll('input, textarea, select');
    
    if (!form) return;
    
    // Add real-time validation
    inputs?.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long.';
            isValid = false;
        }
    }
    
    // Message validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long.';
            isValid = false;
        }
    }
    
    // Show error if field is invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.style.borderColor = '#ef4444';
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    field.style.borderColor = '';
}

function getFieldLabel(fieldName) {
    const labels = {
        name: 'Full Name',
        email: 'Email Address',
        company: 'Company',
        budget: 'Project Budget',
        message: 'Project Details'
    };
    
    return labels[fieldName] || fieldName;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    const submitButton = form.querySelector('.submit-button');
    
    let isFormValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.closest('.form-group').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Show success message
        showFormSuccessMessage();
        
        // Reset form
        form.reset();
        
    }, 2000);
}

function showFormSuccessMessage() {
    // Create and show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
        ">
            ✓ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
        </div>
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(successMessage, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// ===================================
// MODAL FUNCTIONALITY
// ===================================
function initializeModal() {
    const modal = document.getElementById('portfolio-modal');
    
    // Close modal when clicking outside
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            closePortfolioModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.style.display === 'block') {
            closePortfolioModal();
        }
    });
}

function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolio-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    if (!projectData) return;
    
    // Populate modal content
    modalBody.innerHTML = createModalContent(projectData);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal appearance
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    
    if (!modal) return;
    
    // Animate modal disappearance
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.9)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function getProjectData(projectId) {
    const projects = {
        project1: {
            title: 'TechCorp Corporate Website',
            category: 'Web Development',
            client: 'TechCorp Solutions',
            duration: '3 months',
            year: '2023',
            technologies: ['React', 'Next.js', 'GSAP', 'Tailwind CSS'],
            description: 'A modern corporate website built for TechCorp Solutions, featuring advanced animations and interactive elements.',
            challenge: 'TechCorp needed a website that would reflect their innovative approach while maintaining corporate professionalism.',
            solution: 'We created a modern, animated website with smooth transitions and interactive elements that showcase their services.',
            results: ['300% increase in lead generation', '150% longer average session time', '95% client satisfaction score'],
            features: ['Responsive Design', 'Advanced Animations', 'SEO Optimized', 'Performance Optimized']
        },
        project2: {
            title: 'FinanceApp Dashboard',
            category: 'UI/UX Design',
            client: 'FinanceApp Inc.',
            duration: '4 months',
            year: '2023',
            technologies: ['Vue.js', 'D3.js', 'Chart.js', 'Vuetify'],
            description: 'An intuitive financial dashboard with comprehensive data visualization and user-friendly interface.',
            challenge: 'Complex financial data needed to be presented in an accessible and visually appealing way.',
            solution: 'We designed a clean, intuitive dashboard with interactive charts and streamlined user flows.',
            results: ['400% improvement in user engagement', '60% reduction in support tickets', '98% user satisfaction'],
            features: ['Data Visualization', 'Real-time Updates', 'Interactive Charts', 'Mobile Responsive']
        },
        project3: {
            title: 'Startup Landing Page',
            category: 'Landing Page',
            client: 'InnovateLab',
            duration: '1 month',
            year: '2023',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
            description: 'A high-converting landing page designed to attract investors and customers for a promising startup.',
            challenge: 'Creating a compelling narrative that would resonate with both investors and potential customers.',
            solution: 'We crafted a conversion-focused design with clear value propositions and compelling CTAs.',
            results: ['520% increase in lead generation', '13.2% conversion rate', '$2.3M funding raised'],
            features: ['Conversion Optimization', 'A/B Testing', 'Analytics Integration', 'Fast Loading']
        },
        project4: {
            title: 'Fashion E-commerce Platform',
            category: 'E-commerce',
            client: 'FashionForward',
            duration: '6 months',
            year: '2023',
            technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
            description: 'A complete e-commerce solution for a fashion retailer with custom features and seamless user experience.',
            challenge: 'Building a scalable e-commerce platform that could handle high traffic during sales events.',
            solution: 'We developed a robust platform with advanced features like wishlist, reviews, and recommendation engine.',
            results: ['250% increase in online sales', '40% higher average order value', '92% customer retention'],
            features: ['Shopping Cart', 'Payment Integration', 'Inventory Management', 'User Reviews']
        },
        project5: {
            title: 'Restaurant Chain Website',
            category: 'Web Development',
            client: 'Gourmet Delights',
            duration: '2 months',
            year: '2023',
            technologies: ['Vue.js', 'Nuxt.js', 'PWA', 'Firebase'],
            description: 'A multi-location restaurant website with online ordering and table reservation system.',
            challenge: 'Creating a unified experience across multiple restaurant locations with varying menus.',
            solution: 'We built a flexible CMS that allows each location to manage their menu while maintaining brand consistency.',
            results: ['180% increase in online orders', '45% reduction in phone orders', '85% customer satisfaction'],
            features: ['Online Ordering', 'Table Reservations', 'Location Finder', 'Menu Management']
        },
        project6: {
            title: 'Educational Platform',
            category: 'Web Application',
            client: 'EduTech Solutions',
            duration: '5 months',
            year: '2023',
            technologies: ['React', 'TypeScript', 'WebRTC', 'Socket.io'],
            description: 'An interactive learning platform with video conferencing and progress tracking capabilities.',
            challenge: 'Building a scalable platform that could support thousands of concurrent users during live sessions.',
            solution: 'We implemented a microservices architecture with real-time communication and robust video streaming.',
            results: ['500% increase in user engagement', '78% course completion rate', '94% instructor satisfaction'],
            features: ['Video Conferencing', 'Progress Tracking', 'Interactive Quizzes', 'Discussion Forums']
        }
    };
    
    return projects[projectId];
}

function createModalContent(project) {
    return `
        <div class="modal-project-content">
            <div class="project-header">
                <div class="project-image-placeholder">
                    <i class="fas fa-laptop-code"></i>
                    <span>${project.title}</span>
                </div>
                <div class="project-meta">
                    <h2>${project.title}</h2>
                    <div class="project-details">
                        <span><strong>Client:</strong> ${project.client}</span>
                        <span><strong>Duration:</strong> ${project.duration}</span>
                        <span><strong>Year:</strong> ${project.year}</span>
                        <span><strong>Category:</strong> ${project.category}</span>
                    </div>
                </div>
            </div>
            
            <div class="project-description">
                <h3>Project Overview</h3>
                <p>${project.description}</p>
            </div>
            
            <div class="project-challenge-solution">
                <div class="challenge">
                    <h3>The Challenge</h3>
                    <p>${project.challenge}</p>
                </div>
                <div class="solution">
                    <h3>Our Solution</h3>
                    <p>${project.solution}</p>
                </div>
            </div>
            
            <div class="project-technologies">
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="project-features">
                <h3>Key Features</h3>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-results">
                <h3>Results</h3>
                <ul>
                    ${project.results.map(result => `<li>${result}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <style>
            .modal-project-content {
                max-width: 100%;
            }
            
            .project-header {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .project-image-placeholder {
                width: 200px;
                height: 150px;
                background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
                border-radius: 0.75rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary);
                font-size: 2rem;
            }
            
            .project-image-placeholder span {
                font-size: 0.75rem;
                margin-top: 0.5rem;
                text-align: center;
            }
            
            .project-meta h2 {
                color: var(--text-primary);
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .project-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .project-description,
            .project-challenge-solution,
            .project-technologies,
            .project-features,
            .project-results {
                margin-bottom: 2rem;
            }
            
            .project-challenge-solution {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            
            .project-description h3,
            .challenge h3,
            .solution h3,
            .project-technologies h3,
            .project-features h3,
            .project-results h3 {
                color: var(--text-primary);
                margin-bottom: 1rem;
                font-size: 1.125rem;
            }
            
            .project-description p,
            .challenge p,
            .solution p {
                color: var(--text-secondary);
                line-height: 1.6;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .tech-tag {
                background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .project-features ul,
            .project-results ul {
                list-style: none;
                padding: 0;
            }
            
            .project-features li,
            .project-results li {
                color: var(--text-secondary);
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
            }
            
            .project-features li::before,
            .project-results li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--primary-color);
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .project-header {
                    grid-template-columns: 1fr;
                    text-align: center;
                }
                
                .project-image-placeholder {
                    margin: 0 auto;
                }
                
                .project-details {
                    grid-template-columns: 1fr;
                }
                
                .project-challenge-solution {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
            }
        </style>
    `;
}

// ===================================
// BLOG POST MODAL (placeholder)
// ===================================
function openBlogPost(postId) {
    alert(`Opening blog post: ${postId}\n\nThis would open a detailed view of the blog post. In a real implementation, this would load the full article content.`);
}

// ===================================
// SMOOTH SCROLLING
// ===================================
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            event.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===================================
// PERFORMANCE MONITORING
// ===================================
function measurePerformance() {
    // Web Vitals measurement
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const paintMetrics = performance.getEntriesByType('paint');
                const navigationMetrics = performance.getEntriesByType('navigation')[0];
                
                console.log('Performance Metrics:');
                console.log('FCP:', paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime);
                console.log('LCP:', paintMetrics.find(m => m.name === 'largest-contentful-paint')?.startTime);
                console.log('Load Time:', navigationMetrics?.loadEventEnd - navigationMetrics?.navigationStart);
            }, 1000);
        });
    }
}

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    
    // In production, you might want to send this to an error reporting service
    // sendErrorToService(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default browser error handling
    event.preventDefault();
});

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
function enhanceAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.filter-btn, .case-study-nav, .testimonial-nav');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                element.click();
            }
        });
    });
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    enhanceAccessibility();
    measurePerformance();
});

// ===================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ===================================
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;
window.navigateCaseStudy = navigateCaseStudy;
window.navigateTestimonial = navigateTestimonial;
window.openBlogPost = openBlogPost;
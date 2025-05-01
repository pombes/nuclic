document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading time
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);

    // Scroll to section if coming from publications page
    const sectionToScroll = sessionStorage.getItem('scrollToSection');
    if (sectionToScroll && window.location.pathname.includes('index.html')) {
        setTimeout(() => {
            const targetElement = document.getElementById(sectionToScroll);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            // Clear the storage after scrolling
            sessionStorage.removeItem('scrollToSection');
        }, 500); // Small delay to ensure the page is fully loaded
    }

    // Initialize all animations and event listeners
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initAnimatedHeroText();
    initInfiniteSlider();
});

// Navigation and Mobile Menu
function initNavigation() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const bodyElement = document.body;

    // Add preloader to DOM if not present
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(preloader);
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle with animation
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // No need to disable body scrolling for small dropdown menu
            // Just close menu when clicking outside
            if (nav.classList.contains('active')) {
                // Add event listener to close menu when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', closeMenuOnClickOutside);
                }, 10);
            } else {
                // Remove event listener when menu is closed
                document.removeEventListener('click', closeMenuOnClickOutside);
            }
        });
    }

    // Close mobile menu when clicking a nav link with animation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const nav = document.querySelector('nav'); // Ensure nav is accessible
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle'); // Ensure toggle is accessible

            if (nav && nav.classList.contains('active')) {
                // Prevent default behavior
                e.preventDefault();
                
                // Get the href attribute
                const href = link.getAttribute('href');
                
                // Close menu immediately
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
                nav.classList.remove('active');
                document.removeEventListener('click', closeMenuOnClickOutside); // Ensure listener is removed
                
                // Handle navigation based on href
                if (href.startsWith('#')) {
                    // Internal anchor link on the current page
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Update active class before scrolling
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                        
                        // Use GSAP smooth scroll if available, otherwise native
                        if (gsap && gsap.plugins.scrollTo) {
                             gsap.to(window, { duration: 0.8, scrollTo: { y: href, offsetY: 70 }, ease: 'power2.out', autoKill: true });
                        } else {
                            window.scrollTo({
                                top: targetElement.offsetTop - 70,
                                behavior: 'smooth'
                            });
                        }
                    }
                } else if (href.includes('#')) {
                    // Link to another page with an anchor (e.g., index.html#mission)
                    const [page, anchor] = href.split('#');
                    sessionStorage.setItem('scrollToSection', `#${anchor}`);
                    window.location.href = page; // Navigate to the page
                } else {
                    // Link to another page without an anchor (e.g., publications.html)
                    window.location.href = href; // Navigate directly
                }
            } else if (!href.startsWith('#') && !href.includes('#')) {
                 // Allow default navigation for external links when menu is not active (desktop view)
                 // Or handle specific logic if needed for desktop external links clicked via JS
            } else if (href.startsWith('#')) {
                 // Handle internal anchor clicks for desktop view if menu isn't active
                 const targetElement = document.querySelector(href);
                 if (targetElement) {
                      e.preventDefault(); // Prevent default jump
                      // Update active class
                      navLinks.forEach(l => l.classList.remove('active'));
                      link.classList.add('active');
                      // Use GSAP smooth scroll
                      if (gsap && gsap.plugins.scrollTo) {
                           gsap.to(window, { duration: 0.8, scrollTo: { y: href, offsetY: 70 }, ease: 'power2.out', autoKill: true });
                      } else {
                           window.scrollTo({
                                top: targetElement.offsetTop - 70,
                                behavior: 'smooth'
                           });
                      }
                 }
            }
            // Note: The desktop link handling might need refinement based on exact desired behavior
        });
    });

    // Active nav link on scroll
    updateActiveNavOnScroll();
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

// Function to close menu when clicking outside
function closeMenuOnClickOutside(event) {
    const nav = document.querySelector('nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    // If click is outside menu and toggle button, close menu
    if (nav && mobileMenuToggle) {
        if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
    const sections = ['home', 'expertise', 'services', 'projects', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Add offset for better detection
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (!sectionElement) return;
        
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations with GSAP and ScrollTrigger
function initScrollAnimations() {
    // Initialize GSAP ScrollTrigger and ScrollToPlugin
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Refresh ScrollTrigger on window resize, debounced for performance
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
    
    // Create a more advanced scroll direction detector
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                let st = window.pageYOffset || document.documentElement.scrollTop;
                scrollDirection = st > lastScrollTop ? 'down' : 'up';
                lastScrollTop = st <= 0 ? 0 : st;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Animate hero section elements on page load
    gsap.to('.hero-text.gsap-fade-up', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.to('.hero-image.gsap-fade-left', {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    // Animation for publications image
    gsap.utils.toArray('.publications-image.gsap-fade-right').forEach(image => {
        gsap.fromTo(image, 
            { x: 60, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: image,
                    start: 'top 80%',
                    toggleActions: 'play reverse restart reverse',
                }
            }
        );
    });
    
    gsap.to('.scroll-indicator.gsap-fade-up', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1,
        ease: 'power3.out'
    });
    
    // Section title animations - fade in from bottom
    gsap.utils.toArray('.section-title.gsap-fade-up').forEach(title => {
        gsap.fromTo(title, 
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play reverse restart reverse',
                }
            }
        );
    });
    
    // Subtitle animations
    gsap.utils.toArray('.subtitle.gsap-fade-up').forEach(element => {
        gsap.fromTo(element, 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play reverse restart reverse',
                }
            }
        );
    });
    
    // Batch animations for better performance
    const cards = gsap.utils.toArray('.card');
    const serviceItems = gsap.utils.toArray('.service-item');
    const timelineItems = gsap.utils.toArray('.timeline-item');
    const partnerCards = gsap.utils.toArray('.partner-card');
    
    // Card animations - batch for better performance
    ScrollTrigger.batch(cards, {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeaveBack: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: 60,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        onEnterBack: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeave: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: -60,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        start: 'top 85%',
        end: 'bottom 15%'
    });
    
    // Service item animations - batch for better performance
    ScrollTrigger.batch(serviceItems, {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeaveBack: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: 60,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        onEnterBack: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeave: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: -60,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        start: 'top 85%',
        end: 'bottom 15%'
    });
    
    // Timeline item animations
    ScrollTrigger.batch(timelineItems, {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => {
            gsap.to(batch, {
                opacity: 1,
                x: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeaveBack: batch => {
            gsap.to(batch, {
                opacity: 0, 
                x: (i, target) => {
                    // Get the index from the original array
                    const index = timelineItems.indexOf(target);
                    return index % 2 === 0 ? -40 : 40;
                },
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        onEnterBack: batch => {
            gsap.to(batch, {
                opacity: 1,
                x: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeave: batch => {
            gsap.to(batch, {
                opacity: 0,
                x: (i, target) => {
                    // Get the index from the original array
                    const index = timelineItems.indexOf(target);
                    return index % 2 === 0 ? -40 : 40;
                },
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        start: 'top 85%',
        end: 'bottom 15%'
    });
    
    // Partner card animations
    ScrollTrigger.batch(partnerCards, {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeaveBack: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: 40,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        onEnterBack: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        onLeave: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: -40,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.in'
            });
        },
        start: 'top 85%',
        end: 'bottom 15%'
    });
    
    // Simplified parallax effects with better performance
    gsap.utils.toArray('.section').forEach((section, i) => {
        // Skip the first (hero) section for this effect
        if (i === 0) return;
        
        // Lighter parallax effect for better performance - REDUCED MOVEMENT
        if (section.querySelector('.container')) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: self => {
                    // Reduce the parallax movement to eliminate blurry effect
                    const progress = self.progress;
                    gsap.set(section.querySelector('.container'), {
                        y: -15 * progress, // Reduced from -30 to -15
                        force3D: true // Hardware acceleration
                    });
                },
                invalidateOnRefresh: true
            });
        }
    });
    
    // Optimize section transitions - KEEP SECTIONS FULLY VISIBLE
    gsap.utils.toArray('.section').forEach((section, i) => {
        if (i === 0) return; // Skip hero
        
        const container = section.querySelector('.container');
        if (!container) return;
        
        // Set initial opacity - full opacity from the start
        gsap.set(container, { 
            opacity: 1, // Changed from 0 to 1
            y: 0 // Changed from 20 to 0
        });
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top 85%', // Increased from 70%
            end: 'bottom 15%', // Changed from 'top 20%'
            onEnter: () => {
                gsap.to(container, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            },
            onLeaveBack: () => {
                // Keep content visible when scrolling back
                gsap.to(container, {
                    opacity: 1, // Changed from 0 to 1
                    y: 0, // Changed from 20 to 0
                    duration: 0.5,
                    ease: 'power2.in',
                    overwrite: 'auto'
                });
            },
            onEnterBack: () => {
                gsap.to(container, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            },
            onLeave: () => {
                // Keep content visible when scrolling away
                gsap.to(container, {
                    opacity: 1, // Changed from 0.8 to 1
                    y: 0, // Changed from -20 to 0
                    duration: 0.5,
                    ease: 'power2.in',
                    overwrite: 'auto'
                });
            }
        });
    });
    
    // Force hardware acceleration
    gsap.set('.section, .container', {force3D: true});
}

// Smooth Scrolling for anchor links with GSAP
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use native smooth scrolling for better performance
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Cursor effects on hoverable elements
        const hoverableElements = document.querySelectorAll('a, button, .card, .service-item, .partner-card, .timeline-content, .btn');
        
        hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
            });
        });
    }
}

// Form Validation for Contact Form
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    // Check URL parameters voor statusberichten
    window.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const message = urlParams.get('message');
        const statusElement = document.getElementById('form-status-message');
        
        if (status === 'success') {
            statusElement.textContent = 'Your message has been sent successfully. We will contact you as soon as possible.';
            statusElement.style.display = 'block';
            statusElement.style.backgroundColor = '#dff0d8';
            statusElement.style.color = '#3c763d';
            statusElement.style.borderLeft = '4px solid #3c763d';
            
            // Scroll naar contactformulier als er een statusbericht is
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Verberg het bericht na 5 seconden
            setTimeout(() => {
                statusElement.style.display = 'none';
                // Verwijder status parameters uit URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 5000);
        } else if (status === 'error') {
            // Toon verschillende foutmeldingen op basis van het message parameter
            let errorMsg = 'There was an error sending your message. Please try again later.';
            
            switch(message) {
                case 'validation':
                    errorMsg = 'Please complete all required fields correctly.';
                    break;
                case 'configuration':
                    errorMsg = 'The contact form is not properly configured. Please contact the site administrator.';
                    break;
                case 'phpmailer':
                    errorMsg = 'Mail system component is missing. Please contact the site administrator.';
                    break;
                case 'sending':
                    errorMsg = 'There was an error sending your message. Please try again later.';
                    break;
            }
            
            statusElement.textContent = errorMsg;
            statusElement.style.display = 'block';
            statusElement.style.backgroundColor = '#f2dede';
            statusElement.style.color = '#a94442';
            statusElement.style.borderLeft = '4px solid #a94442';
            
            // Scroll naar contactformulier als er een statusbericht is
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Verberg het bericht na 5 seconden
            setTimeout(() => {
                statusElement.style.display = 'none';
                // Verwijder status parameters uit URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 5000);
        }
    });

    contactForm.addEventListener('submit', function(e) {
        // Controleer eerst client-side validatie
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Simple validation
        let isValid = true;
        
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        if (subjectInput.value.trim() === '') {
            showError(subjectInput, 'Please enter a subject');
            isValid = false;
        } else {
            clearError(subjectInput);
        }
        
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        
        if (!isValid) {
            e.preventDefault(); // Voorkom verzenden als formulier niet geldig is
        } else {
            // Formulier is geldig, toon verzendstatus
            const submitButton = document.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Laat form submission doorgaan naar mail-handler.php
            return true;
        }
    });
}

// Show error message under input
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorMessage);
    }
    
    formGroup.classList.add('error');
    input.classList.add('error');
}

// Clear error message
function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    formGroup.classList.remove('error');
    input.classList.remove('error');
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add preloader to the page
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="loader"></div>';
        document.body.prepend(preloader);
    }
});

// Logo hover effect
document.addEventListener('DOMContentLoaded', () => {
    const headerLogo = document.getElementById('nuclic-logo');
    
    if (headerLogo) {
        headerLogo.addEventListener('mouseenter', () => {
            headerLogo.style.transform = 'scale(1.1)';
        });
        
        headerLogo.addEventListener('mouseleave', () => {
            headerLogo.style.transform = 'scale(1)';
        });
    }
});

// Sparkles effect implementation
document.addEventListener("DOMContentLoaded", async function() {
    // Check if tsParticles is loaded
    if (typeof tsParticles !== 'undefined') {
        // Initialize hero sparkles
        await tsParticles.load("sparkles-demo-container", {
            fullScreen: {
                enable: false
            },
            background: {
                color: {
                    value: "transparent"
                }
            },
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: {
                        min: 0.1,
                        max: 0.5
                    },
                    animation: {
                        enable: true,
                        speed: 1,
                        sync: false,
                        startValue: "random"
                    }
                },
                size: {
                    value: {
                        min: 0.3,
                        max: 2
                    }
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas",
                events: {
                    onHover: {
                        enable: false
                    },
                    onClick: {
                        enable: false
                    }
                }
            },
            detectRetina: true
        });
    } else {
        console.error("tsParticles library not loaded");
    }
});

// Animate hero section text rotation
function initAnimatedHeroText() {
    const animatedTextWrapper = document.querySelector('.animated-text-wrapper');
    if (!animatedTextWrapper) return;

    const animatedTexts = document.querySelectorAll('.animated-text');
    if (animatedTexts.length === 0) return;

    let currentIndex = 0;
    
    // Initialize by showing the first text
    animatedTexts[0].classList.add('active');
    
    // On mobile devices, adjust the container height if needed
    function adjustTextHeight() {
        if (window.innerWidth <= 768) {
            // Get the height of the current active text
            const activeText = document.querySelector('.animated-text.active');
            if (activeText) {
                // Add a bit of extra space
                const textHeight = activeText.offsetHeight;
                const container = document.querySelector('.animated-text-container');
                if (container) {
                    container.style.minHeight = (textHeight + 10) + 'px';
                }
            }
        }
    }
    
    // Adjust height initially and when text changes
    adjustTextHeight();
    
    // Set up the animation cycle
    setInterval(() => {
        // Hide current text
        animatedTexts[currentIndex].classList.remove('active');
        
        // Update index
        currentIndex = (currentIndex + 1) % animatedTexts.length;
        
        // Show new text
        animatedTexts[currentIndex].classList.add('active');
        
        // Adjust height for new text
        setTimeout(adjustTextHeight, 100);
    }, 4000); // Change text every 4 seconds
    
    // Also adjust on resize
    window.addEventListener('resize', adjustTextHeight);
}

// Initialize the infinite slider functionality
function initInfiniteSlider() {
    const sliderContent = document.querySelector('.infinite-slider-content');
    
    if (!sliderContent) return;
    
    // Clone all items to create the infinite effect
    const items = sliderContent.querySelectorAll('.partner-logo-item');
    
    // Create a duplicate set of items
    items.forEach(item => {
        const clone = item.cloneNode(true);
        sliderContent.appendChild(clone);
    });
    
    // Pause animation on hover
    const slider = document.querySelector('.infinite-slider');
    
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            sliderContent.style.animationPlayState = 'paused';
        });
        
        slider.addEventListener('mouseleave', () => {
            sliderContent.style.animationPlayState = 'running';
        });
    }
    
    // Handle resize for responsive behavior
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset animation to avoid jumps after resize
            sliderContent.style.animation = 'none';
            
            // Force a reflow
            void sliderContent.offsetWidth;
            
            // Restart animation
            sliderContent.style.animation = '';
        }, 250);
    });
    
    // Additional option: touch functionality for mobile devices
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchEndX = 0;
        let currentTranslate = 0;
        let isDragging = false;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            sliderContent.style.animationPlayState = 'paused';
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            touchEndX = e.touches[0].clientX;
            const diff = touchEndX - touchStartX;
            sliderContent.style.transform = `translateX(${currentTranslate + diff}px)`;
        });
        
        slider.addEventListener('touchend', () => {
            isDragging = false;
            currentTranslate += (touchEndX - touchStartX);
            sliderContent.style.animationPlayState = 'running';
            sliderContent.style.transform = '';
        });
    }
}

// Partners Slider Implementation
function initPartnersSlider() {
    const sliderContent = document.querySelector('.infinite-slider-content');
    
    if (!sliderContent) return; // Exit if container doesn't exist
    
    // Get all partner logo items
    const partnerItems = document.querySelectorAll('.partner-logo-item');
    
    if (partnerItems.length > 0) {
        // Clone items for infinite effect
        partnerItems.forEach(item => {
            const clone = item.cloneNode(true);
            sliderContent.appendChild(clone);
        });
        
        // Start the animation
        startPartnersAnimation();
    }
}

function startPartnersAnimation() {
    const sliderContent = document.querySelector('.infinite-slider-content');
    
    if (!sliderContent) return;
    
    // Create GSAP animation for infinite scroll
    gsap.to(sliderContent, {
        x: "-50%",
        duration: 20,
        ease: "linear",
        repeat: -1
    });
    
    // Pause animation on hover
    const slider = document.querySelector('.infinite-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            gsap.to(sliderContent, { timeScale: 0.1 });
        });
        
        slider.addEventListener('mouseleave', () => {
            gsap.to(sliderContent, { timeScale: 1 });
        });
    }
}
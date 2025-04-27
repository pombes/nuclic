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
    initTestimonialsSlider();
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
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Add offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
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
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        if (isValid) {
            // Simulate form submission
            const submitButton = document.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully. We will contact you as soon as possible.';
                
                contactForm.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
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
    const animatedTexts = document.querySelectorAll('.animated-text');
    const animatedContainer = document.querySelector('.animated-text-container');
    let currentTextIndex = 0;
    const isMobile = window.innerWidth <= 768;
    
    if (animatedTexts.length > 0) {
        // Ensure container is visible
        if (animatedContainer) {
            animatedContainer.style.opacity = '1';
            
            // Set appropriate container height based on device
            if (isMobile) {
                animatedContainer.style.height = '5.5rem';
            }
        }
        
        // Set the first text as active initially
        setTimeout(() => {
            animatedTexts[0].classList.add('active');
        }, 500); // Small delay for initial animation
        
        // Change text every 5 seconds
        setInterval(() => {
            // Remove active class from current text
            animatedTexts[currentTextIndex].classList.remove('active');
            
            // Update index to next text
            currentTextIndex = (currentTextIndex + 1) % animatedTexts.length;
            
            // Add active class to new text
            animatedTexts[currentTextIndex].classList.add('active');
        }, 5000);
    }
    
    // Adjust container height on window resize
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        
        if (animatedContainer) {
            if (newIsMobile) {
                animatedContainer.style.height = '5.5rem';
            } else {
                animatedContainer.style.height = '3.2rem';
            }
        }
    });
}

// Initialize testimonials slider
initTestimonialsSlider();

// Initialize partners slider
initPartnersSlider();

// Testimonials slider implementation
function initTestimonialsSlider() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    
    if (!testimonialsContainer) return;
    
    const testimonialsImagesContainer = document.querySelector('.testimonials-images');
    const testimonialTextContainer = document.querySelector('.testimonial-text');
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    
    // Define testimonials data
    const testimonials = [
        {
            quote: "Luc Van Den Durpel is a civil and nuclear engineer with a PhD in nuclear energy systems from the University of Ghent. He has held research and strategic roles at the Belgian Nuclear Research Center, the OECD Nuclear Energy Agency in Paris, and Argonne National Laboratory in the U.S., focusing on advanced nuclear systems and Generation IV. He later served as Scientific Director and VP of Strategic Analysis at AREVA. Since 2015, he has led Nuclear-21, an international consultancy supporting decision-making in nuclear technology and policy.",
            name: "Dr. Luc Van Den Durpel",
            designation: "Nuclear-21",
            src: "image/Luc Van Den Durpel.PNG"
        },
        {
            quote: "Karel Bueno de Mesquita is a radiochemist with a PhD in nuclear physics. As safety and licensing manager at Nucon Engineering, he contributed to major nuclear projects, including the Leibstadt plant in Switzerland and the development of a compact boiling water reactor with General Electric. He played a key role in assessing the feasibility of nuclear energy in the Netherlands, helped pioneer Environmental Impact Assessments, and supported the implementation of the Seveso Directive. As a consultant, he has provided strategic and organizational advice across various sectors.",
            name: "Dr. Karel Bueno de Mesquita",
            designation: "Nuclear-21",
            src: "image/Karel Bueno de Mesquita.PNG"
        },
        {
            quote: "Frédérique Damerval is a renowned expert in nuclear decontamination, with over 22 years at AREVA's Decommissioning and Dismantling Business Unit. Her experience spans R&D, industrialisation, and innovation in effluent and waste treatment. Since 2016, she has supported nuclear education at École des Ponts ParisTech. In 2022, she founded Tech Y Tech to help innovative SMEs develop technologies for the nuclear maintenance and decommissioning sector.",
            name: "Frédérique Damerval",
            designation: "Nuclear-21",
            src: "image/Frédérique Damerval.PNG"
        },
        {
            quote: "Serge Runge holds a Ph.D. in Atomic Physics and an engineering degree from École Centrale de Paris. His career spans strategic and leadership roles in the French Atomic Energy Commission, COGEMA, and AREVA, focusing on international nuclear projects including MOX fuel initiatives in the U.S. and Russia. He later led AREVA's training programs and managed relations with Eastern Europe and ROSATOM. He is a board member of SFANS and fluent in French, Russian, and English.",
            name: "Dr. Serge Runge",
            designation: "Nuclear-21",
            src: "image/Serge Runge.PNG"
        },
        {
            quote: "Jan is the Strategic Advisor and Partner at Nuclear-21 NL BV, widely recognized as a trusted advisor to Executive and Supervisory Boards across various industries for over 35 years. With deep expertise in international business complexity and corporate finance, he has guided companies through strategic transformations, restructuring, and major transactions. Jan brings a strong understanding of both Dutch and international corporate governance, with a stakeholder-focused approach grounded in integrity, respect, and community development.",
            name: "Jan J. Stuyt",
            designation: "Nuclear-21",
            src: "image/Jan J. Stuyt.PNG"
        },
        {
            quote: "Aliki joined Nuclear-21 in May 2023, bringing over two decades of experience in nuclear energy systems and sustainability. Prior to this, she led the 3E Analysis Unit (Energy, Economics, Environment) at the IAEA, where she focused on aligning nuclear energy with sustainable development and climate goals. She previously worked at NRG on decommissioning and waste management projects and began her career in advanced reactor research, initiating the Dutch program on Generation IV systems. At Nuclear-21, she oversees international activities on nuclear energy's role in sustainable energy systems and newcomer country strategies.",
            name: "Aliki van Heek",
            designation: "Nuclear-21",
            src: "image/Aliki van Heek.PNG"
        },
        {
            quote: "Caroline Jorant is an international energy consultant specializing in nuclear energy and security. She previously served as Director for Non-proliferation and International Institutions at AREVA and spent over a decade managing international relations in the French nuclear industry. She represented France in the EU's Atomic Questions Group and held roles at the French Permanent Representation to the EU and the CEA. She holds a Master's in International Relations from Johns Hopkins University (SAIS).",
            name: "Caroline Jorant",
            designation: "Nuclear-21",
            src: "image/Caroline Jorant.PNG"
        },
        {
            quote: "Gian Luigi Fiorini is a nuclear engineer with over 40 years of experience at the French Atomic Energy Commission (CEA). He has worked extensively on the design, operation, and safety assessment of nuclear reactors, including naval and fusion systems like ITER. He contributed to nuclear licensing efforts under French regulation and played a key role in Gen-IV reactor collaborations. With broad international experience coordinating bilateral and multilateral programs, he now serves as \"Chargé de Mission\" in the office of the French High Commissioner for Atomic Energy, focusing on nuclear safety.",
            name: "Gian Luigi Fiorini",
            designation: "Nuclear-21",
            src: "image/Gian-Luigi Fiorini.PNG"
        }
    ];
    
    let activeIndex = 0;
    
    // Initialize the slider
    function initSlider() {
        // Create image elements
        testimonials.forEach((testimonial, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = testimonial.src;
            imgElement.alt = testimonial.name;
            imgElement.classList.add('testimonial-image');
            if (index === activeIndex) {
                imgElement.classList.add('active');
            } else if (index === (activeIndex + 1) % testimonials.length) {
                imgElement.classList.add('next');
            } else if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) {
                imgElement.classList.add('prev');
            }
            testimonialsImagesContainer.appendChild(imgElement);
        });
        
        // Create content elements
        updateContent();
        
        // Add event listeners
        prevButton.addEventListener('click', handlePrev);
        nextButton.addEventListener('click', handleNext);
        
        // Autoplay
        startAutoplay();
    }
    
    // Update content based on active index
    function updateContent() {
        // Clear existing content
        testimonialTextContainer.innerHTML = '';
        
        // Create new content
        const activeTestimonial = testimonials[activeIndex];
        
        const nameElement = document.createElement('h3');
        nameElement.classList.add('testimonial-name');
        nameElement.textContent = activeTestimonial.name;
        
        const designationElement = document.createElement('p');
        designationElement.classList.add('testimonial-designation');
        designationElement.textContent = activeTestimonial.designation;
        
        const quoteElement = document.createElement('p');
        quoteElement.classList.add('testimonial-quote');
        quoteElement.textContent = activeTestimonial.quote;
        
        testimonialTextContainer.appendChild(nameElement);
        testimonialTextContainer.appendChild(designationElement);
        testimonialTextContainer.appendChild(quoteElement);
        
        // Trigger animations
        setTimeout(() => {
            nameElement.classList.add('active');
            setTimeout(() => {
                designationElement.classList.add('active');
                setTimeout(() => {
                    quoteElement.classList.add('active');
                }, 100);
            }, 100);
        }, 50);
    }
    
    // Update images based on active index
    function updateImages() {
        const images = testimonialsImagesContainer.querySelectorAll('.testimonial-image');
        
        images.forEach((image, index) => {
            // Remove all classes
            image.classList.remove('active', 'prev', 'next');
            
            // Add appropriate class
            if (index === activeIndex) {
                image.classList.add('active');
            } else if (index === (activeIndex + 1) % testimonials.length) {
                image.classList.add('next');
            } else if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) {
                image.classList.add('prev');
            }
        });
    }
    
    // Handle next slide
    function handleNext() {
        activeIndex = (activeIndex + 1) % testimonials.length;
        updateImages();
        updateContent();
        restartAutoplay();
    }
    
    // Handle previous slide
    function handlePrev() {
        activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
        updateImages();
        updateContent();
        restartAutoplay();
    }
    
    // Autoplay functionality
    let autoplayTimer;
    
    function startAutoplay() {
        autoplayTimer = setInterval(handleNext, 12000);
    }
    
    function restartAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }
    
    // Initialize the slider
    initSlider();
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
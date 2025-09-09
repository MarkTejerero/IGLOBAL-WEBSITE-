// Disable scrolling completely on home page
document.body.style.overflow = 'hidden';

// Keep scrolling disabled on home page, enable on other pages
window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.classList.add('loaded');
        // Check if we're on the main home page only
        const currentPath = window.location.pathname;
        const isMainHomePage = currentPath === '/' || 
                              currentPath === '' || 
                              currentPath.endsWith('/index.html') && !currentPath.includes('/about/') && !currentPath.includes('/services/') && !currentPath.includes('/countries/');
        
        // Enable scrolling on all pages except the main home page
        if (!isMainHomePage) {
            document.body.style.overflow = 'auto';
        }
    }, 1000);
});

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
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Glass card hover effects
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate stats numbers on scroll
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        if (!stat.dataset.animated) {
            const text = stat.textContent;
            const isPercentage = text.includes('%');
            const isK = text.includes('K');
            const isM = text.includes('M');
            
            let targetNum = parseInt(text);
            if (isK) targetNum *= 1000;
            if (isM) targetNum *= 1000000;
            
            let currentNum = 0;
            const increment = targetNum / 100;
            
            const updateNumber = () => {
                if (currentNum < targetNum) {
                    currentNum += increment;
                    let displayNum = Math.floor(currentNum);
                    
                    if (isK && displayNum >= 1000) {
                        displayNum = Math.floor(displayNum / 1000);
                        stat.textContent = displayNum + 'K+';
                    } else if (isM && displayNum >= 1000000) {
                        displayNum = Math.floor(displayNum / 1000000);
                        stat.textContent = displayNum + 'M+';
                    } else if (isPercentage) {
                        stat.textContent = displayNum + '%';
                    } else {
                        stat.textContent = displayNum;
                    }
                    
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = text;
                }
            };
            
            stat.dataset.animated = 'true';
            updateNumber();
        }
    });
};

// Trigger stats animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Hero Slider Class
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.progressBar = document.querySelector('.progress-bar');
        
        this.currentSlide = 0;
        this.slideInterval = null;
        this.progressInterval = null;
        this.slideDuration = 6000; // 6 seconds per slide
        this.progressStep = 100 / (this.slideDuration / 50); // Update every 50ms
        this.currentProgress = 0;
        
        this.init();
    }
    
    init() {
        // Add event listeners to indicators only
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index, true));
        });
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        const slider = document.querySelector('.hero-slider');
        
        slider?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slider?.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide(true);
                } else {
                    this.prevSlide(true);
                }
            }
        });
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause on hover
        slider?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        slider?.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Initialize first slide
        this.goToSlide(0);
        
        // Add click functionality to CTA buttons
        this.initButtonFunctionality();
    }
    
    initButtonFunctionality() {
        const ctaButtons = document.querySelectorAll('.slide-cta');
        console.log('Re-enabled CTA buttons with hover effects:', ctaButtons.length);
        
        ctaButtons.forEach((button, index) => {
            const href = button.getAttribute('href');
            const text = button.textContent.trim();
            console.log(`Button ${index + 1}: "${text}" -> "${href}"`);
            
            // Add click animation without preventing navigation
            button.addEventListener('mousedown', (e) => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', (e) => {
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            });
            
            // Add hover effects
            button.addEventListener('mouseenter', (e) => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
                button.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.3)';
            });
            
            button.addEventListener('mouseleave', (e) => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
            
            // Log clicks without interfering
            button.addEventListener('click', (e) => {
                console.log(`Navigating to: ${href}`);
                // Let natural navigation happen
            });
        });
        
        // Add functionality to mobile menu button
        this.initMobileMenuFunctionality();
        
        // Add functionality to slide indicators
        this.enhanceIndicatorFunctionality();
    }
    
    initMobileMenuFunctionality() {
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Toggle mobile menu
                navLinks.classList.toggle('mobile-active');
                mobileMenuBtn.classList.toggle('active');
                
                // Animate the hamburger icon
                const icon = mobileMenuBtn.querySelector('i');
                if (navLinks.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                    mobileMenuBtn.style.transform = 'rotate(90deg)';
                } else {
                    icon.className = 'fas fa-bars';
                    mobileMenuBtn.style.transform = 'rotate(0deg)';
                }
            });
            
            // Close mobile menu when clicking on nav links
            const navLinkItems = document.querySelectorAll('.nav-links a');
            navLinkItems.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-active');
                    mobileMenuBtn.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.className = 'fas fa-bars';
                    mobileMenuBtn.style.transform = 'rotate(0deg)';
                });
            });
        }
    }
    
    enhanceIndicatorFunctionality() {
        this.indicators.forEach((indicator, index) => {
            // Add hover effects to indicators
            indicator.addEventListener('mouseenter', (e) => {
                if (!indicator.classList.contains('active')) {
                    indicator.style.transform = 'scale(1.2)';
                    indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                }
            });
            
            indicator.addEventListener('mouseleave', (e) => {
                if (!indicator.classList.contains('active')) {
                    indicator.style.transform = 'scale(1)';
                    indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
            
            // Add click animation (this doesn't interfere with the main click handler)
            indicator.addEventListener('mousedown', (e) => {
                indicator.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    indicator.style.transform = indicator.classList.contains('active') ? 'scale(1.1)' : 'scale(1)';
                }, 100);
            });
        });
    }
    
    goToSlide(slideIndex, isManualClick = false) {
        // Don't transition to the same slide
        if (this.currentSlide === slideIndex) return;
        
        // Add zoom-out transition to current slide first
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('zoom-out');
        }
        
        // Remove active class from current indicator
        this.indicators[this.currentSlide]?.classList.remove('active');
        
        // Immediately prepare the new slide (it starts scaled up and invisible)
        const newSlide = this.slides[slideIndex];
        if (newSlide) {
            newSlide.classList.remove('zoom-out');
            newSlide.style.opacity = '0';
            newSlide.style.transform = 'scale(1.8)';
        }
        
        // After a short delay, fade in the new slide
        setTimeout(() => {
            // Clean up old slide
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'zoom-out');
            });
            
            // Update current slide
            this.currentSlide = slideIndex;
            
            // Add active class to new slide and indicator
            if (newSlide) {
                newSlide.classList.add('active');
                // Remove inline styles to let CSS take over
                newSlide.style.opacity = '';
                newSlide.style.transform = '';
            }
            this.indicators[this.currentSlide]?.classList.add('active');
        }, 600); // Delay for smooth zoom transition
        
        // Only reset auto-play if this was an automatic transition, not manual click
        if (!isManualClick) {
            this.resetProgress();
            this.startAutoPlay();
        }
    }
    
    nextSlide(isManualClick = false) {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex, isManualClick);
    }
    
    prevSlide(isManualClick = false) {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex, isManualClick);
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing intervals
        
        // Start slide interval
        this.slideInterval = setTimeout(() => {
            this.nextSlide();
        }, this.slideDuration);
        
        // Start progress bar animation
        this.startProgressBar();
    }
    
    stopAutoPlay() {
        if (this.slideInterval) {
            clearTimeout(this.slideInterval);
            this.slideInterval = null;
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    pauseAutoPlay() {
        this.stopAutoPlay();
        // Keep progress bar at current position
    }
    
    resumeAutoPlay() {
        const remainingTime = this.slideDuration * (1 - this.currentProgress / 100);
        
        this.slideInterval = setTimeout(() => {
            this.nextSlide();
        }, remainingTime);
        
        this.startProgressBar();
    }
    
    startProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            this.currentProgress += this.progressStep;
            
            if (this.progressBar) {
                this.progressBar.style.width = `${this.currentProgress}%`;
            }
            
            if (this.currentProgress >= 100) {
                this.currentProgress = 100;
                clearInterval(this.progressInterval);
            }
        }, 50);
    }
    
    resetProgress() {
        this.currentProgress = 0;
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
}

// Dropdown functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    initDropdownFunctionality();
    
    if (document.querySelector('.hero-slider')) {
        new HeroSlider();
    }
    
    // Initialize Australia Image Slider
    if (document.querySelector('.image-slider')) {
        new AustraliaImageSlider();
    }
});

// Global dropdown functionality for all pages
function initDropdownFunctionality() {
    console.log('Initializing dropdown functionality...');
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log('Found dropdowns:', dropdowns.length);
    
    dropdowns.forEach((dropdown, index) => {
        const dropdownBtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        if (dropdownBtn && dropdownContent) {
            // Desktop behavior - hover only
            if (window.innerWidth > 768) {
                dropdown.addEventListener('mouseenter', function() {
                    dropdownContent.style.display = 'block';
                    dropdown.classList.add('dropdown-open');
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    setTimeout(() => {
                        dropdownContent.style.display = 'none';
                        dropdown.classList.remove('dropdown-open');
                    }, 200);
                });
            }
            // Mobile behavior is handled by CSS and mobile menu functionality in the existing code
        }
    });
}

// Australia Image Slider Class
class AustraliaImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.slideDuration = 4000; // 4 seconds per slide
        
        this.init();
    }
    
    init() {
        // Start auto-play immediately
        this.startAutoPlay();
        
        // Initialize first slide
        this.goToSlide(0);
    }
    
    goToSlide(slideIndex) {
        // Remove active class from current slide
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Add prev class to current slide before changing
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('prev');
        }
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Add active class to new slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
    
    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}
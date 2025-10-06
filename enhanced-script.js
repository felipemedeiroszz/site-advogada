// ===== ADVANCED ANIMATIONS & INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Ensure any previous custom cursor elements are removed
    document.querySelectorAll('.custom-cursor, .cursor-dot').forEach(el => el.remove());
    
    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const steps = Math.max(1, Math.floor(duration / 16));
            const increment = target / steps;
            let current = 0;

            const formatter = new Intl.NumberFormat('pt-BR');

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = formatter.format(target) + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = formatter.format(Math.floor(current)) + suffix;
                }
            }, 16);
        });
    }
    
    // ===== ADVANCED SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('hero-stats')) {
                    setTimeout(animateCounters, 500);
                }
                
                // Stagger animation for service features
                if (entry.target.classList.contains('service-features')) {
                    const features = entry.target.querySelectorAll('.feature-item');
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateX(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.hero-stats, .service-card, .article-card, .about-content, .service-features').forEach(el => {
        animationObserver.observe(el);
    });
    
    // ===== PARALLAX SCROLLING =====
    let ticking = false;
    
    function updateParallax() {
        // Drawings removed; keep function lightweight and no-op to avoid layout thrashing.
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // ===== 3D TILT EFFECT =====
    function initTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
    
    // ===== MAGNETIC BUTTON EFFECT =====
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // ===== SMOOTH REVEAL ANIMATIONS =====
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about-intro');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            revealObserver.observe(el);
        });
    }
    
    // ===== CUSTOM CURSOR =====
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            });
        });
    }
    
    // ===== TYPING ANIMATION =====
    function initTypingAnimation() {
        const el = document.querySelector('.hero-subtitle');
        if (!el) return;

        const text = el.getAttribute('data-typing') || '';
        el.textContent = '';
        el.style.opacity = '1';

        let i = 0;
        const speed = 35; // typing speed in ms
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Finished typing: keep final text fixed
                el.textContent = text;
            }
        }
        // Short initial delay for staggered entrance
        setTimeout(type, 800);
    }
    
    // ===== PARTICLE SYSTEM =====
    // Particle effects removed per request.
    
    // ===== SCROLL PROGRESS INDICATOR =====
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
    
    // ===== ENHANCED FORM INTERACTIONS =====
    function initEnhancedForm() {
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
        
        formInputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            const ripple = document.createElement('div');
            ripple.className = 'input-ripple';
            wrapper.appendChild(ripple);
            
            input.addEventListener('focus', () => {
                wrapper.classList.add('focused');
                ripple.style.animation = 'ripple 0.6s ease-out';
            });
            
            input.addEventListener('blur', () => {
                wrapper.classList.remove('focused');
                ripple.style.animation = '';
            });
        });
    }
    
    // ===== PAGE TRANSITION EFFECTS =====
    function initPageTransitions() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    // Add transition overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'page-transition';
                    document.body.appendChild(overlay);
                    
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        setTimeout(() => {
                            overlay.remove();
                        }, 500);
                    }, 300);
                }
            });
        });
    }
    
    // ===== INITIALIZE ALL EFFECTS =====
    setTimeout(() => {
        initTiltEffect();
        initMagneticButtons();
        initRevealAnimations();
        initScrollProgress();
        initEnhancedForm();
        initPageTransitions();
    }, 1000);
    
    // Initialize typing animation after other animations
    setTimeout(initTypingAnimation, 3000);
    
    // ===== FLOATING WHATSAPP MESSAGES ROTATION =====
    // Rotate 12 total messages across 4 floating bubbles (3 each), switching on every animationiteration (blink).
    (function initFloatingMessagesRotation() {
        const cellImage = document.querySelector('.cell-image');

        function buzzPhone() {
            if (!cellImage) return;
            // Restart animation by toggling the class
            cellImage.classList.remove('buzz');
            // Force reflow to allow re-adding the class
            void cellImage.offsetWidth;
            cellImage.classList.add('buzz');
            const onEnd = () => {
                cellImage.classList.remove('buzz');
                cellImage.removeEventListener('animationend', onEnd);
            };
            cellImage.addEventListener('animationend', onEnd);
        }

        const bubbles = [
            document.querySelector('.floating-message-1'),
            document.querySelector('.floating-message-2'),
            document.querySelector('.floating-message-3'),
            document.querySelector('.floating-message-4')
        ].filter(Boolean);

        if (!bubbles.length) return;

        // Define 12 messages (Portuguese examples; adjust as needed)
        const messages = [
            'Olá! Preciso de ajuda com aposentadoria',
            'Tenho dúvidas sobre meus direitos previdenciários',
            'Como funciona a revisão de benefícios?',
            'Fui autuado pela Receita Federal',
            'É possível recuperar créditos tributários?',
            'Preciso de orientação trabalhista',
            'Muito obrigada pelo excelente atendimento!',
            'Dra. Thatiane é uma advogada excepcional!',
            'Resolveu meu caso em tempo recorde',
            'Atendimento humanizado e profissional',
            'Recomendo de olhos fechados!',
            'Consegui minha aposentadoria! Obrigada!'
        ];

        // Split into 4 groups of 3
        const groups = [
            messages.slice(0, 3),
            messages.slice(3, 6),
            messages.slice(6, 9),
            messages.slice(9, 12)
        ];

        bubbles.forEach((bubble, idx) => {
            const contentEl = bubble.querySelector('.message-content');
            const timeEl = bubble.querySelector('.message-time');
            const group = groups[idx] || [];
            if (!contentEl || group.length === 0) return;

            // Set initial message to first of the group
            let shown = 1;
            contentEl.textContent = group[0];

            // Helper to generate a subtle time string (HH:MM)
            function formatTime(d) {
                const h = String(d.getHours()).padStart(2, '0');
                const m = String(d.getMinutes()).padStart(2, '0');
                return `${h}:${m}`;
            }

            if (timeEl) {
                timeEl.textContent = formatTime(new Date());
            }

            // Ensure phone vibrates for the very first appearance as well
            let firstBuzzed = false;
            const onStart = () => {
                if (!firstBuzzed) {
                    buzzPhone();
                    firstBuzzed = true;
                }
            };

            // On each animation cycle, advance message within the group
            function onIter() {
                if (shown >= 3) {
                    // After 3 messages, stop changing to keep the last one
                    bubble.removeEventListener('animationiteration', onIter);
                    bubble.removeEventListener('animationstart', onStart);
                    return;
                }
                contentEl.textContent = group[shown];
                if (timeEl) timeEl.textContent = formatTime(new Date());
                shown += 1;
                // Trigger phone buzz when a new message appears
                buzzPhone();
            }

            // Listen to animation iteration from the animated element
            bubble.addEventListener('animationiteration', onIter);
            bubble.addEventListener('animationstart', onStart, { once: false });
            // Also buzz immediately upon initial setup to guarantee first message feedback
            buzzPhone();
        });
    })();

    // ===== ENHANCED ABOUT SECTION SLIDESHOW =====
    function initAboutSlideshow() {
        const slideshowImg = document.getElementById('about-slideshow-img');
        const indicatorsContainer = document.querySelector('.slideshow-indicators');
        const progressBar = document.querySelector('.progress-bar');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!slideshowImg || !indicatorsContainer || !progressBar) return;

        // Array of all images in the sobre-mim folder
        const images = [
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.24.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.25.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.26.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.27.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.28 (1).jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.28.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.29 (1).jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.29 (2).jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.29.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.30.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.20.31.jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.25.23 (1).jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.25.23 (2).jpeg',
            'sobre-mim/WhatsApp Image 2025-10-03 at 10.25.23.jpeg'
        ];

        let currentImageIndex = 0;
        let autoSlideInterval;
        let progressInterval;
        let isTransitioning = false;
        const transitionDuration = 3000; // 3 seconds per image
        const transitionTypes = ['fade', 'zoom', 'slide'];

        // Create indicators
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(dot);
            });
        }

        // Update indicators
        function updateIndicators() {
            const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentImageIndex);
            });
        }

        // Update progress bar
        function updateProgressBar() {
            let progress = 0;
            progressInterval = setInterval(() => {
                progress += 100 / (transitionDuration / 100);
                progressBar.style.width = `${Math.min(progress, 100)}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    progressBar.style.width = '0%';
                }
            }, 100);
        }

        // Apply transition effect
        function applyTransition(type) {
            slideshowImg.classList.add(`${type}-transition`);
            
            setTimeout(() => {
                slideshowImg.src = images[currentImageIndex];
                slideshowImg.alt = `Sobre Thatiane Leme - Foto ${currentImageIndex + 1}`;
                
                setTimeout(() => {
                    slideshowImg.classList.remove(`${type}-transition`);
                    isTransitioning = false;
                }, 100);
            }, 400);
        }

        // Change to specific slide
        function goToSlide(index) {
            if (isTransitioning || index === currentImageIndex) return;
            
            isTransitioning = true;
            currentImageIndex = index;
            
            // Clear intervals
            clearInterval(autoSlideInterval);
            clearInterval(progressInterval);
            progressBar.style.width = '0%';
            
            // Apply random transition
            const transitionType = transitionTypes[Math.floor(Math.random() * transitionTypes.length)];
            applyTransition(transitionType);
            
            updateIndicators();
            
            // Restart auto slide
            setTimeout(() => {
                startAutoSlide();
            }, 800);
        }

        // Go to next slide
        function nextSlide() {
            const nextIndex = (currentImageIndex + 1) % images.length;
            goToSlide(nextIndex);
        }

        // Go to previous slide
        function prevSlide() {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            goToSlide(prevIndex);
        }

        // Start auto slide
        function startAutoSlide() {
            updateProgressBar();
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, transitionDuration);
        }

        // Stop auto slide
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
            clearInterval(progressInterval);
        }

        // Event listeners
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
            });
        }

        // Pause on hover
        const slideshow = document.querySelector('.about-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', stopAutoSlide);
            slideshow.addEventListener('mouseleave', startAutoSlide);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Initialize
        createIndicators();
        startAutoSlide();

        // Add entrance animation to about section
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(aboutSection);
        }
    }

    // Initialize slideshow
    initAboutSlideshow();

    // ===== EXPANDABLE ARTICLES FUNCTIONALITY =====
    function initExpandableArticles() {
        const articleToggleButtons = document.querySelectorAll('.article-toggle');
        
        articleToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const articleCard = this.closest('.article-card');
                const fullContent = articleCard.querySelector('.article-full-content');
                const summary = articleCard.querySelector('.article-summary');
                
                if (fullContent.style.display === 'none' || fullContent.style.display === '') {
                    // Expand article
                    fullContent.style.display = 'block';
                    summary.style.display = 'none';
                    this.textContent = 'Ver Menos';
                    
                    // Smooth scroll to article if needed
                    articleCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                } else {
                    // Collapse article
                    fullContent.style.display = 'none';
                    summary.style.display = 'block';
                    this.textContent = 'Ver Mais';
                }
            });
        });
    }

    // Initialize expandable articles
    initExpandableArticles();

    console.log('Advanced animations and interactions loaded successfully!');
});

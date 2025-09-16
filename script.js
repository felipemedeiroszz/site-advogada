// ===== SMOOTH SCROLLING & NAVIGATION ===== 
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== SCROLL ANIMATIONS ===== 
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .article-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== NAVBAR SCROLL EFFECT ===== 
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolling
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===== FORM HANDLING ===== 
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value.trim();
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Build WhatsApp Click-to-Chat URL in requested format
                const numero = '5516991340113';
                const partes = [
                    formObject.nomecompleto || '',
                    formObject.email || '',
                    formObject.telefone || '',
                    formObject.areadeinteresse || '',
                    formObject.situacao || ''
                ].map(v => encodeURIComponent(v));
                
                // Join with plus signs between fields
                const texto = partes.join('+');
                const url = `https://wa.me/${numero}?text=${texto}`;
                
                // Open WhatsApp in a new tab/window
                window.open(url, '_blank');
            }
        });
        
        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    // ===== FORM VALIDATION ===== 
    function validateForm(data) {
        let isValid = true;
        
        // Required fields validation
        if (!data.nomecompleto || data.nomecompleto.trim().length < 2) {
            showFieldError('nomecompleto', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            showFieldError('email', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        if (!data.telefone || data.telefone.trim().length < 8) {
            showFieldError('telefone', 'Por favor, insira um telefone válido');
            isValid = false;
        }
        
        if (!data.areadeinteresse) {
            showFieldError('areadeinteresse', 'Por favor, selecione uma área de interesse');
            isValid = false;
        }
        
        if (!data.situacao || data.situacao.trim().length < 5) {
            showFieldError('situacao', 'Descreva brevemente sua situação (min. 5 caracteres)');
            isValid = false;
        }
        
        if (!isValid) {
            showMessage('Por favor, corrija os erros no formulário.', 'error');
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        switch (field.name) {
            case 'nomecompleto':
                if (!value || value.length < 2) {
                    showFieldError(field.name, 'Nome deve ter pelo menos 2 caracteres');
                    isValid = false;
                }
                break;
            case 'email':
                if (!value || !isValidEmail(value)) {
                    showFieldError(field.name, 'Por favor, insira um e-mail válido');
                    isValid = false;
                }
                break;
            case 'telefone':
                if (!value || value.length < 8) {
                    showFieldError(field.name, 'Por favor, insira um telefone válido');
                    isValid = false;
                }
                break;
            case 'areadeinteresse':
                if (!value) {
                    showFieldError(field.name, 'Por favor, selecione uma área de interesse');
                    isValid = false;
                }
                break;
            case 'situacao':
                if (!value || value.length < 5) {
                    showFieldError(field.name, 'Descreva brevemente sua situação (min. 5 caracteres)');
                    isValid = false;
                }
                break;
        }
        
        if (isValid) {
            clearFieldError(field);
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error styling
        field.style.borderColor = '#e53e3e';
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '4px';
        
        formGroup.appendChild(errorElement);
    }
    
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = '#e2e8f0';
    }
    
    // ===== MESSAGE SYSTEM ===== 
    function showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message-toast');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const message = document.createElement('div');
        message.className = `message-toast message-${type}`;
        message.textContent = text;
        
        // Styling
        Object.assign(message.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        });
        
        // Set background color based on type
        if (type === 'success') {
            message.style.background = 'linear-gradient(135deg, #38a169, #2f855a)';
        } else if (type === 'error') {
            message.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
        } else {
            message.style.background = 'linear-gradient(135deg, #3182ce, #2c5282)';
        }
        
        // Add to DOM
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    }
    
    // ===== BUTTON HOVER EFFECTS ===== 
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('btn-secondary')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // ===== CARD HOVER EFFECTS ===== 
    const cards = document.querySelectorAll('.service-card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ===== KEYBOARD NAVIGATION ===== 
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Enter key on nav toggle
        if (e.key === 'Enter' && e.target === navToggle) {
            navToggle.click();
        }
    });
    
    // ===== LOADING ANIMATION ===== 
    // Add loading states to buttons when clicked
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Enviando...';
            this.disabled = true;
            
            // Re-enable after form processing
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
    
    // ===== PERFORMANCE OPTIMIZATIONS ===== 
    // Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Scroll-based animations and effects go here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // ===== ACCESSIBILITY ENHANCEMENTS ===== 
    // Focus management for mobile menu
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            // Focus first menu item when menu opens
            const firstMenuItem = navMenu.querySelector('a');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 100);
            }
        }
    });
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', function(e) {
        if (navMenu.classList.contains('active') && e.key === 'Tab') {
            const focusableElements = navMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // ===== PRELOAD CRITICAL RESOURCES ===== 
    // Preload Google Fonts for better performance
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
    
    console.log('Website loaded successfully! All interactive features are ready.');
});

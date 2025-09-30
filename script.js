document.addEventListener('DOMContentLoaded', () => {
    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        // Asegurarse de que desaparezca completamente para no interferir
        setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
        }, 600); // Coincidir con la transición CSS
    });

    // --- AOS INITIALIZATION ---
    AOS.init({
        duration: 800,
        offset: 120,
        once: true,
        easing: 'ease-out-cubic'
    });

    // --- HEADER SCROLL EFFECT ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');

    if (menuToggle && mainNav) {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i><i class="fas fa-times" style="display:none;"></i>'; // Setup icons
        const barsIcon = menuToggle.querySelector('.fa-bars');
        const timesIcon = menuToggle.querySelector('.fa-times');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('open');
            barsIcon.style.display = menuToggle.classList.contains('open') ? 'none' : 'block';
            timesIcon.style.display = menuToggle.classList.contains('open') ? 'block' : 'none';
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('open');
                    barsIcon.style.display = 'block';
                    timesIcon.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // --- ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; // Ajuste para que se active un poco antes
            let sectionId = current.getAttribute('id');
            
            let navLink = document.querySelector('.main-nav a[href*=' + sectionId + ']');
            if (navLink) {
                 if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
         // Highlight "Inicio" if at top
        let homeLink = document.querySelector('.main-nav a[href="#inicio"]');
        if (homeLink && scrollY < sections[0].offsetTop - 150) { // sections[0] es la primera sección después del hero
             sections.forEach(sec => { // Quitar active de todos los demás
                let link = document.querySelector('.main-nav a[href*=' + sec.getAttribute('id') + ']');
                if(link) link.classList.remove('active');
            });
            homeLink.classList.add('active');
        } else if (homeLink && scrollY >= sections[0].offsetTop -150) {
             homeLink.classList.remove('active'); // Quitar active de inicio si no estamos en la parte superior
        }


    }
    window.addEventListener('scroll', navHighlighter);
    navHighlighter(); // Llama una vez al cargar para el estado inicial


    // --- BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- FORM SUBMISSION (Formspree) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = "Enviando...";
            formStatus.style.color = "var(--accent-primary)";
            const data = new FormData(contactForm);

            try {
                const response = await fetch("https://formspree.io/f/xnndykqn", { // URL DE FORMSPREE PARA TALENTUM
                    method: "POST",
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = "✅ ¡Mensaje enviado con éxito!";
                    formStatus.style.color = "var(--accent-primary)";
                    contactForm.reset();
                    // Limpiar labels flotantes
                     document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                        const label = input.nextElementSibling;
                        if (label && label.tagName === 'LABEL') {
                            label.style.top = '12px';
                            label.style.fontSize = '1rem';
                            label.style.color = 'var(--text-secondary)';
                        }
                    });
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `❌ Error: ${errorData.error || "No se pudo enviar. Intente más tarde."}`;
                    formStatus.style.color = "#ff6b6b"; // Un rojo para error
                }
            } catch (error) {
                formStatus.textContent = "❌ Error de red. Verifique su conexión.";
                formStatus.style.color = "#ff6b6b";
            }
        });
    }
    
    // --- FOOTER CURRENT YEAR ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Placeholder clear for floating labels
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        const label = input.nextElementSibling;
        input.addEventListener('focus', () => {
            if (label && label.tagName === 'LABEL') {
                label.style.top = '-10px';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--accent-primary)';
            }
        });
        input.addEventListener('blur', () => {
            if (input.value === '' && label && label.tagName === 'LABEL') {
                 label.style.top = '12px';
                 label.style.fontSize = '1rem';
                 label.style.color = 'var(--text-secondary)';
            }
        });
        // Initial check in case of autofill
        if (input.value !== '' && label && label.tagName === 'LABEL') {
            label.style.top = '-10px';
            label.style.fontSize = '0.8rem';
            label.style.color = 'var(--accent-primary)';
        }
    });

    // --- SMOOTH SCROLLING FOR ANCHOR LINKS ---
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

    // --- ADDITIONAL ANIMATIONS FOR TALENTUM ---
    // Animate service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards for additional animation
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // --- CONTACT FORM ENHANCEMENTS ---
    // Add loading state to form submission
    const submitButton = document.querySelector('.btn-submit-form');
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        
        contactForm.addEventListener('submit', () => {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Reset button after form processing
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }

    // --- PERFORMANCE OPTIMIZATION ---
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // --- ACCESSIBILITY IMPROVEMENTS ---
    // Add keyboard navigation for mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    // Add focus management for mobile menu
    if (mainNav) {
        const focusableElements = mainNav.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        mainNav.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
});

// Carrusel - resetear animaciones al cambiar de slide
document.addEventListener('DOMContentLoaded', function() {
    // Detectar Safari para aplicar correcciones específicas
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Precarga de imágenes antes de iniciar el carrusel
    preloadImages().then(() => {
        // Pequeño retraso para Safari que ayuda con la inicialización
        setTimeout(() => {
            initCarousel();
        }, isSafari ? 100 : 0);
    });

    function initCarousel() {
        // Inicializar el carrusel con opciones optimizadas
        const heroCarouselElement = document.getElementById('heroCarousel');
        if (!heroCarouselElement) return;
        
        var heroCarousel = new bootstrap.Carousel(heroCarouselElement, {
            interval: 6000,        // Tiempo entre slides reducido a 6 segundos para mejor ritmo
            pause: false,
            ride: 'carousel',
            wrap: true,
            keyboard: false
        });

        // Preparar el primer slide inmediatamente
        const firstSlide = document.querySelector('.carousel-item.active');
        if (firstSlide) {
            // Usar requestAnimationFrame para asegurar que el DOM esté listo
            requestAnimationFrame(() => {
                activateSlideAnimations(firstSlide);
            });
        }
        
        // Mejorar las transiciones entre slides
        heroCarouselElement.addEventListener('slide.bs.carousel', function(event) {
            const currentSlide = event.relatedTarget;
            prepareNextSlide(currentSlide);
            
            // Desactivar animaciones del slide actual
            const activeSlide = document.querySelector('.carousel-item.active');
            if (activeSlide) {
                deactivateSlideAnimations(activeSlide);
            }
        });
        
        heroCarouselElement.addEventListener('slid.bs.carousel', function() {
            const currentSlide = document.querySelector('.carousel-item.active');
            if (currentSlide) {
                // Usar requestAnimationFrame para asegurar mejor timing en Safari
                requestAnimationFrame(() => {
                    activateSlideAnimations(currentSlide);
                });
            }
        });
        
        // Ajustar altura y responsiveness
        adjustCarouselHeight();
        window.addEventListener('resize', debounce(adjustCarouselHeight, 150));
        
        // Fix especial para Safari en iPhone/iPad
        if (isSafari && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Safari en iOS necesita manejos especiales para height: 100vh
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            window.addEventListener('resize', () => {
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
                adjustCarouselHeight();
            });
        }
        
        // Fix para dispositivos móviles
        window.addEventListener('orientationchange', function() {
            // Safari necesita más tiempo tras cambio de orientación
            const delay = isSafari ? 500 : 200;
            setTimeout(adjustCarouselHeight, delay);
        });
        
        // Garantizar reproducción continua
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                heroCarousel.cycle();
            }
        });
    }
    
    // Activar animaciones en un slide específico
    function activateSlideAnimations(slide) {
        if (!slide) return;
        
        // Safari a veces necesita un pequeño retraso adicional
        const baseDelay = 50;
        
        // Crear una secuencia de animaciones con pequeños intervalos
        const title = slide.querySelector('.animate-title');
        const text = slide.querySelector('.animate-text');
        const buttons = slide.querySelector('.hero-buttons');
        
        if (title) {
            setTimeout(() => {
                title.classList.add('animate');
                // Hack para forzar repaint en Safari
                void title.offsetWidth;
            }, baseDelay + 100);
        }
        
        if (text) {
            setTimeout(() => {
                text.classList.add('animate');
                void text.offsetWidth;
            }, baseDelay + 300);
        }
        
        if (buttons) {
            setTimeout(() => {
                buttons.classList.add('animate');
                void buttons.offsetWidth;
                
                // Animar los botones individualmente
                const btnPrimary = buttons.querySelector('.animate-btn-1');
                const btnOutline = buttons.querySelector('.animate-btn-2');
                
                if (btnPrimary) {
                    setTimeout(() => {
                        btnPrimary.classList.add('animate');
                    }, 100);
                }
                
                if (btnOutline) {
                    setTimeout(() => {
                        btnOutline.classList.add('animate');
                    }, 200);
                }
            }, baseDelay + 500);
        }
        
        // Activar animación de imagen con retraso para Safari
        setTimeout(() => {
            slide.classList.add('animate-bg');
        }, baseDelay);
    }
    
    // Desactivar animaciones en un slide
    function deactivateSlideAnimations(slide) {
        if (!slide) return;
        
        const animatedElements = slide.querySelectorAll('.animate-title, .animate-text, .hero-buttons, .animate-btn-1, .animate-btn-2');
        animatedElements.forEach(el => {
            el.classList.remove('animate');
            // Forzar repaint
            void el.offsetWidth;
        });
        
        // Desactivar animación de imagen
        slide.classList.remove('animate-bg');
        void slide.offsetWidth; // Forzar repaint
    }
    
    // Preparar el próximo slide para transición suave
    function prepareNextSlide(slide) {
        if (!slide) return;
        
        // Posicionar elementos fuera de vista para animación
        const title = slide.querySelector('.animate-title');
        const text = slide.querySelector('.animate-text');
        const buttons = slide.querySelector('.hero-buttons');
        
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)'; // Posición inicial
        }
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px)'; // Posición inicial
        }
        if (buttons) {
            buttons.style.opacity = '0';
        }
        
        // Preparar el fondo para nueva animación
        slide.style.transform = 'scale(1)';
    }
    
    // Función para ajustar altura
    function adjustCarouselHeight() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;
        
        const viewportHeight = window.innerHeight;
        
        // Aplicar altura al carrusel y slides
        carousel.style.height = viewportHeight + 'px';
        document.querySelectorAll('.carousel-item').forEach(item => {
            item.style.height = viewportHeight + 'px';
        });
        
        // Fix específico para Safari
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            carousel.style.height = `${viewportHeight}px`;
            // Forzar redibujado
            void carousel.offsetHeight;
        }
    }
    
    // Precargar imágenes mejorado con Promises y compatibilidad Safari
    function preloadImages() {
        return new Promise((resolve) => {
            const imagePaths = [
                './assets/img/houseLux1.jpeg',
                './assets/img/houseLux2.jpeg',
                './assets/img/workRealizer2.jpg',
            ];
            
            let loadedCount = 0;
            const totalImages = imagePaths.length;
            
            // Resolver inmediatamente si no hay imágenes
            if (totalImages === 0) {
                resolve();
                return;
            }
            
            imagePaths.forEach(path => {
                const img = new Image();
                img.onload = img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                };
                img.src = path;
            });
            
            // Por si alguna imagen falla, resolver después de un tiempo
            // Safari puede necesitar más tiempo
            setTimeout(resolve, 3000);
        });
    }
    
    // Función debounce para optimizar eventos de resize
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
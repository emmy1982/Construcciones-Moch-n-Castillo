// Carrusel - resetear animaciones al cambiar de slide
document.addEventListener('DOMContentLoaded', function() {
    // Precarga de imágenes antes de iniciar el carrusel
    preloadImages().then(() => {
        initCarousel();
    });

    function initCarousel() {
        // Inicializar el carrusel con opciones optimizadas
        const heroCarouselElement = document.getElementById('heroCarousel');
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
            activateSlideAnimations(firstSlide);
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
        
        heroCarouselElement.addEventListener('slid.bs.carousel', function(event) {
            const currentSlide = document.querySelector('.carousel-item.active');
            if (currentSlide) {
                activateSlideAnimations(currentSlide);
            }
        });
        
        // Ajustar altura y responsiveness
        adjustCarouselHeight();
        window.addEventListener('resize', debounce(adjustCarouselHeight, 150));
        
        // Fix para dispositivos móviles
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            window.addEventListener('orientationchange', function() {
                setTimeout(adjustCarouselHeight, 200);
            });
        }
        
        // Garantizar reproducción continua
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                heroCarousel.cycle();
            }
        });
    }
    
    // Activar animaciones en un slide específico
    function activateSlideAnimations(slide) {
        // Crear una secuencia de animaciones con pequeños intervalos
        const title = slide.querySelector('.animate-title');
        const text = slide.querySelector('.animate-text');
        const buttons = slide.querySelector('.hero-buttons');
        
        if (title) {
            setTimeout(() => {
                title.classList.add('animate');
            }, 100);
        }
        
        if (text) {
            setTimeout(() => {
                text.classList.add('animate');
            }, 300);
        }
        
        if (buttons) {
            setTimeout(() => {
                buttons.classList.add('animate');
                
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
            }, 500);
        }
        
        // Activar animación de imagen
        slide.classList.add('animate-bg');
    }
    
    // Desactivar animaciones en un slide
    function deactivateSlideAnimations(slide) {
        const animatedElements = slide.querySelectorAll('.animate-title, .animate-text, .hero-buttons, .animate-btn-1, .animate-btn-2');
        animatedElements.forEach(el => {
            el.classList.remove('animate');
        });
        
        // Desactivar animación de imagen
        slide.classList.remove('animate-bg');
    }
    
    // Preparar el próximo slide para transición suave
    function prepareNextSlide(slide) {
        // Posicionar elementos fuera de vista para animación
        const title = slide.querySelector('.animate-title');
        const text = slide.querySelector('.animate-text');
        const buttons = slide.querySelector('.hero-buttons');
        
        if (title) title.style.opacity = '0';
        if (text) text.style.opacity = '0';
        if (buttons) buttons.style.opacity = '0';
        
        // Preparar el fondo para nueva animación
        slide.style.transform = 'scale(1)';
    }
    
    // Función para ajustar altura
    function adjustCarouselHeight() {
        const carousel = document.getElementById('heroCarousel');
        const viewportHeight = window.innerHeight;
        
        // Aplicar altura al carrusel y slides
        carousel.style.height = viewportHeight + 'px';
        document.querySelectorAll('.carousel-item').forEach(item => {
            item.style.height = viewportHeight + 'px';
        });
    }
    
    // Precargar imágenes mejorado con Promises
    function preloadImages() {
        return new Promise((resolve) => {
            const imagePaths = [
                './assets/img/houseLux1.jpeg',
                './assets/img/houseLux2.jpeg',
                './assets/img/workRealizer2.jpg',
            ];
            
            let loadedCount = 0;
            const totalImages = imagePaths.length;
            
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
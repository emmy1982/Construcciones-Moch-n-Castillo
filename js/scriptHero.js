// Carrusel - optimización y sincronización de animaciones
document.addEventListener('DOMContentLoaded', function() {
    // Detección de navegadores
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // Aplicar clase específica para el navegador al body
    if (isSafari) {
        document.body.classList.add('safari');
    } else if (isFirefox) {
        document.body.classList.add('firefox');
    }
    
    // Precarga de imágenes con mejor manejo de errores
    preloadCarouselImages().then(() => {
        // Pequeño retraso para Safari que ayuda con la inicialización
        const initDelay = isSafari ? 200 : 0;
        setTimeout(initCarousel, initDelay);
    }).catch(() => {
        // Si falla la precarga, iniciar el carrusel de todos modos
        console.warn('Algunas imágenes no se precargaron correctamente');
        initCarousel();
    });

    function initCarousel() {
        // Inicializar el carrusel con opciones optimizadas
        const heroCarouselElement = document.getElementById('heroCarousel');
        if (!heroCarouselElement) return;
        
        // Aplicar optimizaciones específicas para cada navegador
        applyBrowserSpecificFixes(heroCarouselElement);
        
        // Bootstrap Carousel con opciones optimizadas
        const heroCarousel = new bootstrap.Carousel(heroCarouselElement, {
            interval: 6000,        // 6 segundos entre slides
            pause: 'false',        // No pausar al pasar el ratón
            ride: 'carousel',      // Iniciar automáticamente
            wrap: true,            // Volver al principio después del último slide
            touch: true,           // Permitir gestos táctiles
            keyboard: false        // Desactivar controles de teclado para evitar cambios accidentales
        });

        // Asegurar que el primer slide tenga las animaciones activadas al cargar
        const firstSlide = document.querySelector('.carousel-item.active');
        if (firstSlide) {
            // Usar un pequeño retraso para el primer slide
            setTimeout(() => {
                resetAndActivateSlideAnimations(firstSlide);
            }, 100);
        }
        
        // Manejar transiciones entre slides de manera más fiable
        heroCarouselElement.addEventListener('slide.bs.carousel', function(event) {
            // Desactivar animaciones del slide actual antes de cambiar
            const currentSlide = event.from !== undefined 
                ? heroCarouselElement.querySelectorAll('.carousel-item')[event.from]
                : document.querySelector('.carousel-item.active');
                
            if (currentSlide) {
                deactivateSlideAnimations(currentSlide);
            }
            
            // Preparar el próximo slide antes de la transición
            const nextSlide = event.to !== undefined
                ? heroCarouselElement.querySelectorAll('.carousel-item')[event.to]
                : event.relatedTarget;
                
            if (nextSlide) {
                prepareNextSlide(nextSlide);
            }
        });
        
        heroCarouselElement.addEventListener('slid.bs.carousel', function(event) {
            // Activar animaciones del nuevo slide después de la transición
            const newSlide = event.to !== undefined
                ? heroCarouselElement.querySelectorAll('.carousel-item')[event.to]
                : document.querySelector('.carousel-item.active');
                
            if (newSlide) {
                // Usar un temporizador para permitir que la transición se complete
                setTimeout(() => {
                    resetAndActivateSlideAnimations(newSlide);
                }, 50);
            }
        });
        
        // Ajustar altura y responsiveness de manera más eficiente
        adjustCarouselHeight();
        
        // Optimizar eventos de resize para mejor rendimiento
        const debouncedResize = debounce(() => {
            adjustCarouselHeight();
            // Actualizar el valor de --vh para dispositivos móviles
            if (isIOS || isSafari) {
                updateVHVariable();
            }
        }, 150);
        
        window.addEventListener('resize', debouncedResize);
        
        // Fix especial para iOS
        if (isIOS) {
            // Solucionar problema de altura en iOS
            updateVHVariable();
            
            // Manejar cambios de orientación de manera más fiable
            window.addEventListener('orientationchange', () => {
                // iOS necesita más tiempo para actualizar dimensiones después de cambio de orientación
                setTimeout(() => {
                    updateVHVariable();
                    adjustCarouselHeight();
                    
                    // Buscar el slide activo y reactivar sus animaciones
                    const activeSlide = document.querySelector('.carousel-item.active');
                    if (activeSlide) {
                        resetAndActivateSlideAnimations(activeSlide);
                    }
                }, 500);
            });
        }
        
        // Garantizar reproducción continua cuando la pestaña vuelve a estar activa
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                heroCarousel.cycle();
                
                // Reiniciar animaciones del slide activo
                const activeSlide = document.querySelector('.carousel-item.active');
                if (activeSlide) {
                    resetAndActivateSlideAnimations(activeSlide);
                }
            } else {
                // Pausar cuando la pestaña no es visible
                heroCarousel.pause();
            }
        });
    }
    
    // Aplicar arreglos específicos para cada navegador
    function applyBrowserSpecificFixes(carouselElement) {
        // Base de estilos para todos los navegadores
        carouselElement.style.willChange = 'transform, opacity';
        
        if (isSafari) {
            // Fixes específicos para Safari
            carouselElement.style.webkitBackfaceVisibility = 'hidden';
            carouselElement.style.backfaceVisibility = 'hidden';
            carouselElement.style.webkitTransformStyle = 'preserve-3d';
            carouselElement.style.transformStyle = 'preserve-3d';
            carouselElement.style.webkitPerspective = '1000px';
            carouselElement.style.perspective = '1000px';
            
            // Fixes adicionales para elementos del carrusel en Safari
            document.querySelectorAll('.carousel-item, .animate-title, .animate-text, .hero-buttons').forEach(el => {
                el.style.webkitBackfaceVisibility = 'hidden';
                el.style.backfaceVisibility = 'hidden';
                el.style.webkitTransformStyle = 'preserve-3d';
                el.style.transformStyle = 'preserve-3d';
            });
        }
    }
    
    // Resetear y activar animaciones en un nuevo slide
    function resetAndActivateSlideAnimations(slide) {
        if (!slide) return;
        
        // Primero resetear todas las animaciones
        const animatedElements = slide.querySelectorAll('.animate-title, .animate-text, .hero-buttons, .animate-btn-1, .animate-btn-2');
        animatedElements.forEach(el => {
            el.classList.remove('animate');
            // Forzar repaint para asegurar el reseteo
            void el.offsetWidth;
        });
        
        // Eliminar clase de animación de fondo
        slide.classList.remove('animate-bg');
        void slide.offsetWidth;
        
        // Secuencia de activación con timing mejorado
        // Activar primero la animación de fondo
        slide.classList.add('animate-bg');
        
        // Luego activar los elementos de texto en secuencia
        const title = slide.querySelector('.animate-title');
        const text = slide.querySelector('.animate-text');
        const buttons = slide.querySelector('.hero-buttons');
        
        // Usar una secuencia más precisa para las animaciones
        if (title) {
            setTimeout(() => {
                title.classList.add('animate');
                
                // También aplicar estilos directamente para Safari
                if (isSafari) {
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                    title.style.webkitTransform = 'translateY(0)';
                }
            }, 100);
        }
        
        if (text) {
            setTimeout(() => {
                text.classList.add('animate');
                
                if (isSafari) {
                    text.style.opacity = '1';
                    text.style.transform = 'translateY(0)';
                    text.style.webkitTransform = 'translateY(0)';
                }
            }, 300);
        }
        
        if (buttons) {
            setTimeout(() => {
                buttons.classList.add('animate');
                
                if (isSafari) {
                    buttons.style.opacity = '1';
                    buttons.style.transform = 'translateY(0)';
                    buttons.style.webkitTransform = 'translateY(0)';
                }
                
                // Activar botones individualmente
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
    }
    
    // Desactivar animaciones en un slide que se va a ocultar
    function deactivateSlideAnimations(slide) {
        if (!slide) return;
        
        // Remover clases de animación
        slide.classList.remove('animate-bg');
        
        const elements = slide.querySelectorAll('.animate-title, .animate-text, .hero-buttons, .animate-btn-1, .animate-btn-2');
        elements.forEach(el => {
            el.classList.remove('animate');
            
            // En Safari, también resetear estilos directamente
            if (isSafari) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.webkitTransform = 'translateY(30px)';
            }
        });
    }
    
    // Preparar el próximo slide para la transición
    function prepareNextSlide(slide) {
        if (!slide) return;
        
        // Posicionar elementos fuera de vista para animación
        const elements = slide.querySelectorAll('.animate-title, .animate-text, .hero-buttons');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            if (isSafari) {
                el.style.webkitTransform = 'translateY(30px)';
            }
        });
        
        // Asegurar que el fondo comienza sin zoom
        slide.style.transform = 'scale(1)';
        if (isSafari) {
            slide.style.webkitTransform = 'scale(1)';
        }
    }
    
    // Función para ajustar altura del carrusel de manera más confiable
    function adjustCarouselHeight() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;
        
        const viewportHeight = window.innerHeight;
        const headerHeight = 0; // Ajustar si hay un header fijo
        
        // Calcular altura óptima
        const optimalHeight = viewportHeight - headerHeight;
        
        // Aplicar altura calculada
        carousel.style.height = `${optimalHeight}px`;
        
        // Aplicar la misma altura a todos los slides
        document.querySelectorAll('.carousel-item').forEach(item => {
            item.style.height = `${optimalHeight}px`;
        });
        
        // Fix específico para Safari
        if (isSafari) {
            // Forzar redibujado
            void carousel.offsetHeight;
            
            // En iOS, usar la variable CSS personalizada
            if (isIOS) {
                carousel.style.height = `calc(var(--vh, 1vh) * 100)`;
                document.querySelectorAll('.carousel-item').forEach(item => {
                    item.style.height = `calc(var(--vh, 1vh) * 100)`;
                });
            }
        }
    }
    
    // Actualizar la variable CSS --vh para iOS
    function updateVHVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Precargar imágenes del carrusel con mejor manejo de errores
    function preloadCarouselImages() {
        return new Promise((resolve, reject) => {
            // Rutas de las imágenes utilizadas en el carrusel
            const imagePaths = [
                './assets/img/houseLux1.jpeg',
                './assets/img/heroInteg.jpg',
                './assets/img/workRealizer2.jpg',
            ];
            
            let loadedCount = 0;
            let errorCount = 0;
            const totalImages = imagePaths.length;
            
            // Si no hay imágenes para precargar, resolver inmediatamente
            if (totalImages === 0) {
                resolve();
                return;
            }
            
            // Función para controlar carga/error de imágenes
            const handleImageResult = () => {
                loadedCount++;
                
                // Resolver cuando todas las imágenes estén procesadas
                if (loadedCount === totalImages) {
                    if (errorCount > 0) {
                        console.warn(`${errorCount} de ${totalImages} imágenes no se cargaron correctamente`);
                    }
                    resolve();
                }
            };
            
            // Precargar cada imagen
            imagePaths.forEach(path => {
                const img = new Image();
                
                img.onload = handleImageResult;
                img.onerror = () => {
                    errorCount++;
                    console.warn(`Error al precargar: ${path}`);
                    handleImageResult();
                };
                
                // Iniciar carga de la imagen
                img.src = path;
            });
            
            // Tiempo máximo de espera por si falla alguna carga
            setTimeout(() => {
                if (loadedCount < totalImages) {
                    console.warn(`Precarga de imágenes incompleta: ${loadedCount}/${totalImages}`);
                    resolve(); // Resolver de todos modos para no bloquear
                }
            }, 3000);
        });
    }
    
    // Función debounce optimizada
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});
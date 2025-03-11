// Asegurar que el script se ejecuta después de que la página esté completamente cargada
window.addEventListener('load', function() {
    // Pequeño retraso para asegurar que todos los elementos están renderizados
    setTimeout(function() {
        initPortfolioSwiper();
    }, 500);
});

function initPortfolioSwiper() {
    // Comprobar si los elementos existen antes de inicializar
    if (document.querySelector('.portfolioSwiper')) {
        try {
            // Destruir instancia previa si existe
            if (window.portfolioSwiper) {
                window.portfolioSwiper.destroy(true, true);
            }
            
            // Inicialización del carrusel de portfolio con configuración simplificada para móviles
            window.portfolioSwiper = new Swiper('.portfolioSwiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                grabCursor: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.portfolio-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.portfolio-next',
                    prevEl: '.portfolio-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2, 
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                },
                on: {
                    init: function() {
                        console.log('Portfolio Swiper initialized successfully');
                    }
                }
            });
            
            console.log('Portfolio Swiper initialized');
        } catch (error) {
            console.error('Error initializing Portfolio Swiper:', error);
        }
    } else {
        console.warn('Portfolio Swiper element not found');
    }

    // Funcionalidad para ampliar las imágenes al hacer clic
    const portfolioZoomLinks = document.querySelectorAll('.portfolio-zoom');
    
    if (portfolioZoomLinks.length > 0) {
        portfolioZoomLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('href');
                
                // Crear modal para la imagen
                const modal = document.createElement('div');
                modal.classList.add('portfolio-modal');
                
                modal.innerHTML = `
                    <div class="portfolio-modal-content">
                        <span class="portfolio-close">&times;</span>
                        <img src="${imgSrc}" alt="Imagen ampliada">
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Mostrar modal con animación
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
                
                // Cerrar el modal al hacer clic en la X o fuera de la imagen
                modal.addEventListener('click', function(e) {
                    if (e.target === modal || e.target.classList.contains('portfolio-close')) {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    }
                });
            });
        });
    }
}

// Reinicializar en orientación del dispositivo
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        initPortfolioSwiper();
    }, 200);
});

// Reinicializar al cambiar el tamaño de la ventana
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initPortfolioSwiper();
    }, 250);
});
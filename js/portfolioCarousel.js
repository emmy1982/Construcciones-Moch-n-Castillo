// Asegurar inicialización una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar después de un pequeño retraso para evitar problemas de timing
    setTimeout(initializePortfolioSwiper, 200);
});

// Función principal de inicialización
function initializePortfolioSwiper() {
    // Verificar si existe el elemento del swiper
    const swiperElement = document.querySelector('.portfolioSwiper');
    if (!swiperElement) {
        console.warn('Portfolio Swiper element not found');
        return;
    }

    try {
        // Configuración básica para todos los tamaños
        const swiperOptions = {
            loop: true,
            slidesPerView: 1, // Por defecto mostrar 1 slide
            spaceBetween: 10,
            autoHeight: true, // Altura automática para adaptarse al contenido
            observer: true, // Reobservar para cambios dinámicos
            observeParents: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.portfolio-pagination',
                clickable: true,
            }
        };

        // Solo agregar navegación en pantallas grandes
        if (window.innerWidth >= 768) {
            swiperOptions.navigation = {
                nextEl: '.portfolio-next',
                prevEl: '.portfolio-prev'
            };
        }

        // Configuración responsive
        swiperOptions.breakpoints = {
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        };

        // Inicializar Swiper con las opciones
        const portfolioSwiper = new Swiper('.portfolioSwiper', swiperOptions);
        console.log('Portfolio Swiper initialized successfully');

        // Configurar funcionalidad de zoom para las imágenes
        setupImageZoom();

    } catch (error) {
        console.error('Error initializing Portfolio Swiper:', error);
        // Intentar una solución alternativa
        createFallbackGallery();
    }
}

// Configurar funcionalidad de zoom para imágenes
function setupImageZoom() {
    const zoomLinks = document.querySelectorAll('.portfolio-zoom');
    if (!zoomLinks.length) return;

    zoomLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('href');
            
            // Usar un enfoque diferente para móviles vs. escritorio
            if (window.innerWidth < 576) {
                // Versión simple para móviles pequeños
                const lightbox = document.createElement('div');
                lightbox.style.position = 'fixed';
                lightbox.style.top = '0';
                lightbox.style.left = '0';
                lightbox.style.width = '100vw';
                lightbox.style.height = '100vh';
                lightbox.style.backgroundColor = 'rgba(0,0,0,0.9)';
                lightbox.style.zIndex = '9999';
                lightbox.style.display = 'flex';
                lightbox.style.alignItems = 'center';
                lightbox.style.justifyContent = 'center';
                
                const img = document.createElement('img');
                img.src = imgSrc;
                img.style.maxWidth = '90%';
                img.style.maxHeight = '90%';
                img.style.objectFit = 'contain';
                
                lightbox.appendChild(img);
                document.body.appendChild(lightbox);
                
                // Cerrar al tocar
                lightbox.addEventListener('click', () => {
                    document.body.removeChild(lightbox);
                });
            } else {
                // Versión completa para escritorio
                showModalImage(imgSrc);
            }
        });
    });
}

// Mostrar imagen en modal (para pantallas grandes)
function showModalImage(imgSrc) {
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
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    // Cerrar modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('portfolio-close')) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Crear galería alternativa si Swiper falla
function createFallbackGallery() {
    const container = document.querySelector('.portfolio-carousel-container');
    if (!container) return;
    
    const slides = Array.from(document.querySelectorAll('.swiper-slide'));
    if (!slides.length) return;
    
    // Crear una vista estática con Bootstrap
    let html = '<div class="row">';
    
    slides.forEach((slide) => {
        const img = slide.querySelector('.portfolio-img img');
        const title = slide.querySelector('.portfolio-info h3');
        const category = slide.querySelector('.portfolio-info .category');
        const desc = slide.querySelector('.portfolio-info p');
        
        html += `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-img-container" style="height:200px; overflow:hidden;">
                    <img src="${img ? img.src : ''}" class="card-img-top" alt="${title ? title.textContent : ''}" 
                         style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title ? title.textContent : 'Proyecto'}</h5>
                    <span class="badge bg-danger">${category ? category.textContent : ''}</span>
                    <p class="card-text mt-2">${desc ? desc.textContent : ''}</p>
                </div>
            </div>
        </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    console.log('Fallback gallery created');
}

// Reinicializar cuando cambie la orientación del dispositivo
window.addEventListener('orientationchange', function() {
    setTimeout(initializePortfolioSwiper, 300);
});

// Gestionar cambios de tamaño
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initializePortfolioSwiper, 250);
});
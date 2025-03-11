document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('overlay');
    
    function toggleMenu() {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
        
        const logoImage = document.querySelector('.navbar-brand img');
        const originalSrc = logoImage.src;
        const alternateSrc = logoImage.dataset.alternateLogo;
        
        // Cambia la imagen del logo cuando el menú está abierto
        if (hamburger.classList.contains('open')) {
            logoImage.setAttribute('data-original-logo', originalSrc);
            logoImage.src = alternateSrc;
        } else {
            logoImage.src = logoImage.getAttribute('data-original-logo');
        }
    }
    
    // Event listener para el botón de menú
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Event listeners para los enlaces del overlay
    const overlayLinks = document.querySelectorAll('.overlay a');
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });
});

// Slider testimonios
var swiper = new Swiper(".testimonials", {
    effect: "flip",
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    loop: true,
});

document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Función para mostrar u ocultar el botón según la posición de scroll
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Inicialmente comprobar si debemos mostrar el botón
    toggleBackToTopButton();
    
    // Escuchar el evento de scroll para mostrar/ocultar el botón
    window.addEventListener('scroll', function() {
        toggleBackToTopButton();
        
        // Eliminar la clase de animación si existe
        if (backToTopButton.classList.contains('bounce')) {
            backToTopButton.classList.remove('bounce');
        }
    });
    
    // Función para desplazarse suavemente hacia arriba
    backToTopButton.addEventListener('click', function() {
        // Añadir clase de animación al hacer clic
        this.classList.add('bounce');
        
        // Desplazamiento suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización del swiper de testimonios
    if (document.querySelector('.testimonials')) {
        const testimonialsSwiper = new Swiper('.testimonials', {
            effect: "flip",
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            loop: true
        });
    }
});

// Estilos y animaciones 

const elements = document.querySelectorAll('.box-scroll, .tituloTop , .box-scale, .titulo-scale, .box-left, .titulo-left, .box-right, .titulo-right, .box-fade, .titulo-fade')

function mostrarElements(){
    const altura = window.innerHeight * 0.8

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top

        if(elementTop < altura) {
            element.classList.add('show')
        }else{
            element.classList.remove('show')
        }
    });
}

window.addEventListener('scroll', mostrarElements)


// Añadir al archivo script.js
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    const overlay = document.getElementById('overlay');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Si el overlay está visible (menú móvil abierto)
            if (overlay && window.getComputedStyle(overlay).display !== 'none') {
                document.getElementById('menuToggle').click();
            }
            
            // Pequeño retraso para el desplazamiento en móviles
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#') {
                setTimeout(() => {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Ajuste para compensar la altura del menú fijo
                        const offset = 80; 
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('overlay');
    const mainNav = document.getElementById('mainNav');
    const spanTogle = document.querySelectorAll('.hamburger span');
    const navLinks = document.querySelectorAll('.nav-link'); 
    
    // Función para alternar el menú móvil
    function toggleMenu() {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
        
        // Si el menú está abierto, cambia el color de fondo del navbar para mejor contraste
        if (hamburger.classList.contains('open')) {
            mainNav.style.backgroundColor = 'transparent';
            mainNav.style.boxShadow = 'none';
        } else {
            mainNav.style.backgroundColor = '';
            mainNav.style.boxShadow = '';
        }
    }
    
    // Event listener para el botón de menú
    menuToggle.addEventListener('click', toggleMenu);
    
    // Event listeners para los enlaces del overlay
    const overlayLinks = document.querySelectorAll('.overlay a');
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });
    
    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
            spanTogle.forEach(span => {
                span.style.backgroundColor = '#000'
            });
            navLinks.forEach(link => {
                link.style.color = '#000';
            });
        } else {
            mainNav.classList.remove('scrolled');
            spanTogle.forEach(span => {
                span.style.backgroundColor = '#fff';
            });
            navLinks.forEach(link => {
                link.style.color = '#fff';
            });
        }
    });
    
    // Cerrar el menú al redimensionar la ventana si está en modo desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991 && hamburger.classList.contains('open')) {
            toggleMenu();
        }
    });
});


//   Slider testimonios

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

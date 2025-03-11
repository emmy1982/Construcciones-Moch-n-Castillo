document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('overlay');
    
    function toggleMenu() {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
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

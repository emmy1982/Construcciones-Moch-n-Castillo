// Script para manejar el comportamiento del navbar al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    // Detectar Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Función para actualizar la apariencia del navbar según la posición del scroll
    function updateNavbar() {
        // Fix de seguridad para posibles errores en Safari
        if (!navbar) return;
        
        // Obtener posición actual de scroll con fallback para Safari antiguo
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > 50) { // Reducir umbral de scroll para cambio más rápido
            // Cuando se hace scroll, agregar fondo y sombra al navbar
            navbar.style.position = 'fixed';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '5px 0'; // Reducir padding cuando está fijo
            
            // Fix para iOS Safari que a veces tiene problemas al cambiar posición fixed
            if (isSafari) {
                navbar.style.top = '0';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.zIndex = '1030';
                
                // Forzar redibujado en Safari
                void navbar.offsetHeight;
            }
            
            // Cambiar el color de los enlaces a oscuro con método más compatible
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#4b4b4b';
            });
            
            // Cambiar el color de las líneas del hamburger
            const hamburgerLines = document.querySelectorAll('.hamburger span');
            hamburgerLines.forEach(line => {
                line.style.backgroundColor = '#4b4b4b';
            });
        } else {
            // Al principio de la página, mantener transparente
            navbar.style.position = 'absolute';
            navbar.style.backgroundColor = 'transparent';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '10px 0'; // Más padding cuando es transparente
            
            // Mantener los enlaces en color claro
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#f8f9fa';
            });
            
            // Mantener las líneas del hamburger en color claro
            const hamburgerLines = document.querySelectorAll('.hamburger span');
            hamburgerLines.forEach(line => {
                line.style.backgroundColor = '#f8f9fa';
            });
        }
    }
    
    // Inicializar y actualizar cuando se hace scroll
    updateNavbar();
    
    // Usar throttle para reducir la frecuencia de llamadas durante scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateNavbar();
                scrollTimeout = null;
            }, 10); // pequeño retraso para mejor rendimiento
        }
    });
    
    // También actualizar cuando cambie el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateNavbar, 100);
    });
    
    // Actualizar después de que la página haya cargado completamente
    window.addEventListener('load', updateNavbar);
}); 
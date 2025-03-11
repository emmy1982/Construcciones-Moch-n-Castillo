// Script para manejar el comportamiento del navbar al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNav');
    
    // Función para actualizar la apariencia del navbar según la posición del scroll
    function updateNavbar() {
        if (window.scrollY > 50) { // Reducir umbral de scroll para cambio más rápido
            // Cuando se hace scroll, agregar fondo y sombra al navbar
            navbar.style.position = 'fixed';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '5px 0'; // Reducir padding cuando está fijo
            
            // Cambiar el color de los enlaces a oscuro
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
    window.addEventListener('scroll', updateNavbar);
    
    // También actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', updateNavbar);
}); 
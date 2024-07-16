// Cierre de mensajes flash
document.addEventListener('DOMContentLoaded', function() {
    var closeButtons = document.querySelectorAll('.alert-dismissible .close');
    var alerts = document.querySelectorAll('.alert-dismissible');

    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var alert = button.parentElement;
            alert.style.display = 'none';
        });
    });

    // Ocultar automáticamente después de 5 segundos
    setTimeout(function() {
        alerts.forEach(function(alert) {
            alert.style.display = 'none';
        });
    }, 3000); // 3000 milisegundos = 3 segundos
});
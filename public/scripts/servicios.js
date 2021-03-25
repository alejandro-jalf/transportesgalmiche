window.addEventListener('load', function() {
    const servicio_cobertura = document.querySelector('#servicio-cobertura');
    const servicio_flotilla = document.querySelector('#servicio-flotilla');
    const servicio_clientes = document.querySelector('#servicio-clientes');
    const principalesServicios = document.querySelector('.principal-servicios');
    const cobertura = document.querySelector('.cobertura');
    const flotilla = document.querySelector('.flotilla');
    
    servicio_cobertura.addEventListener('click', function() {
        const mover = principalesServicios.clientHeight + 450;
        $('body,html').animate({ scrollTop: mover + 'px' },500);
    });
    servicio_flotilla.addEventListener('click', function() {
        const mover = 
            principalesServicios.clientHeight +
            450 +
            cobertura.clientHeight;
            $('body,html').animate({ scrollTop: mover + 'px' },500);
    });
    servicio_clientes.addEventListener('click', function() {
        const mover = principalesServicios.clientHeight +
        455 +
        cobertura.clientHeight +
        flotilla.clientHeight;
        $('body,html').animate({ scrollTop: mover + 'px' },500);
    });
    
});
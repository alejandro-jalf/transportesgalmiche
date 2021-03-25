window.addEventListener('load', function() {
    const servicio_cobertura = document.querySelector('#servicio-cobertura');
    const servicio_flotilla = document.querySelector('#servicio-flotilla');
    const servicio_clientes = document.querySelector('#servicio-clientes');
    const principalesServicios = document.querySelector('.principal-servicios');
    const cobertura = document.querySelector('.cobertura');
    const flotilla = document.querySelector('.flotilla');
    
    servicio_cobertura.addEventListener('click', function() {
        const mover = principalesServicios.clientHeight + 450;
        window.scrollTo(0, mover);
    });
    servicio_flotilla.addEventListener('click', function() {
        const mover = 
            principalesServicios.clientHeight +
            450 +
            cobertura.clientHeight;
        window.scrollTo(0, mover);
    });
    servicio_clientes.addEventListener('click', function() {
        const mover = principalesServicios.clientHeight +
        455 +
        cobertura.clientHeight +
        flotilla.clientHeight;
        window.scrollTo(0, mover);
    });
    
});
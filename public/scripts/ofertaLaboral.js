window.addEventListener('load', function() {
    const dondeface = document.querySelector("#dondeface");
    const dondepagina = document.querySelector("#dondepagina");
    const dondeinstagram = document.querySelector("#dondeinstagram");
    const dondeamigo = document.querySelector("#dondeamigo");
    const dondepublicidad = document.querySelector("#dondepublicidad");
    const dondeotro = document.querySelector("#dondeotro");

    const setInputOther = () => {
        if (dondeotro.checked) {
            $("#otroInput").show(300);
        } else {
            $("#otroInput").hide(200);
        }
    }

    const loadEvents = () => {
        dondeface.addEventListener('click', setInputOther);
        dondepagina.addEventListener('click', setInputOther);
        dondeinstagram.addEventListener('click', setInputOther);
        dondeamigo.addEventListener('click', setInputOther);
        dondepublicidad.addEventListener('click', setInputOther);
        dondeotro.addEventListener('click', setInputOther);
    }

    const main = () => {
        setInputOther();
        loadEvents();
    }

    main();

});
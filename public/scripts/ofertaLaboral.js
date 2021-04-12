window.addEventListener('load', function() {
    const dondeface = document.querySelector("#dondeface");
    const dondepagina = document.querySelector("#dondepagina");
    const dondeinstagram = document.querySelector("#dondeinstagram");
    const dondeamigo = document.querySelector("#dondeamigo");
    const dondepublicidad = document.querySelector("#dondepublicidad");
    const dondeotro = document.querySelector("#dondeotro");
    const btnShowForm = document.querySelector("#btn-show-form");
    const spanFillForm = document.querySelector("#spanFillForm");
    const contentFillBtn = document.querySelector("#contentFillBtn");

    let showForm = false;

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
        btnShowForm.addEventListener('click', function() {
            if (showForm) {
                spanFillForm.classList.remove('icofont-collapse');
                spanFillForm.classList.add('icofont-tasks');
                contentFillBtn.innerHTML = 'Rellenar formulario';
            } else {
                spanFillForm.classList.remove('icofont-tasks');
                spanFillForm.classList.add('icofont-collapse');
                contentFillBtn.innerHTML = 'Minimizar formulario';
            }
            showForm = !showForm;
        });
    }

    const main = () => {
        setInputOther();
        loadEvents();
    }

    main();

});
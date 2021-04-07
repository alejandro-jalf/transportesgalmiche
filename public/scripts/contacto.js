window.addEventListener('load', function() {
    const nameemail = document.querySelector('#nameemail');
    const phoneemail = document.querySelector('#phoneemail');
    const emailEmail = document.querySelector('#emailEmail');
    const cuerpoEmail = document.querySelector('#cuerpoEmail');
    const btnSendMail = document.querySelector('#btnSendMail');
    const contentModal = document.querySelector('#contentModal');
    const textHeaderModal = document.querySelector('#textHeaderModal');
    const headerModal = document.querySelector('#headerModal');
    const urlApi = 'https://';
    
    let textName = '';
    let textPhone = '';
    let textMail = '';
    let textBody = '';

    const showMessage = (content = '') => {
        contentModal.innerHTML = content;
        $('#modalAdvertencia').modal('show');
    };

    const isValidDataMail = () => {
        textName = nameemail.value;
        textPhone = phoneemail.value;
        textMail = emailEmail.value;
        textBody = cuerpoEmail.value;

        if (textName.trim() === '') {
            showMessage('Necesitas ingresar tu nombre completo');
            return false;
        }

        if (textPhone.trim() === '') {
            showMessage('Se requiere de un numero de telefono para poder contactarnos contigo');
            return false;
        }

        if (textMail.trim() === '') {
            showMessage('Falta que ingreses tu correo electronico');
            return false;
        }

        if (textBody.trim() === '') {
            showMessage('Falta ingresar el contenido del mensaje');
            return false;
        }

        return true;
    };

    const sendMail = () => {
        $('#loading').show();

        if (isValidDataMail()) {
            axios({
                method: 'post',
                url: urlApi,
                data: {
                    name: textName,
                    phone: textPhone,
                    email: textMail,
                    body: textBody
                }
            })
            .then(function(response) {
                $('#loading').hide();
                if (response.data.success) {
                    headerModal.classList.remove("bg-warning");
                    headerModal.classList.remove("bg-danger");
                    headerModal.classList.add("bg-info");

                    textHeaderModal.innerHTML = 'Exito en el envio';
                    
                    showMessage(response.data.message);
                } else {
                    headerModal.classList.remove("bg-info");
                    headerModal.classList.remove("bg-danger");
                    headerModal.classList.add("bg-warning");
                    
                    textHeaderModal.innerHTML = 'Fallo en el envio';

                    showMessage(response.data.message);
                }
                
                $('#loading').hide();
            })
            .catch(function(error) {
                console.log(error);
                headerModal.classList.remove("bg-warning");
                headerModal.classList.remove("bg-info");
                headerModal.classList.add("bg-danger");

                textHeaderModal.innerHTML = 'Fallo en el envio';

                if (error.response) {
                    showMessage(error.response.data.message);
                } else {
                    showMessage('No se puedo enviar el correo intentelo mas tarde');
                }

                $('#loading').hide();
            });
        } else {
            console.log('Entro aca');
            $('#loading').hide();
        }
    };

    const main = () => {
        btnSendMail.addEventListener('click', sendMail);
    };

    main();

});

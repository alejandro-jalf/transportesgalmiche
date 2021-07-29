var applogin = new Vue({
    el: '#app',
    data() {
        return {
            viewPassword: false,
            loading: true,
            user: '',
            password: '',
            alertDialog: {
                title: 'Advertencia',
                message: 'Mensage',
                headerColor: 'text-white',
                headerBackground: 'bg-warning',
            },
            recoveryPassword: false,
            emailForRecovery: '',
        }
    },
    computed: {
        typeInput() {
            return this.viewPassword ? 'text' : 'password'
        },
        iconSesion() {
            return this.recoveryPassword ? 'icofont-id' : 'icofont-business-man'
        },
    },
    mounted() {
        this.session = this.getSession();
        if (this.session) window.location.href = './administra.html';
    },
    methods: {
        getSession() {
            if (localStorage.getItem("SESSION_ADMINISTRACION"))
                return localStorage.getItem("SESSION_ADMINISTRACION") == "true"
            return false;
        },
        setRecoveryPassword(recoveryPassword) {
            this.recoveryPassword = recoveryPassword
        },
        focusPassword() {
            this.$refs.inputPassword.focus();
        },
        showAlertDialog(message = '', title = 'Advertencia', hColor = 'text-white', hBackground = 'bg-warning') {
            this.alertDialog.message = message; 
            this.alertDialog.title = title; 
            this.alertDialog.headerColor = hColor; 
            this.alertDialog.headerBackground = hBackground;
            $('#exampleModal').modal('show');
        },
        validateData() {
            if (this.user.trim() === '') {
                this.showAlertDialog('Necesita ingresar un correo electronico')
                return false;
            }
            if (this.password.trim() === '') {
                this.showAlertDialog('Necesita ingresar su contraseña')
                return false;
            }
            return true;
        },
        async initSesion() {
            if (this.validateData()) {
                const urlApi = 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/login';
                try {
                    const response = await axios({
                        method: 'post',
                        url: urlApi,
                        data: {
                            correo_user: this.user.trim(),
                            password_user: this.password.trim(),
                        }
                    })
                    
                    $('#loading').hide();
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito al iniciar sesion',
                            'text-white',
                            'bg-success'
                        );
                        localStorage.setItem("SESSION_ADMINISTRACION", true);
                        window.location.href = './administra.html';
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia  al iniciar sesion',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    $('#loading').hide();
                } catch (error) {
                    console.log(error);
                    if (error.response.data) {
                        this.showAlertDialog(
                            error.response.data.message,
                            'Error al iniciar sesion',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al iniciar sesion',
                            'text-white',
                            'bg-danger'
                        );
                    }
                }
            }
        },
    },
})
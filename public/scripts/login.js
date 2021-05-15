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
    methods: {
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
            console.log('Inicia sesion');
            if (this.validateData()) {
                const urlApi = '';
                try {
                    const response = axios({
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
                    if (error.response) {
                        this.showAlertDialog(
                            response.data.message,
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
var appAdministra = new Vue({
    el: '#app',
    data() {
        return {
            alertDialog: {
                title: 'Advertencia',
                message: 'Mensage',
                headerColor: 'text-white',
                headerBackground: 'bg-warning',
            },
            listVacantes: {
                vacante1: {
                    puesto_vacante: 'Vacante 1',
                    requisitos_vacante: 'Vacante 1',
                    disponible_vacante: true,
                },
                vacante2: {
                    puesto_vacante: 'Vacante 2',
                    requisitos_vacante: 'Vacante 2',
                    disponible_vacante: false,
                },
            },
            vacante: {
                name: '',
                requisitos: '',
                disponible: true,
            },
            creandoVacante: false,
        }
    },
    computed: {},
    methods: {
        parseDisponible(disponible) {
            return disponible ? 'Disponible' : 'No disponible'
        },
        getIcon(disponible) {
            return disponible ? 'icofont-toggle-on' : 'icofont-toggle-off'
        },
        getColorButton(disponible) {
            return disponible ? 'btn-success' : 'btn-danger'
        },
        setCreandoVacante(creando) {
            this.creandoVacante = creando;
        },
        showAlertDialog(message = '', title = 'Advertencia', hColor = 'text-white', hBackground = 'bg-warning') {
            this.alertDialog.message = message; 
            this.alertDialog.title = title; 
            this.alertDialog.headerColor = hColor; 
            this.alertDialog.headerBackground = hBackground;
            $('#modalAdministra').modal('show');
        },
        validateData() {
            if (this.vacante.name.trim() === '') {
                this.showAlertDialog('Necesita ingresar el nombre del puesto')
                return false;
            }
            if (this.vacante.requisitos.trim() === '') {
                this.showAlertDialog('Se requiere que ingrese los requisitos')
                return false;
            }
            return true;
        },
        async createVacante() {
            if (!this.validateData()) return
            const urlApi = '';
            try {
                const response = axios({
                    method: 'post',
                    url: urlApi,
                    data: {
                        puesto_vacante: vacante.name.trim(),
                        requisitos_vacante: vacante.requisitos.trim(),
                        disponible_vacante: vacante.disponible,
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
                this.setCreandoVacante(false);
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
                this.setCreandoVacante(false);
            }
        },
    },
})
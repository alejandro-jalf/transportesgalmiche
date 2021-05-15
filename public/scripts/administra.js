var appAdministra = new Vue({
    el: '#app',
    data() {
        return {
            alertDialog: {
                title: 'Advertencia',
                message: 'Mensaje',
                headerColor: 'text-white',
                headerBackground: 'bg-warning',
            },
            alertOptionDialog: {
                title: 'Advertencia',
                message: 'Mensaje',
                headerColor: 'text-white',
                headerBackground: 'bg-warning',
                callBack: () => {},
            },
            // Vacantes
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
            vacante_actual: '',
            vacante: {
                name: '',
                requisitos: '',
                disponible: true,
            },
            creandoVacante: 0,
            // Usuarios
            listUsers: {
                user1: {
                    nombre_user: 'Alguien',
                    apellido_p_user: 'Ape_P',
                    apellido_m_user: 'Ape_M',
                    direccion_user: 'Acayucan, Ver',
                    correo_user: 'alguien@gmail.com',
                    tipo_user: 'manager',
                    activo_user: true,
                    access_to_user: [
                        'perfil' , 'usuarios', 'vacantes',
                    ],
                }
            },
            creandoUser: 0,
            user_actual: '',
            userActual: {
                nombre_user: '',
                apellido_p_user: '',
                apellido_m_user: '',
                direccion_user: '',
                correo_user: '',
                password_user: '',
                password_user_repeat: '',
                tipo_user: 'seleccione',
                activo_user: true,
                access_to_user: [],
            },
            // Perfil
            login: true,
            perfilUser: {
                nombre_user: 'Jose Alejandro',
                apellido_p_user: 'Lopez',
                apellido_m_user: 'Flores',
                direccion_user: 'Acayucan, Ver',
                correo_user: 'alexlofa45@gmail.com',
                tipo_user: 'manager',
                activo_user: true,
                access_to_user: ['vacantes', 'usuarios'],
            },
            editandoPerfil: false,
        }
    },
    computed: {
        statusPassword() {
            if (this.userActual.password_user.trim().length <=  6) return 'is-invalid'
            const expresionLetters = new RegExp('[a-z]|[A-Z]')
            const expresionNumbers = new RegExp('\\d+')

            if (
                !expresionLetters.test(this.userActual.password_user) ||
                !expresionNumbers.test(this.userActual.password_user)
            ) return 'is-invalid'
            return 'is-valid'
        },
        statusPasswordRepeat() {
            if (
                this.userActual.password_user.trim() !==
                this.userActual.password_user_repeat.trim()
            ) return 'is-invalid'
            return 'is-valid'
        },
        viewListUsers() {
            return (this.creandoUser === 0)
        },
        textHeaderCreandoUser() {
            if (this.creandoUser === 2) return 'Editando datos del usuario: ' + this.user_actual;
            return 'Creando nuevo usuario'
        },
        textButtonCreandoUser() {
            if (this.creandoUser === 2) return 'Guardar Cambios'
            return 'Crear Usuario'
        },
        textHeaderCreandoVacante() {
            if (this.creandoVacante === 2) return 'Editando dato del puesto: ' + this.vacante_actual;
            return 'Creando nuevo puesto'
        },
        textButtonCreandoVacante() {
            if (this.creandoVacante === 2) return 'Guardar Cambios'
            return 'Crear puesto'
        },
    },
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
        showAlertOptionsDialog(message = '', title = 'Advertencia', hBackground = 'bg-warning', hColor = 'text-white', callBack = () => {}) {
            this.alertOptionDialog.message = message; 
            this.alertOptionDialog.title = title; 
            this.alertOptionDialog.headerColor = hColor; 
            this.alertOptionDialog.headerBackground = hBackground;
            this.alertOptionDialog.callBack = callBack;
            $('#modalOptionAdministra').modal('show');
        },
        setNewPuesto() {
            this.setCreandoVacante(1);
            this.vacante_actual = '';
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
        viewVacante(vacante) {
            this.vacante_actual = vacante.puesto_vacante;
            const viewVac = { ...vacante }
            this.vacante = {
                name: viewVac.puesto_vacante,
                requisitos: viewVac.requisitos_vacante,
                disponible: viewVac.disponible_vacante,
            },
            this.creandoVacante = 2;
        },
        deleteVacante(vacante) {
            const callBack = async () => {
                try {
                    $('#loading').show(100);
                    const response = await axios({
                        method: 'delete',
                        url: 'https://www.anySite.com/delete/' + vacante,
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    $('#loading').hide(100);
                    this.setCreandoVacante(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            response.data.message,
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    }
                    $('#loading').hide(100);
                }
            }
            this.showAlertOptionsDialog(
                '¿Quiere eliminar la vancante: "' + vacante + '" de manera permanente?',
                'Eliminando vacante',
                'bg-danger',
                'text-white',
                callBack
            )
        },
        changeStatusVacante(Vacante, activoVacante) {
            const callBack = async () => {
                try {
                    $('#loading').show(100);
                    const response = await axios({
                        method: 'put',
                        url: 'https://www.anySite.com/delete/' + Vacante,
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    $('#loading').hide(100);
                    this.setCreandoVacante(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            response.data.message,
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    }
                    $('#loading').hide(100);
                }
            }
            const activoText = activoVacante ? 'No diponible' : 'Disponible';
            this.showAlertOptionsDialog(
                '¿Quiere cambiar la vacante "' + Vacante + '" a ' + activoText + '?',
                'Cambiando estatus de la vacante',
                'bg-warning',
                'text-white',
                callBack
            )
        },
        async createVacante() {
            if (!this.validateData()) return
            const urlApi = '';
            try {
                const response = await axios({
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
                this.setCreandoVacante(0);
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
                this.setCreandoVacante(0);
            }
        },
        // Users
        setNewUsuario() {
            this.creandoUser = 1;
            this.user_actual = '';
        },
        deleteUser(user) {
            const callBack = async () => {
                try {
                    $('#loading').show(100);
                    const response = await axios({
                        method: 'delete',
                        url: 'https://www.anySite.com/delete/' + user,
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    $('#loading').hide(100);
                    this.setCreandoVacante(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            response.data.message,
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    }
                    $('#loading').hide(100);
                }
            }
            this.showAlertOptionsDialog(
                '¿Quiere eliminar al usuario "' + user + '" de manera permanente?',
                'Elimnando usuario',
                'bg-danger',
                'text-white',
                callBack
            )
        },
        updateActivoUser(user, activoUser) {
            const callBack = async () => {
                try {
                    $('#loading').show(100);
                    const response = await axios({
                        method: 'delete',
                        url: 'https://www.anySite.com/delete/' + user,
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    $('#loading').hide(100);
                    this.setCreandoVacante(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            response.data.message,
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al intentar eliminar el usuario',
                            'text-white',
                            'bg-danger'
                        );
                    }
                    $('#loading').hide(100);
                }
            }
            const activoText = activoUser ? 'Inactivo' : 'Activo';
            this.showAlertOptionsDialog(
                '¿Quiere cambiar el estatus de usuario "' + user + '" a ' + activoText + '?',
                'Cambiando estatus usuario',
                'bg-warning',
                'text-white',
                callBack
            )
        },
        parseActivoUser(activo) {
            return activo ? 'Activo' : 'Inactivo'
        },
        setCreandoUser(creandoUser) {
            this.creandoUser = creandoUser
        },
        cleanCampsUser() {
            this.userActual = {
                nombre_user: '',
                apellido_p_user: '',
                apellido_m_user: '',
                direccion_user: '',
                correo_user: '',
                password_user: '',
                password_user_repeat: '',
                tipo_user: 'seleccione',
                activo_user: true,
                access_to_user: [],
            };
        },
        viewUSer(user) {
            this.user_actual = user.correo_user;
            this.userActual = {...user}
            this.userActual.password_user_repeat = '';
            this.creandoUser = 2;
        },
        validateDataUser() {
            if (this.userActual.correo_user.trim() === '') {
                this.showAlertDialog('Campo correo vacio')
                return false;
            }
            if (this.userActual.nombre_user.trim() === '') {
                this.showAlertDialog('Campo Nombre vacio')
                return false;
            }
            if (this.userActual.apellido_p_user.trim() === '') {
                this.showAlertDialog('Campo Apellido Paterno vacio')
                return false;
            }
            if (this.userActual.apellido_m_user.trim() === '') {
                this.showAlertDialog('Campo Apellido Materno vacio')
                return false;
            }
            if (this.userActual.direccion_user.trim() === '') {
                this.showAlertDialog('Campo Direccion vacio')
                return false;
            }
            if (this.statusPassword === 'is-invalid') {
                this.showAlertDialog('Formato de la contraseña incorrecta')
                return false;
            }
            if (this.statusPasswordRepeat === 'is-invalid') {
                this.showAlertDialog('Las contraseñas no coinciden')
                return false;
            }
            if (this.userActual.access_to_user.length === 0) {
                this.showAlertDialog('Se require que le de permisos para al menos una pestaña')
                return false;
            }
            if (this.userActual.tipo_user.trim() === 'seleccione') {
                this.showAlertDialog('Se require que elija el tipo de usuario')
                return false;
            }
            return true;
        },
        async createUser() {
            if (!this.validateDataUser()) return
            const urlApi = '';
            try {
                const response = await axios({
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
        setEditandoPerfil(editandoPerfil) {
            this.editandoPerfil = editandoPerfil;
        },
    },
})
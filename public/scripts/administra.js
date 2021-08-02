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
            listVacantes: {},
            vacante_actual: '',
            vacante: {
                name: '',
                requisitos: '',
                disponible: true,
            },
            creandoVacante: 0,
            // Usuarios
            listUsers: {},
            creandoUser: 0,
            userSelected: '',
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
            perfilUser: JSON.parse(localStorage.getItem("SESSION_USER")),
            correo_user_perfil: (JSON.parse(localStorage.getItem("SESSION_USER"))).correo_user,
            editandoPerfil: false,
            session: localStorage.getItem("SESSION_ADMINISTRACION") == "true",
            timeWait: 0,
        }
    },
    computed: {
        sortListVacantes() {
            const keysVacancysOrder = Object.keys(this.listVacantes).sort();
            return keysVacancysOrder.reduce((vacPrevious, vacancy) => {
                vacPrevious[`${vacancy}`] = this.listVacantes[`${vacancy}`];
                return vacPrevious;
            }, {})
        },
        sortListUsers() {
            const keysUsersOrder = Object.keys(this.listUsers).sort();
            return keysUsersOrder.reduce((userAcum, user) => {
                userAcum[`${user}`] = this.listUsers[`${user}`];
                return userAcum;
            }, {})
        },
        accessToUsers() {
            return this.perfilUser.access_to_user.find((tabUser) => tabUser === 'usuarios')
        },
        accessToVacantes() {
            return this.perfilUser.access_to_user.find((tabUser) => tabUser === 'vacantes')
        },
        isInvited() {
            return this.perfilUser.tipo_user === 'invited';
        },
        isManager() {
            return this.perfilUser.tipo_user === 'manager';
        },
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
            if (this.creandoUser === 2) return 'Editando datos del usuario: ' + this.userSelected;
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
    mounted() {
        this.getDataPerfil();
        //this.session = this.getSession();
        if (!this.session) window.location.href = './login.html';
        this.loadVacantes();
        this.loadUsers();
    },
    methods: {
        async getDataPerfil() {
            try {
                this.loading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/' + this.correo_user_perfil
                })
                
                if (response.data.success) {
                    localStorage.setItem(
                        "SESSION_USER",
                        JSON.stringify(response.data.data)
                    );
                }
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response.data) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al cargar datos del perfil',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al cargar datos del perfil',
                        'text-white',
                        'bg-danger'
                    );
                }
                this.loading(false);
            }
        },
        getDateNow() {
            const date = new Date();
            const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const hora = `${date.getHours()}:${date.getMinutes() + 1}:${date.getSeconds()}:${date.getMilliseconds()}`;
            return fecha + ' ' + hora;
        },
        getSession() {
            if (localStorage.getItem("SESSION_ADMINISTRACION")) {
                this.perfilUser = JSON.parse(localStorage.getItem("SESSION_USER"));
                this.correo_user_perfil = this.perfilUser.correo_user;
                this.loadUsers();
                return localStorage.getItem("SESSION_ADMINISTRACION") == "true"
            }
            return false;
        },
        parseDisponible(disponible) {
            return disponible ? 'Disponible' : 'No disponible'
        },
        getIcon(disponible) {
            return disponible ? 'icofont-toggle-on' : 'icofont-toggle-off'
        },
        getColorButton(disponible) {
            return disponible ? 'btn-success' : 'btn-danger'
        },
        loading(load = false) {
            if (load) {
                this.timeWait ++;
                $('#loading').show(100);
            }
            else {
                this.timeWait --;
                if (this.timeWait <= 0) {
                    $('#loading').hide(100);
                    this.timeWait = 0;
                }
            }
        },
        async loadVacantes() {
            try {
                this.loading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes'
                })
                
                if (response.data.success) {
                    this.listVacantes = response.data.data.listVacantes;
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al cargar las vacantes',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response.data) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al cargar las vacantes',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al cargar las vacantes',
                        'text-white',
                        'bg-danger'
                    );
                }
                this.loading(false);
            }
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
            this.vacante = {
                name: '',
                requisitos: '',
                disponible: true,
            }
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
                    this.loading(true)
                    const response = await axios({
                        method: 'delete',
                        url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes/' + vacante
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                        this.loadVacantes();
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    this.loading(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            error.response.data.message,
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
                    this.loading(false);
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
                    this.loading(true)
                    const response = await axios({
                        method: 'put',
                        url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes/' + Vacante + '/disponible',
                        data: {
                            disponible_vacante: !activoVacante,
                            correo_user: this.correo_user_perfil,
                            modificacion_vacante: this.getDateNow(),
                        }
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
                    
                    this.loading(false);
                    this.loadVacantes();
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            error.response.data.message,
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
                    this.loading(false);
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
            const messageError = (this.creandoVacante === 1) ?
                'Error al intentar crear el puesto' :
                'Error al intentar actualizar el puesto';
            const urlApi = (this.creandoVacante === 1) ?
                'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes':
                'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes/' + this.vacante.name;
            const method = (this.creandoVacante === 1) ? 'post' : 'put';
            try {
                const response = await axios({
                    method,
                    url: urlApi,
                    data: {
                        puesto_vacante: this.vacante.name.trim(),
                        requisitos_vacante: this.vacante.requisitos.trim(),
                        disponible_vacante: this.vacante.disponible,
                        creado_por_vacante: this.correo_user_perfil,
                        alta_vacante: this.getDateNow(),
                        modificado_por_vacante: this.correo_user_perfil,
                        modificacion_vacante: this.getDateNow()
                    }
                })
                
                this.loading(false);
                if (response.data.success) {
                    this.showAlertDialog(
                        response.data.message,
                        messageError,
                        'text-white',
                        'bg-success'
                    );
                    this.loadVacantes();
                    this.setCreandoVacante(0);
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        messageError,
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response.data) {
                    this.showAlertDialog(
                        error.response.data.message,
                        messageError,
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        messageError,
                        'text-white',
                        'bg-danger'
                    );
                }
            }
        },
        // Users
        async loadUsers() {
            try {
                this.loading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios'
                })
                
                if (response.data.success) {
                    this.listUsers = response.data.data;
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al cargar los usuarios',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al cargar los usuarios',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al cargar los usuarios',
                        'text-white',
                        'bg-danger'
                    );
                }
                this.loading(false);
            }
        },
        setNewUsuario() {
            this.creandoUser = 1;
            this.userSelected = '';
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
            }
        },
        deleteUser(user) {
            const callBack = async () => {
                try {
                    this.loading(true)
                    const response = await axios({
                        method: 'delete',
                        url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/' + user
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                        this.loadUsers();
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al intentar eliminar el usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    this.loading(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            error.response.data.message,
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
                    this.loading(false);
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
                    this.loading(true)
                    const response = await axios({
                        method: 'put',
                        url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/' + user + '/activo',
                        data: {
                            activo_user: !activoUser
                        }
                    })
                    
                    if (response.data.success) {
                        this.showAlertDialog(
                            response.data.message,
                            'Exito',
                            'text-white',
                            'bg-success'
                        );
                        this.loadUsers();
                    } else {
                        this.showAlertDialog(
                            response.data.message,
                            'Advertencia al cambiar el estatus del usuario',
                            'text-white',
                            'bg-warning'
                        );
                    }
                    
                    this.loading(false);
                    this.setCreandoVacante(false);
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        this.showAlertDialog(
                            error.response.data.message,
                            ' al cambiar el estatus del usuario',
                            'text-white',
                            'bg-danger'
                        );
                    } else {
                        this.showAlertDialog(
                            'Error inesperado intentelo mas tarde',
                            'Error al cambiar el estatus del usuario',
                            'text-white',
                            'bg-danger'
                        );
                    }
                    this.loading(false);
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
            this.userSelected = user.correo_user;
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
            if (this.creandoUser !== 1) {
                this.updateUser();
                return;
            }
            if (!this.validateDataUser()) return;
            try {
                const response = await axios({
                    method: 'post',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios',
                    data: {
                        nombre_user: this.userActual.nombre_user,
                        apellido_p_user: this.userActual.apellido_p_user,
                        apellido_m_user: this.userActual.apellido_m_user,
                        direccion_user: this.userActual.direccion_user,
                        correo_user: this.userActual.correo_user,
                        password_user: this.userActual.password_user,
                        tipo_user: this.userActual.tipo_user,
                        access_to_user: this.userActual.access_to_user,
                    }
                })
                
                if (response.data.success) {
                    this.showAlertDialog(
                        response.data.message,
                        'Exito al crear el usuario',
                        'text-white',
                        'bg-success'
                    );
                    this.loadUsers();
                    this.setCreandoUser(0);
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al crear al usuario',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al crear al usuario',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al crear al usuario',
                        'text-white',
                        'bg-danger'
                    );
                }
                this.setCreandoVacante(false);
            }
        },
        validateDataUserUpdate() {
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
        async updateUser() {
            if (!this.validateDataUserUpdate()) return;
            try {
                const response = await axios({
                    method: 'put',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/' + this.userSelected,
                    data: {
                        nombre_user: this.userActual.nombre_user,
                        apellido_p_user: this.userActual.apellido_p_user,
                        apellido_m_user: this.userActual.apellido_m_user,
                        direccion_user: this.userActual.direccion_user,
                        correo_user: this.userActual.correo_user,
                        tipo_user: this.userActual.tipo_user,
                        access_to_user: this.userActual.access_to_user,
                        activo_user: this.userActual.activo_user,
                    }
                })
                
                this.loading(false);
                if (response.data.success) {
                    this.showAlertDialog(
                        response.data.message,
                        'Exito al actualizar el usuario',
                        'text-white',
                        'bg-success'
                    );
                    this.setCreandoUser(0);
                    this.loadUsers();
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al actualizar el usuario',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
            } catch (error) {
                console.log(error);
                if (error.response.data) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al actualizar el usuario',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al actualizar el usuario',
                        'text-white',
                        'bg-danger'
                    );
                }
                //this.set
            }
        },
        setEditandoPerfil(editandoPerfil) {
            this.editandoPerfil = editandoPerfil;
        },
        closeSession() {
            localStorage.setItem("SESSION_ADMINISTRACION", "false");
            window.location.href = './login.html'
        },
        validateDataPerfil() {
            if (this.perfilUser.correo_user.trim() === '') {
                this.showAlertDialog('Campo correo vacio')
                return false;
            }
            if (this.perfilUser.nombre_user.trim() === '') {
                this.showAlertDialog('Campo Nombre vacio')
                return false;
            }
            if (this.perfilUser.apellido_p_user.trim() === '') {
                this.showAlertDialog('Campo Apellido Paterno vacio')
                return false;
            }
            if (this.perfilUser.apellido_m_user.trim() === '') {
                this.showAlertDialog('Campo Apellido Materno vacio')
                return false;
            }
            if (this.perfilUser.direccion_user.trim() === '') {
                this.showAlertDialog('Campo Direccion vacio')
                return false;
            }
            return true;
        },
        async updatePerfil() {
            if(!this.validateDataPerfil()) return false;
            try {
                const response = await axios({
                    method: 'put',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/usuarios/' + this.correo_user_perfil,
                    data: {
                        nombre_user: this.perfilUser.nombre_user,
                        apellido_p_user: this.perfilUser.apellido_p_user,
                        apellido_m_user: this.perfilUser.apellido_m_user,
                        direccion_user: this.perfilUser.direccion_user,
                        correo_user: this.perfilUser.correo_user,
                        tipo_user: this.perfilUser.tipo_user,
                        access_to_user: this.perfilUser.access_to_user,
                        activo_user: this.perfilUser.activo_user,
                    }
                })
                
                if (response.data.success) {
                    this.showAlertDialog(
                        response.data.message,
                        'Exito al actualizar el perfil',
                        'text-white',
                        'bg-success'
                    );
                    this.loadUsers();
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al actualizar el perfil',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                this.loading(false);
                this.setEditandoPerfil(false);
            } catch (error) {
                console.log(error);
                if (error.response.data) {
                    this.showAlertDialog(
                        error.response.data.message,
                        'Error al actualizar el perfil',
                        'text-white',
                        'bg-danger'
                    );
                } else {
                    this.showAlertDialog(
                        'Error inesperado intentelo mas tarde',
                        'Error al actualizar el perfil',
                        'text-white',
                        'bg-danger'
                    );
                }
            }
        },
    },
})
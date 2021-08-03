if (!localStorage.getItem("FIREBASE_CONFIG"))
    localStorage.setItem("FIREBASE_CONFIG", "{}");

var appOfertaLaboral = new Vue({
    el: "#app",
    data() {
        return {
            alertDialog: {
                title: 'Advertencia',
                message: 'Mensaje',
                headerColor: 'text-white',
                headerBackground: 'bg-warning',
            },
            listVacantes: {},
            puestoSelected: 'noSelected',
            formVisible: false,
            formPostulacion: {
                name: '',
                ap: '',
                am: '',
                fecha_nace: '',
                phone: '',
                email: '',
                ciudad: '',
                estado: '',
                enteraste_vacante: '',
                otro: '',
                curriculum: {},
                link_curriculum: '',
            },
            vacantes_disponibles: 0,
            firebase_config: JSON.parse(localStorage.getItem("FIREBASE_CONFIG")),
            viewProgressBar: false,
        }
    },
    computed: {
        thereAreVacancy() {
            return this.vacantes_disponibles > 0;
        },
        listRefactorVacante() {
            return Object.keys(this.listVacantes);
        },
        puestoName() {
            if (this.puestoSelected === 'noSelected') return ''
            return this.puestoSelected
        },
        puestoRequisitos() {
            if (this.puestoSelected === 'noSelected') return ''
            return (this.listVacantes[`${this.puestoSelected}`]).requisitos_vacante
        },
        isSelectedOther() {
            return this.formPostulacion.enteraste_vacante === 'Otro'
        },
        nameFile() {
            if (this.formPostulacion.curriculum.name) return this.formPostulacion.curriculum.name
            return 'Elejir archivo'
        },
        iconBtn() {
            if (this.formVisible) return 'icofont-collapse'
            return 'icofont-tasks'
        },
    },
    mounted() {
        $('#loading').hide();
        if (Object.keys(this.firebase_config).length <= 1)
            this.loadFirebaseConfig();
        else
            firebase.initializeApp(this.firebase_config);
        this.loadVacantes();
    },
    methods: {
        showProgress(progress = 0) {
            const bar = document.getElementById("progress-main");
            if (bar != null)
                bar.style.width = `${progress}%`
        },
        showAlertDialog(message = '', title = 'Advertencia', hColor = 'text-white', hBackground = 'bg-warning') {
            this.alertDialog.message = message; 
            this.alertDialog.title = title; 
            this.alertDialog.headerColor = hColor; 
            this.alertDialog.headerBackground = hBackground;
            $('#modalAdministra').modal('show');
        },
        validateData() {
            if (this.puestoSelected.trim() === 'noSelected') {
                this.showAlertDialog('Necesita seleccionar un puesto')
                return false;
            }
            if (this.formPostulacion.name.trim() === '') {
                this.showAlertDialog('Debe ingresar su nombre')
                return false;
            }
            if (this.formPostulacion.ap.trim() === '') {
                this.showAlertDialog('Debe ingresar su apellido paterno')
                return false;
            }
            if (this.formPostulacion.am.trim() === '') {
                this.showAlertDialog('Debe ingresar su apellido materno')
                return false;
            }
            if (this.formPostulacion.fecha_nace.trim() === '') {
                this.showAlertDialog('Debe su fecha de nacimiento')
                return false;
            }
            if (this.formPostulacion.phone.trim() === '') {
                this.showAlertDialog('Debe ingresar su numero de telefono')
                return false;
            }
            if (this.formPostulacion.email.trim() === '') {
                this.showAlertDialog('Debe ingresar su correo electronico')
                return false;
            }
            if (this.formPostulacion.ciudad.trim() === '') {
                this.showAlertDialog('Debe ingresar su ciudad')
                return false;
            }
            if (this.formPostulacion.estado.trim() === '') {
                this.showAlertDialog('Debe ingresar su estado')
                return false;
            }
            if (this.formPostulacion.enteraste_vacante.trim() === '') {
                this.showAlertDialog('Debe seleccionar como se entero del puesto')
                return false;
            }
            if (
                this.formPostulacion.enteraste_vacante.trim() === 'Otro' &&
                this.formPostulacion.otro.trim() === ''
            ) {
                this.showAlertDialog('Debe especificar de que otra manera se entero del puesto')
                return false;
            }
            return true;
        },
        startSend() {
            if (!this.validateData()) return false;
            if (this.formPostulacion.enteraste_vacante.trim() === 'Otro')
                this.formPostulacion.enteraste_vacante = 'Otro: ' + this.formPostulacion.otro;
            if (!this.formPostulacion.curriculum.name) {
                this.formPostulacion.link_curriculum = 'empty'
                this.sendPostulacion();
            } else {
                const date = new Date();
                const nameFile = `Curriculum_${this.formPostulacion.email}_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                this.uploadFiles(this.formPostulacion.curriculum, nameFile);
            }
        },
        async sendPostulacion() {
            try {
                $('#loading').show();
                const response = await axios({
                    method: 'post',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/requestEmpleo',
                    data: {
                        puesto: this.puestoSelected,
                        nombre: this.formPostulacion.name,
                        apellidos: this.formPostulacion.ap + ' ' + this.formPostulacion.am,
                        fecha_nace: this.formPostulacion.fecha_nace,
                        telefono: this.formPostulacion.phone,
                        correo: this.formPostulacion.email,
                        ciudad: this.formPostulacion.ciudad,
                        estado: this.formPostulacion.estado,
                        medio: this.formPostulacion.enteraste_vacante,
                        link_curriculum: this.formPostulacion.link_curriculum
                    }
                })
                
                if (response.data.success) {
                    this.showAlertDialog(
                        response.data.message,
                        'Exito al enviar postulacion',
                        'text-white',
                        'bg-success'
                    );
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al cargar datos para formulario',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                $('#loading').hide();
            } catch (error) {
                console.log(error);
                $('#loading').hide();
                this.showAlertDialog(
                    error.response.data.message,
                    'Advertencia al enviar tu postulacion',
                    'text-white',
                    'bg-warning'
                );
            }
        },
        async loadFirebaseConfig() {
            try {
                $('#loading').show();
                const response = await axios({
                    method: 'get',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/firebaseconfig'
                })
                
                if (response.data.success) {
                    this.firebase_config = response.data.data.firebaseConfig;
                    localStorage.setItem(
                        "FIREBASE_CONFIG",
                        JSON.stringify(this.firebase_config)
                    );
                    firebase.initializeApp(this.firebase_config);
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al cargar datos para formulario',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                $('#loading').hide();
            } catch (error) {
                $('#loading').hide();
            }
        },
        async loadVacantes() {
            try {
                $('#loading').show();
                const response = await axios({
                    method: 'get',
                    url: 'https://us-central1-transportesgalmiche-b4833.cloudfunctions.net/api/v1/vacantes/disponibles'
                })
                
                if (response.data.success) {
                    this.listVacantes = response.data.data.listVacantes;
                    this.vacantes_disponibles = response.data.data.vacantes_disponibles;
                } else {
                    this.showAlertDialog(
                        response.data.message,
                        'Advertencia al cargar las vacantes',
                        'text-white',
                        'bg-warning'
                    );
                }
                
                $('#loading').hide();
            } catch (error) {
                $('#loading').hide();
            }
        },
        async downloadFiles(name = '') {
            const ref = firebase.storage().ref('curriculum/');
            const starsRef = ref.child(name);
            
            try {
                $('#loading').show();
                const url = await starsRef.getDownloadURL();
                this.formPostulacion.link_curriculum = url;
                this.sendPostulacion();
            } catch (error) {
                $('#loading').hide();
                switch (error.code) {
                    case 'storage/object-not-found':
                        console.log("no existe");
                    break;

                    case 'storage/unauthorized':
                        console.log("no tienes autorizacion");
                    break;

                    case 'storage/canceled':
                        console.log("usuario cancelo la descarga");
                    break;

                    case 'storage/unknown':
                        console.log("error desconocido");
                    break;
                }
            }
        },
        uploadFiles(file, name) {
            $('#loading').show();
            const that = this;
            that.viewProgressBar = true;
            const storageRef = firebase.storage().ref('curriculum/' + name);

            const task = storageRef.put(file);
            task.on('state_changed',
                function progress(snapshot) {
                    const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    that.showProgress(parseInt(percentage));
                },

                function error(err) {
                    that.viewProgressBar = false;
                    console.log(err);
                    $('#loading').hide();
                    that.showAlertDialog(
                        'No se puedo enviar el curriculum, intentelo mas tarde',
                        'Error al enviar el corriculum',
                        'text-white',
                        'bg-warning'
                    );
                },

                function complete() {
                    that.viewProgressBar = false;
                    $('#loading').hide();
                    that.downloadFiles(name);
                }
            );
        },
        onFileSelected (event) {
            const file = event.target.files[0];
            if (!file) return false;
            this.formPostulacion.curriculum = file;
        },
    },
});

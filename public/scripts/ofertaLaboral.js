var appOfertaLaboral = new Vue({
    el: "#app",
    data() {
        return {
            listVacantes: {
                "Chofer de torton": {
                    alta_vacante: "28/04/2021 11:01:425",
                    creado_por_vacante: "aleflo_1996@outlook.com",
                    disponible_vacante: true,
                    modificacion_vacante: "28/04/2021 11:01:425",
                    modificado_por_vacante: "aleflo_1996@outlook.com",
                    puesto_vacante: "Chofer de torton",
                    requisitos_vacante: "Experiencia en en manejo de torton Trato con clientes Edad de 25 a 40 años"
                },
                "Chofer de Trailer": {
                    alta_vacante: "28/04/2021 11:34:425",
                    creado_por_vacante: "aleflo_1996@outlook.com",
                    disponible_vacante: true,
                    modificacion_vacante: "28/04/2021 11:34:425",
                    modificado_por_vacante: "aleflo_1996@outlook.com",
                    puesto_vacante: "Chofer de Trailer",
                    requisitos_vacante: "Experiencia en en manejo de torton Trato con clientes Edad de 25 a 40 años"
                }
            },
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
            },
            vacantes_disponibles: 0,
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
        // Inicializa firebase
        // const firebaseConfig = this.userDataBase.data.firebaseConfig;
        // firebase.initializeApp(firebaseConfig);
        this.loadVacantes();
    },
    methods: {
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
                console.log(error);
                $('#loading').hide();
            }
        },
        uploadFiles(id_noticia = '/', source = 'images', file) {
            this.showLoading();
            const that = this;
            const storageRef = firebase.storage().ref(id_noticia + '/' + source + '/' + file.name);

            const task = storageRef.put(file);
            task.on('state_changed',
                function progress(snapshot) {
                    const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },

                function error(err) {
                    console.log(err);
                    that.hideLoading();
                },

                function complete() {
                    console.log('Transferencia completada ' + file.name);
                    that.hideLoading();
                }
            );
        },
        onFileSelected (event) {
            const file = event.target.files[0];
            if (!file) return
            this.formPostulacion.curriculum = file;
            console.log(file);
        },
    },
});

if (!localStorage.getItem('POSITION_ACTUAL'))
    localStorage.setItem('POSITION_ACTUAL', '1')

var servicioApp = new Vue({
    el: "#appServicio",
    data() {
        return {
            POSITION_VERTICAL: 0,
            POSITION_HORIZONTAL: 1,
            positionImage: -1,
            positionActual: parseInt(localStorage.getItem('POSITION_ACTUAL')),
            newPosition: -1,
            actualImage: '1/21',
            imageActual: '',
            urlActual: '',
            visibleImage: false,
            listTorton: [
                'torton (1).jpeg',
                'torton (2).jpeg',
                'torton (3).jpeg',
                'torton (4).jpeg',
                'torton (5).jpeg',
                'torton (6).jpeg',
                'torton (7).jpeg',
                'torton (8).jpeg',
                'torton (9).jpeg',
                'torton (10).jpeg',
                'torton (11).jpeg',
                'torton (12).jpeg'
            ],
            listAuto: [
                'auto (1).jpeg',
                'auto (2).jpeg',
                'auto (3).jpeg',
                'auto (4).jpeg'
            ],
            listCamioneta1: [
                'camioneta1ton (1).jpeg',
                'camioneta1ton (2).jpeg',
                'camioneta1ton (3).jpeg',
                'camioneta1ton (4).jpeg',
                'camioneta1ton (5).jpeg',
            ],
            listImages: [],
        }
    },
    computed: {
        verticalSelected() {
            if (this.positionActual === this.POSITION_VERTICAL) return 'btn-primary'
            return '';
        },
        horizontalSelected() {
            if (this.positionActual === this.POSITION_HORIZONTAL) return 'btn-primary'
            return '';
        },
        orientation() {
            if (this.positionActual === this.POSITION_HORIZONTAL) return 'orientationHorizontal'
            return 'orientationVertical';
        },
    },
    mounted() {
        console.log(this.positionActual);
    },
    methods: {
        getUrl(image = '') {
            return './images/gallery/' + image;
        },
        rightImage() {
            this.positionImage = this.getPostionImageActual();
            if (this.positionImage < this.listImages.length - 1) this.newPosition = this.positionImage + 1;
            else this.newPosition = 0;
            this.setImage(this.listImages[this.newPosition]);
        },
        leftImage() {
            this.positionImage = this.getPostionImageActual();
            if (this.positionImage > 0) this.newPosition = this.positionImage - 1;
            else this.newPosition = this.listImages.length - 1;
            this.setImage(this.listImages[this.newPosition]);
        },
        changeOrientation(positon = -1) {
            this.positionActual = positon;
            localStorage.setItem('POSITION_ACTUAL', this.positionActual.toString());
        },
        openViewImage() {
            this.visibleImage = !this.visibleImage;
        },
        closeViewImage() {
            this.visibleImage = false;
        },
        setImage(src) {
            this.urlActual = '../images/gallery/' + src;
            this.imageActual = src;
            this.positionImage = this.getPostionImageActual();
            this.actualImage = (this.positionImage + 1) + '/' + this.listImages.length;
        },
        viewImage(listImages) {
            this.listImages = listImages;
            this.setImage(listImages[0]);
            this.openViewImage();
        },
        getPostionImageActual() {
            return this.listImages.findIndex((image) => image === this.imageActual)
        }
    },
});
var servicioApp = new Vue({
    el: "#appServicio",
    data() {
        return {
            positionImage: -1,
            newPosition: -1,
            actualImage: '1/21',
            imageActual: '',
            urlActual: '',
            listTorton: [
                'torton1.jpg',
                'torton2.jpg',
                'torton3.jpg',
                'torton4.jpg',
                'torton5.jpg',
                'torton6.jpg',
                'torton7.jpg',
                'torton8.jpg',
                'torton9.jpg',
                'torton10.jpg',
                'torton11.jpg'
            ],
            listAuto: [
                'auto1.jpg',
                'auto2.jpg',
                'auto3.jpg',
                'auto4.jpg'
            ],
            listCamioneta1: [
                'camioneta1.jpg',
                'camioneta2.jpg',
                'camioneta3.jpg',
                'camioneta4.jpg',
                'camioneta5.jpg',
            ],
            listImages: [],
        }
    },
    mounted() {
        const that = this;
        window.addEventListener('resize', function(evt) {
            that.setMarginImage();
        })
    },
    methods: {
        setMarginImage() {
            const image = document.getElementById('img-view-gallery');
            const container = document.getElementById('continer-gallery');
            const positionImage = document.getElementById('positionImage');
            if (image && container) {
                const left = (container.clientWidth - positionImage.clientWidth) / 2;
                const marginTopContainer = (window.innerHeight - container.clientHeight) / 2;
                const marginTop = (container.clientHeight - image.clientHeight) / 2;
                image.style.marginTop = parseInt(marginTop) + 'px';
                container.style.marginTop = parseInt(marginTopContainer) + 'px';
                positionImage.style.left = left + 'px';
            }
        },
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
        openViewImage() {
            const that = this;
            $('#galleryAll').fadeIn(500, that.setMarginImage)
        },
        closeViewImage() {
            $('#galleryAll').fadeOut(400)
        },
        setImage(src, from = 'change') {
            if (from === 'change') {
                const imageView = document.getElementById('img-view-gallery');
                imageView.style.opacity = "0";
                setTimeout(() => {
                    this.urlActual = '../images/gallery/' + src;
                    this.imageActual = src;
                    imageView.style.opacity = "1";
                    this.positionImage = this.getPostionImageActual();
                    this.actualImage = (this.positionImage + 1) + '/' + this.listImages.length;
                }, 500);
            } else {
                this.urlActual = '../images/gallery/' + src;
                this.imageActual = src;
                this.positionImage = this.getPostionImageActual();
                this.actualImage = (this.positionImage + 1) + '/' + this.listImages.length;
            }
        },
        viewImage(listImages) {
            this.listImages = listImages;
            this.setImage(listImages[0], 'init');
            this.openViewImage();
        },
        getPostionImageActual() {
            return this.listImages.findIndex((image) => image === this.imageActual)
        }
    },
});
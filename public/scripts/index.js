$(document).ready(function() {
    const POSITION_VERTICAL = 0;
    const POSITION_HORIZONTAL = 1;
    let positionImage = -1;
    let positionActual = -1;
    let newPosition = -1;
    let startNameImage = '';
    let visibleImage = false;
    let itemImageView = null;
    let itemImage = null;
    let btnVertical = null;
    let btnHorizontal = null;
    let imageView = null;
    let btnClose = null;
    let btnArrowLeft = null;
    let btnArrowRight = null;
    let countImages = null;
    let listImages = [
        'gallery (1).jpeg',
        'gallery (2).jpeg',
        'gallery (3).jpeg',
        'gallery (4).jpeg',
        'gallery (5).jpeg',
        'gallery (6).jpeg',
        'gallery (7).jpeg',
        'gallery (8).jpeg',
        'gallery (9).jpeg',
        'gallery (10).jpeg',
        'gallery (11).jpeg',
        'gallery (12).jpeg',
        'gallery (13).jpeg',
        'gallery (14).jpeg',
        'gallery (15).jpeg',
        'gallery (16).jpeg',
        'gallery (17).jpeg',
        'gallery (18).jpeg',
        'gallery (19).jpeg',
        'gallery (20).jpeg',
        'gallery (21).jpeg',
    ];

    const initCarrucel = () => {
        $('#loading').hide();
        $('.carousel').carousel({
            interval: 10000
        });
    }

    const loadLocalStorage = () => {
        if (!localStorage.getItem('POSITION_ACTUAL'))
            localStorage.setItem('POSITION_ACTUAL', '1')
        positionActual = parseInt(localStorage.getItem('POSITION_ACTUAL'));
        
    }

    const initComponents = () => {
        itemImage = document.querySelectorAll('.item-gallery');
        for (let x = 0; x < itemImage.length; x++) {
            itemImage[x].addEventListener("click", () => { viewImage(itemImage[x].src) });
        }

        imageView = document.getElementById('background-view-gallery');
        itemImageView = document.getElementById('item-view-gallery');
        btnVertical = document.querySelector('#btnPositionV');
        btnVertical.addEventListener('click', () => {changeOrientation(POSITION_VERTICAL)});
        btnHorizontal = document.querySelector('#btnPositionH');
        btnHorizontal.addEventListener('click', () => {changeOrientation(POSITION_HORIZONTAL)});
        btnClose = document.getElementById('btnClose');
        btnClose.addEventListener('click', toggleViewImage);
        btnArrowLeft = document.querySelector('.left');
        btnArrowLeft.addEventListener('click', leftImage);
        btnArrowRight = document.querySelector('.right');
        btnArrowRight.addEventListener('click', rightImage);
        countImages = document.querySelector('.positionImage');
    }

    const setPositionAndStartImage = () => {
        const imageToFind = (itemImageView.src).split('/');
        positionImage = listImages.findIndex((image) => image === imageToFind[imageToFind.length - 1].replace('%20', ' '));
        startNameImage = '';
        for (let index = 0; index < imageToFind.length - 1; index++)
            startNameImage += imageToFind[index] + '/';
    }

    const leftImage = () => {
        setPositionAndStartImage();
        if (positionImage > 0) newPosition = positionImage - 1
        else newPosition = listImages.length - 1
        itemImageView.src = startNameImage + listImages[newPosition];
        countImages.innerHTML = (newPosition + 1) + '/' + listImages.length;
    }
    
    const rightImage = () => {
        setPositionAndStartImage();
        if (positionImage < listImages.length - 1) newPosition = positionImage + 1;
        else newPosition = 0;
        itemImageView.src = startNameImage + listImages[newPosition];
        countImages.innerHTML = (newPosition + 1) + '/' + listImages.length;
    }

    const changeOrientation = (positon = -1) => {
        positionActual = positon;
        localStorage.setItem('POSITION_ACTUAL', positionActual.toString());
        itemImageView.style.width = 'auto'
        itemImageView.style.height = 'auto'
        btnHorizontal.classList.remove('btn-primary');
        btnVertical.classList.remove('btn-primary');
        if (positon === POSITION_HORIZONTAL) {
            btnHorizontal.classList.add('btn-primary');
            itemImageView.style.width = '100%'
        }
        else {
            itemImageView.style.height = '100%'
            btnVertical.classList.add('btn-primary');
        }
    }

    const toggleViewImage = () => {
        if (visibleImage)
            imageView.style.visibility = 'hidden'
        else {
            imageView.style.visibility = 'visible'
            setPositionAndStartImage();
            countImages.innerHTML = (positionImage + 1) + '/' + listImages.length;
        }
        visibleImage = !visibleImage;
    }

    const viewImage = (src) => {
        itemImageView.src = src;
        toggleViewImage();
    }

    (() => {
        loadLocalStorage();
        initCarrucel();
        initComponents();
        changeOrientation(positionActual);
    })();
});
window.addEventListener('load', function() {
    const btnUp = document.querySelector('.btnup');

    btnUp.addEventListener('click', function() {
        // window.scrollTo(0, 0);
        $('body,html').animate({ scrollTop:'0px' },500);
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= 450) {
            $('.btnup').show(500);
        } else {
            $('.btnup').hide(500);
        }
    })
});

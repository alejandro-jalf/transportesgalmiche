$('.carousel').carousel({
    interval: 10000
});

const btnUp = document.querySelector('.btnup');

btnUp.addEventListener('click', function() {
    window.scrollTo(0, 0);
    // $('body,html').animate({ scrollTop:'0px' },1000);
});
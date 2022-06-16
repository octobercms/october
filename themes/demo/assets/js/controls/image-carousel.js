$(document).on('render', function() {
    $('[data-control="image-carousel"]').each(function () {
        var carousel = this;

        $(this).slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        setTimeout(function () {
            var links = $('.slick-slide a', carousel);
            links.each(function () {
                var image = new Image(),
                    link = this;

                image.src = this.getAttribute('href');
                image.onload = function () {
                    link.setAttribute('data-pswp-width', image.naturalWidth);
                    link.setAttribute('data-pswp-height', image.naturalHeight);
                };
            });
        }, 1);

        var lightbox = new PhotoSwipeLightbox({
            gallery: this,
            children: '.slick-slide',
            pswpModule: PhotoSwipeModule,
            showHideAnimationType: 'none'
        });

        new PhotoSwipeDynamicCaption(lightbox, {
            type: 'auto'
        });

        lightbox.init();
    });
});

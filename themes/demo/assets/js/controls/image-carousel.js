
oc.registerControl('image-carousel', class extends oc.ControlBase {
    connect() {
        this.$el = $(this.element);
        this.connectSlick();
        this.connectLightbox();

        setTimeout(() => {
            this.prepareLightbox();
        }, 1);
    }

    disconnect() {
        if (this.lightbox) {
            this.lightbox.destroy();
            this.lightbox = null;
        }

        this.$el.slick('unslick');
        this.$el = null;
    }

    connectSlick() {
        this.$el.slick({
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
    }

    connectLightbox() {
        this.lightbox = new PhotoSwipeLightbox({
            gallery: this.element,
            children: '.slick-slide',
            pswpModule: PhotoSwipeModule,
            showHideAnimationType: 'none'
        });

        new PhotoSwipeDynamicCaption(this.lightbox, {
            type: 'auto'
        });

        this.lightbox.init();
    }

    prepareLightbox() {
        $('.slick-slide a', this.$el).each(function () {
            var image = new Image(),
                link = this;

            image.src = this.getAttribute('href');
            image.onload = function () {
                link.setAttribute('data-pswp-width', image.naturalWidth);
                link.setAttribute('data-pswp-height', image.naturalHeight);
            };
        });
    }
});

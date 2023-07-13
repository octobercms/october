oc.registerControl('team-leaders', class extends oc.ControlBase {
    connect() {
        this.$el = $(this.element);
        this.connectSlick();
    }

    disconnect() {
        this.$el.slick('unslick');
        this.$el = null;
    }

    connectSlick() {
        this.$el.slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
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
});

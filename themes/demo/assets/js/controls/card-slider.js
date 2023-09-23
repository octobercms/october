;(function(){

    oc.registerControl('card-slider', class extends oc.ControlBase {
        init() {
            this.$el = $(this.element);
            this.sliderType = this.config.sliderType || 'hero';
            this.element.classList.add('type-' + this.sliderType);
        }

        connect() {
            this.connectSlick();
        }

        disconnect() {
            this.$el.slick('unslick');
            this.$el = null;
        }

        connectSlick() {
            this.$el.slick(this.getSlickOptions());
        }

        getSlickOptions() {
            if (this.sliderType === 'hero') {
                return this.getHeroTypeOptions();
            }

            if (this.sliderType === 'team') {
                return this.getTeamTypeOptions();
            }

            if (this.sliderType === 'category') {
                return this.getCategoryTypeOptions();
            }

            return {};
        }

        getHeroTypeOptions() {
            return {
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                dots: true,
                arrows: false,
            };
        }

        getTeamTypeOptions() {
            return {
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
            };
        }

        getCategoryTypeOptions() {
            return {
                dots: false,
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                autoplay: true,
                arrows: true,
                prevArrow: '<span class="slick-prev"><i class="bi bi-chevron-left"></i></span>',
                nextArrow: '<span class="slick-next"><i class="bi bi-chevron-right"></i></span>',
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
                    {
                        breakpoint: 820,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }
                ]
            };
        }
    });

})();

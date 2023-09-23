;(function(){

    oc.registerControl('quantity-input', class extends oc.ControlBase {
        connect() {
            this.$qty = this.element.querySelector('input.quantity-field');
            this.listen('click', '.button-plus', this.onIncrementValue);
            this.listen('click', '.button-minus', this.onDecrementValue);
        }

        disconnect() {
            this.$qty = null;
        }

        onIncrementValue(ev) {
            ev.preventDefault();
            var value = parseInt(this.$qty.value, 10);
            if (isNaN(value)) {
                value = 0;
            }

            this.$qty.value = Math.max(++value, 0);
        }

        onDecrementValue(ev) {
            ev.preventDefault();
            var value = parseInt(this.$qty.value, 10);
            if (isNaN(value)) {
                value = 0;
            }

            this.$qty.value = Math.max(--value, 0);
        }

    });

})();

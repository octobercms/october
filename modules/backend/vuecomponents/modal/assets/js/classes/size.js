import modalPosition from './position.js';

/*
 * Modal size helper
 */
export class ModalSize {
    #lastPoint = { x: 0, y: 0 };
    #$content = null;
    #size = {};
    #offset = {};
    #mouseUpCallback = null;
    #side = null;
    #resizeMinWidth = 0;
    #resizeMinHeight = 0;

    #clear() {
        this.#$content = null;
        this.#size = {};
        this.#offset = {};
        this.#mouseUpCallback = null;
    }

    #initSizeObj() {
        if (!this.#size.width) {
            this.#size.width = this.#$content.outerWidth();
            this.#size.height = this.#$content.outerHeight();
        }
    }

    #getDragClassName() {
        if (this.#side == 'bt' || this.#side == 'tp') {
            return 'modal-dragging-ns';
        }

        if (this.#side == 'lf' || this.#side == 'rt') {
            return 'modal-dragging-ew';
        }

        if (this.#side == 'bt-lf' || this.#side == 'tp-rt') {
            return 'modal-dragging-nesw';
        }

        if (this.#side == 'tp-lf' || this.#side == 'bt-rt') {
            return 'modal-dragging-nwse';
        }
    }

    #onMouseUp = (ev) => {
        document.removeEventListener('mousemove', this.#onMouseMove, { passive: true });
        document.removeEventListener('mouseup', this.#onMouseUp);
        $(document.body).removeClass('modal-dragging ' + this.#getDragClassName());

        modalPosition.fixPosition(this.#$content, true, this.#offset);

        Vue.nextTick(this.#mouseUpCallback);

        this.#clear();
    };

    #updateLf(deltaX) {
        var sizeDelta = this.#size.width - Math.max(this.#resizeMinWidth, this.#size.width - deltaX);
        if (sizeDelta != 0) {
            this.#offset.left += sizeDelta;
            this.#size.width -= sizeDelta;
        }
    }

    #updateTp(deltaY) {
        var sizeDelta = this.#size.height - Math.max(this.#resizeMinHeight, this.#size.height - deltaY);
        if (sizeDelta != 0) {
            this.#offset.top += sizeDelta;
            this.#size.height -= sizeDelta;
        }
    }

    #onMouseMove = (ev) => {
        if (ev.buttons != 1) {
            // Handle the case when the button was released
            // outside of the viewport. mouseup doesn't fire
            // in that case.
            //
            this.#onMouseUp();
        }

        this.#initSizeObj();

        var deltaX = ev.pageX - this.#lastPoint.x,
            deltaY = ev.pageY - this.#lastPoint.y,
            prevHeight = this.#size.height,
            prevWidth = this.#size.width;

        switch (this.#side) {
            case 'bt':
                this.#size.height += deltaY;
                break;
            case 'rt':
                this.#size.width += deltaX;
                break;
            case 'bt-rt':
                this.#size.height += deltaY;
                this.#size.width += deltaX;
                break;
            case 'tp-lf':
                this.#updateTp(deltaY);
                this.#updateLf(deltaX);
                break;
            case 'bt-lf':
                this.#size.height += deltaY;
                this.#updateLf(deltaX);
                break;
            case 'tp-rt':
                this.#size.width += deltaX;
                this.#updateTp(deltaY);
                break;
            case 'tp':
                this.#updateTp(deltaY);
                break;
            case 'lf':
                this.#updateLf(deltaX);
                break;
        }

        this.#size.height = Math.max(this.#resizeMinHeight, this.#size.height);
        this.#size.width = Math.max(this.#resizeMinWidth, this.#size.width);

        if (prevHeight != this.#size.height) {
            this.#lastPoint.y = ev.pageY;
        }

        if (prevWidth != this.#size.width) {
            this.#lastPoint.x = ev.pageX;
        }
    };

    onMouseDown(ev, contentObj, sizeObj, offsetObj, mouseUp, minWidth, minHeight) {
        this.#side = ev.target.getAttribute('data-side');
        this.#$content = $(contentObj);
        this.#size = sizeObj;
        this.#offset = offsetObj;
        this.#mouseUpCallback = mouseUp;

        this.#resizeMinWidth = minWidth;
        this.#resizeMinHeight = minHeight;

        $(document.body).addClass('modal-dragging ' + this.#getDragClassName());
        document.addEventListener('mousemove', this.#onMouseMove, { passive: true });
        document.addEventListener('mouseup', this.#onMouseUp);

        this.#lastPoint.x = ev.pageX;
        this.#lastPoint.y = ev.pageY;

        ev.preventDefault();
        ev.stopPropagation();
    }

    onMouseUp() {
        this.#onMouseUp();
    }
}

export const modalSize = new ModalSize();
export default modalSize;

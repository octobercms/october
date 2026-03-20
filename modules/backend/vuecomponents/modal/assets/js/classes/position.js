/*
 * Modal position helper
 */
export class ModalPosition {
    #lastPoint = { x: 0, y: 0 };
    #$content = null;
    #offset = {};
    #mouseUpCallback = null;

    #clear() {
        this.#$content = null;
        this.#offset = {};
        this.#mouseUpCallback = null;
    }

    #onMouseUp = (ev) => {
        document.removeEventListener('mousemove', this.#onMouseMove, { passive: true });
        document.removeEventListener('mouseup', this.#onMouseUp);

        $(document.body).removeClass('modal-dragging');

        this.fixPosition(this.#$content, true, this.#offset);

        this.#mouseUpCallback();

        this.#clear();
    };

    #onMouseMove = (ev) => {
        if (ev.buttons != 1) {
            // Handle the case when the button was released
            // outside of the viewport. mouseup doesn't fire
            // in that case.
            //
            this.#onMouseUp();
        }

        var deltaX = ev.pageX - this.#lastPoint.x,
            deltaY = ev.pageY - this.#lastPoint.y;

        this.#lastPoint.x = ev.pageX;
        this.#lastPoint.y = ev.pageY;

        this.#offset.left += deltaX;
        this.#offset.top += deltaY;
    };

    fixPosition($contentElement, animate, offsetObj) {
        var contentOffset = $contentElement.offset();

        contentOffset.top -= window.scrollY;

        var contentWidth = $contentElement.width(),
            contentHeight = $contentElement.height(),
            contentRight = contentOffset.left + contentWidth,
            contentBottom = contentOffset.top + contentHeight,
            documentWidth = $(document).width(),
            documentHeight = $(document).height();

        if (
            animate &&
            (contentOffset.left < 10 ||
                contentOffset.top < 10 ||
                contentRight > documentWidth - 10 ||
                contentBottom > documentHeight - 10)
        ) {
            $contentElement.addClass('animate-position');
        }

        if (contentOffset.left < 10) {
            offsetObj.left -= contentOffset.left - 10;
        }

        if (contentOffset.top < 10) {
            offsetObj.top -= contentOffset.top - 10;
        }

        if (contentRight > documentWidth - 10) {
            offsetObj.left -= contentRight - documentWidth + 10;
        }

        if (contentBottom > documentHeight - 10) {
            var delta = contentBottom - documentHeight + 10;
            offsetObj.top -= delta;

            contentOffset.top -= delta;
            if (contentOffset.top < 10) {
                offsetObj.top -= contentOffset.top - 10;
            }
        }
    }

    getInitialOffset(isModal) {
        var count = $.oc.modalFocusManager.getNumberOfType('modal');

        if (isModal) {
            return count * 20;
        }

        return 150 + count * 20;
    }

    applyConstraint(value, min, max) {
        value = Math.max(value, min);
        value = Math.min(value, max);

        return value;
    }

    onMouseDown(ev, content, offsetObj, mouseUp) {
        if (ev.target.tagName === 'BUTTON' || ev.target.tagName === 'A') {
            return;
        }

        this.#$content = $(content);
        this.#offset = offsetObj;
        this.#mouseUpCallback = mouseUp;

        $(document.body).addClass('modal-dragging');
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

export const modalPosition = new ModalPosition();
export default modalPosition;

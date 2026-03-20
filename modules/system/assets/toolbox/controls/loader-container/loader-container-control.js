/*
 * Loader Container
 */
import { ControlBase } from 'larajax';

export default class LoaderContainerControl extends ControlBase
{
    init() {
        this.element.classList.add('control-loader-container');
    }

    connect() {
        this.loaderMask = document.createElement('div');
        this.loaderMask.classList.add('loader-mask');

        this.listen('ajax:promise', this.showLoader);
        this.listen('ajax:fail', this.hideLoader);
        this.listen('ajax:done', this.hideLoader);
    }

    disconnect() {
        this.hideLoader(null, true);
        this.loaderMask = null;
    }

    showLoader() {
        this.element.classList.add('is-loading');
        this.element.appendChild(this.loaderMask);
    }

    hideLoader() {
        this.element.classList.remove('is-loading');

        if (this.loaderMask && this.element.contains(this.loaderMask)) {
            this.element.removeChild(this.loaderMask);
        }
    }
}

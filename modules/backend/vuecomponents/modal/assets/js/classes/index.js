import modalPosition, { ModalPosition } from './position.js';
import modalSize, { ModalSize } from './size.js';
import modalUtils, { ModalUtils } from './utils.js';

// Register globals for backwards compatibility with non-ESM scripts
if (oc.vueComponentHelpers === undefined) {
    oc.vueComponentHelpers = {};
}

oc.vueComponentHelpers.modalPosition = modalPosition;
oc.vueComponentHelpers.modalSize = modalSize;
oc.vueComponentHelpers.modalUtils = modalUtils;

export {
    modalPosition,
    ModalPosition,
    modalSize,
    ModalSize,
    modalUtils,
    ModalUtils
};

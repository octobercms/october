/**
 * Larajax ESM Wrapper
 *
 * Re-exports framework globals for use with ES module imports.
 * The framework-bundle.js must be loaded first as a regular script.
 */

// Individual class exports
export const ControlBase = oc.ControlBase;
export const AjaxRequest = oc.AjaxRequest;
export const AssetManager = oc.AssetManager;
export const ProgressBar = oc.ProgressBar;
export const FlashMessage = oc.FlashMessage;
export const Events = oc.Events;

// Utility exports
export const waitFor = oc.waitFor;
export const domReady = oc.domReady;
export const registerControl = oc.registerControl;

// Namespace exports
export const AjaxFramework = oc.AjaxFramework;
export const AjaxExtras = oc.AjaxExtras;
export const AjaxObserve = oc.AjaxObserve;
export const AjaxTurbo = oc.AjaxTurbo;

// Combined jax object
export const jax = window.jax;

// Default export - the oc namespace
export default oc;

/**
 * October CMS Vendor Loader
 * Imports vendor libraries via native ESM.
 */

// ESM (bundled with esbuild)
import * as Vue from 'vue';
window.Vue = Vue;

import * as VueRouter from '../vendor/vue-router/vue-router.esm.js';
window.VueRouter = VueRouter;

import mitt from '../vendor/mitt/mitt.esm.js';
window.mitt = mitt;

import * as bootstrap from '../vendor/bootstrap/bootstrap.esm.js';
window.bootstrap = bootstrap;

import Cookies from '../vendor/js-cookie/js.cookie.esm.js';
window.Cookies = Cookies;

import Sortable from '../vendor/sortablejs/sortable.esm.js';
window.Sortable = Sortable;

import Dropzone from '../vendor/dropzone/dropzone.esm.js';
window.Dropzone = Dropzone;
Dropzone.autoDiscover = false;

import Chart from '../vendor/chartjs/chart.esm.js';
window.Chart = Chart;
import '../vendor/chartjs/chartjs-adapter-moment.esm.js';

// UMD (manually maintained - depend on globals from vendor.js)
import '../vendor/froala/froala.js';
import '../vendor/handsontable/handsontable.js';

// Vue plugins and configuration
import './vue.hotkey.js';
import './vue.factory.js';

// Toolbox
import '../toolbox/toolbox.js'

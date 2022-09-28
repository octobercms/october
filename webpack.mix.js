const mix = require('laravel-mix');
const webpackConfig = require('./webpack.config');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your theme assets. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .webpackConfig(webpackConfig)
    .options({
        processCssUrls: false,
        manifest: false,
        terser: {
            terserOptions: {
                mangle: false,
                compress: true,
                output: {
                    comments: false
                }
            },
        },
    })
    .setPublicPath('')
;

// Vendor Mixes
mix
    .copy('node_modules/jquery/dist/jquery.min.js', 'modules/system/assets/js/vendor/jquery.min.js')
    .copy('node_modules/vue-router/dist/vue-router.min.js', 'modules/system/assets/vendor/vue-router/vue.min.js')
    .copy('node_modules/bluebird/js/browser/bluebird.min.js', 'modules/system/assets/vendor/bluebird/bluebird.min.js')
    .copy('node_modules/sortablejs/Sortable.min.js', 'modules/backend/assets/vendor/sortablejs/sortable.js')
    .copy('node_modules/dropzone/dist/dropzone-min.js', 'modules/backend/assets/vendor/dropzone/dropzone.js')
    .copy('node_modules/js-cookie/dist/js.cookie.js', 'modules/backend/assets/vendor/js-cookie/js.cookie.js')
;

// Vue dev tools
if (!mix.inProduction()) {
    mix.copy('node_modules/vue/dist/vue.js', 'modules/system/assets/vendor/vue/vue.min.js');
}
else {
    mix.copy('node_modules/vue/dist/vue.min.js', 'modules/system/assets/vendor/vue/vue.min.js');
}

// Boostrap Mixes
mix
    .js('modules/backend/assets/vendor/bootstrap/bootstrap.js', 'modules/backend/assets/vendor/bootstrap/bootstrap.min.js')
    .sass('modules/backend/assets/vendor/bootstrap/bootstrap.scss', 'modules/backend/assets/vendor/bootstrap/bootstrap.css')
    .sass('modules/backend/assets/vendor/bootstrap/bootstrap-lite.scss', 'modules/backend/assets/vendor/bootstrap/bootstrap-lite.css')
    .sass('modules/backend/assets/vendor/bootstrap-icons/bootstrap-icons.scss', 'modules/backend/assets/vendor/bootstrap-icons/bootstrap-icons.css')
    .copy('node_modules/bootstrap-icons/font/fonts/', 'modules/backend/assets/vendor/bootstrap-icons/fonts/')
;

// Core Mixes
require('./webpack.helpers')(mix);
require('./modules/system/system.mix')(mix);
require('./modules/backend/backend.mix')(mix);
require('./modules/editor/editor.mix')(mix);
require('./modules/media/media.mix')(mix);
require('./modules/tailor/tailor.mix')(mix);
require('./modules/cms/cms.mix')(mix);

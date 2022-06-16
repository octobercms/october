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

mix.webpackConfig(webpackConfig)
    .options({ processCssUrls: false })
    .copy('node_modules/jquery/dist/jquery.min.js', 'assets/vendor/jquery.min.js')
    .js('assets/vendor/codeblocks/codeblocks.js', 'assets/vendor/codeblocks/codeblocks.min.js')
    .js('assets/vendor/bootstrap/bootstrap.js', 'assets/vendor/bootstrap/bootstrap.min.js')
    .sass('assets/vendor/bootstrap/bootstrap.scss', 'assets/vendor/bootstrap/bootstrap.css')
    .sass('assets/vendor/bootstrap-icons/bootstrap-icons.scss', 'assets/vendor/bootstrap-icons/bootstrap-icons.css')
    .copy('node_modules/bootstrap-icons/font/fonts/', 'assets/vendor/bootstrap-icons/fonts/')
    .copy('node_modules/slick-carousel/slick', 'assets/vendor/slick-carousel/')
    .copy('node_modules/photoswipe/dist/photoswipe.css', 'assets/vendor/photoswipe/photoswipe.css')
    .copy('node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js', 'assets/vendor/photoswipe/photoswipe-lightbox.esm.min.js')
    .copy('node_modules/photoswipe/dist/photoswipe.esm.min.js', 'assets/vendor/photoswipe/photoswipe.esm.min.js')
    .copy('node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js', 'assets/vendor/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js')
    .copy('node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css', 'assets/vendor/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css')
;

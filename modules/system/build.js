/**
 * October CMS Vendor Build Script
 *
 * - Bundles ESM packages with esbuild (resolves bare imports)
 * - Compiles SCSS/LESS with sass/less (for customized Bootstrap, Froala)
 * - Copies UMD packages directly (already browser-ready)
 */
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import {
    copy,
    concat,
    copyDir,
    bundle,
    bundleVueComponent,
    script,
    compileSass,
    compileLess,
    rootDir,
    vendorDir
} from './build-util.js';

console.log('\n  Building vendor files...\n');

// Vendor bundle - concatenate UMD scripts (they use `this` which doesn't work in ES modules)
concat([
    'jquery/dist/jquery.min.js',
    'mustache/mustache.min.js',
    'moment/min/moment.min.js',
    'moment-timezone/builds/moment-timezone-with-data.min.js',
    'vendor/pikaday/js/pikaday.js',
    'vendor/pikaday/js/pikaday.jquery.js',
    'vendor/prettify/prettify.js',
    'vendor/waterfall/jquery.waterfall.js',
    'vendor/jcrop/js/jquery.Jcrop.js',
    'vendor/select2/js/select2.full.js',
    'vendor/mousewheel/mousewheel.js',
    'vendor/clockpicker/js/jquery-clockpicker.js',
    'modules/backend/assets/foundation/migrate/vendor/raphael/raphael.js',
], 'js/vendor.js');

// Foundation bundle - backend foundation library
concat([
    // Migrate vendor scripts
    'modules/backend/assets/foundation/migrate/vendor/flot/jquery.flot.js',
    'modules/backend/assets/foundation/migrate/vendor/flot/jquery.flot.tooltip.js',
    'modules/backend/assets/foundation/migrate/vendor/flot/jquery.flot.resize.js',
    'modules/backend/assets/foundation/migrate/vendor/flot/jquery.flot.time.js',
    'modules/backend/assets/foundation/migrate/vendor/sortable/jquery-sortable.js',

    // Foundation core scripts
    'modules/backend/assets/foundation/scripts/foundation/foundation.baseclass.js',
    'modules/backend/assets/foundation/scripts/foundation/foundation.element.js',
    'modules/backend/assets/foundation/scripts/foundation/foundation.event.js',
    'modules/backend/assets/foundation/scripts/foundation/foundation.controlutils.js',

    // Drag scripts
    'modules/backend/assets/foundation/scripts/drag/drag.value.js',
    'modules/backend/assets/foundation/scripts/drag/drag.sort.js',
    'modules/backend/assets/foundation/scripts/drag/drag.scroll.js',

    // Rowlink
    'modules/backend/assets/foundation/scripts/rowlink/rowlink.js',

    // Foundation controls
    'modules/backend/assets/foundation/controls/autocomplete/autocomplete.js',
    'modules/backend/assets/foundation/controls/balloon-selector/balloon-selector.js',
    'modules/backend/assets/foundation/controls/callout/callout.js',
    'modules/backend/assets/foundation/controls/dropdown/dropdown.js',
    'modules/backend/assets/foundation/controls/popover/popover.js',
    'modules/backend/assets/foundation/controls/popup/popup.js',
    'modules/backend/assets/foundation/controls/popup/popup.stacker.js',
    'modules/backend/assets/foundation/controls/toolbar/toolbar.js',
    'modules/backend/assets/foundation/controls/tooltip/tooltip.js',
    'modules/backend/assets/foundation/controls/checkbox/checkbox.js',

    // Inspector
    'modules/backend/assets/foundation/controls/inspector/inspector.surface.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.manager.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.wrapper.base.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.wrapper.popup.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.wrapper.container.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.groups.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.engine.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.base.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.string.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.checkbox.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.dropdown.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.popupbase.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.text.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.set.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.objectlist.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.object.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.stringlist.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.stringlistautocomplete.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.dictionary.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.editor.autocomplete.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.helpers.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validationset.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.base.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.basenumber.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.required.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.regex.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.integer.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.float.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.validator.length.js',
    'modules/backend/assets/foundation/controls/inspector/inspector.externalparametereditor.js',

    // Charts
    'modules/backend/assets/foundation/controls/chart/chart.bar.js',
    'modules/backend/assets/foundation/controls/chart/chart.line.js',
    'modules/backend/assets/foundation/controls/chart/chart.meter.js',
    'modules/backend/assets/foundation/controls/chart/chart.pie.js',
    'modules/backend/assets/foundation/controls/chart/chart.utils.js',

    // Migrate (legacy compatibility)
    'modules/backend/assets/foundation/migrate/js/loader.js',
    'modules/backend/assets/foundation/migrate/js/backend.js',
    'modules/backend/assets/foundation/migrate/js/checkbox.js',
    'modules/backend/assets/foundation/migrate/js/bs3-adapter.js',
    'modules/backend/assets/foundation/migrate/js/list.sortable.js',
], 'js/foundation.js');

// ESM packages (need bundling to resolve bare imports)
await bundle('vue/dist/vue.esm-browser.js', 'vue/vue.esm.js');
await bundle('vue/dist/vue.esm-browser.prod.js', 'vue/vue.esm.prod.js');
await bundle('vue-router', 'vue-router/vue-router.esm.js');
await bundle('mitt', 'mitt/mitt.esm.js');
await bundle('bootstrap', 'bootstrap/bootstrap.esm.js');
await bundle('js-cookie', 'js-cookie/js.cookie.esm.js');
await bundle('sortablejs', 'sortablejs/sortable.esm.js');
await bundle('dropzone', 'dropzone/dropzone.esm.js');
await bundle('p-queue', 'p-queue/p-queue.esm.js');
await bundle('chart.js/auto', 'chartjs/chart.esm.js');
await bundle('chartjs-adapter-moment/dist/chartjs-adapter-moment.esm.js', 'chartjs/chartjs-adapter-moment.esm.js');
copyDir('moment/locale', 'moment/locale');

// Vue component libraries - output to their respective component vendor directories (ESM format)
await bundleVueComponent('vue-multiselect', 'modules/backend/vuecomponents/dropdown/assets/vendor/vue-multiselect', {
    cssFile: 'dist/vue-multiselect.css',
    jsFile: 'vue-multiselect.esm.js',
    cssOutFile: 'vue-multiselect.min.css'
});

await bundleVueComponent('@trevoreyre/autocomplete-vue', 'modules/backend/vuecomponents/autocomplete/assets/vendor/vue-autocomplete', {
    cssFile: 'dist/style.css',
    jsFile: 'vue-autocomplete.esm.js',
    cssOutFile: 'vue-autocomplete.min.css'
});

// Backend styles
await compileLess(
    'modules/backend/assets/less/october.less',
    'modules/backend/assets/css/october.css'
);

// Bootstrap
compileSass('bootstrap/src/bootstrap.scss', 'bootstrap/bootstrap.css');
compileSass('bootstrap/src/bootstrap-lite.scss', 'bootstrap/bootstrap-lite.css');
copy('bootstrap-icons/font/bootstrap-icons.min.css', 'bootstrap-icons/bootstrap-icons.css');
copyDir('bootstrap-icons/font/fonts', 'bootstrap-icons/fonts');

// Phosphor Icons (static assets)
copy('@phosphor-icons/web/src/regular/style.css', 'phosphor-icons/style.css');
copy('@phosphor-icons/web/src/regular/Phosphor.woff2', 'phosphor-icons/Phosphor.woff2');
copy('@phosphor-icons/web/src/regular/Phosphor.woff', 'phosphor-icons/Phosphor.woff');
copy('@phosphor-icons/web/src/regular/Phosphor.ttf', 'phosphor-icons/Phosphor.ttf');
copy('@phosphor-icons/web/src/regular/Phosphor.svg', 'phosphor-icons/Phosphor.svg');

// AJAX Framework (IIFE)
await script('larajax/framework-bundle.js', 'js/framework-bundle.min.js', true);
await script('larajax/framework-bundle.js', 'js/framework-bundle.js', false);
await script('larajax/framework.js', 'js/framework.min.js', true);
await script('larajax/framework.js', 'js/framework.js', false);

// Froala Editor (DRM protected - only build if present)
const froalaDir = path.join(rootDir, 'vendor_drm/froala');
if (fs.existsSync(froalaDir)) {
    console.log('\n  Building Froala editor...\n');

    // LESS stylesheets
    await compileLess(
        'vendor_drm/froala/less/froala_editor.less',
        'modules/system/assets/vendor/froala/froala.css'
    );
    await compileLess(
        'vendor_drm/froala/less/base_styles.less',
        'modules/system/assets/vendor/froala/base-styles.css'
    );

    // JavaScript (bundle with esbuild)
    const froalaOutDir = path.join(vendorDir, 'froala');
    fs.mkdirSync(froalaOutDir, { recursive: true });

    await esbuild.build({
        entryPoints: [path.join(froalaDir, 'js/index.js')],
        bundle: true,
        format: 'iife',
        outfile: path.join(froalaOutDir, 'froala.js'),
        minify: true,
        external: ['jquery'],
        globalName: 'FroalaEditor'
    });
    console.log('  ✓ froala/froala.js (bundled)');
}

// Handsontable (DRM protected - only build if present)
const handsontableDir = path.join(rootDir, 'vendor_drm/handsontable');
if (fs.existsSync(handsontableDir)) {
    console.log('\n  Building Handsontable...\n');

    const handsontableOutDir = path.join(vendorDir, 'handsontable');
    fs.mkdirSync(handsontableOutDir, { recursive: true });

    // Concatenate source CSS files
    const hotCssFiles = [
        'src/css/bootstrap.css',
        'src/css/handsontable.css',
        'src/css/mobile.handsontable.css',
        'src/plugins/comments/comments.css',
        'src/plugins/contextMenu/contextMenu.css',
        'src/plugins/copyPaste/copyPaste.css',
        'src/plugins/manualColumnFreeze/manualColumnFreeze.css',
        'src/plugins/manualColumnMove/manualColumnMove.css',
        'src/plugins/manualRowMove/manualRowMove.css',
        'src/plugins/mergeCells/mergeCells.css',
    ];
    const hotCss = hotCssFiles.map(f =>
        fs.readFileSync(path.join(handsontableDir, f), 'utf8')
    ).join('\n');
    fs.writeFileSync(path.join(handsontableOutDir, 'handsontable.css'), hotCss);
    console.log('  ✓ handsontable/handsontable.css');

    // Shim file for empty imports
    const emptyShim = path.join(handsontableDir, '_shims/empty.js');

    // esbuild plugin to resolve Handsontable-specific imports
    const hotResolvePlugin = {
        name: 'handsontable-resolve',
        setup(build) {
            // Stub out @babel/polyfill (not needed in modern browsers)
            build.onResolve({ filter: /^@babel\/polyfill/ }, () => ({
                path: emptyShim,
            }));

            // numbro is optional (numeric formatting) — stub it out
            build.onResolve({ filter: /^numbro$/ }, () => ({
                path: emptyShim,
            }));

            // Resolve pikaday JS to the vendor copy already in assets
            build.onResolve({ filter: /^pikaday$/ }, () => ({
                path: path.join(vendorDir, 'pikaday/js/pikaday.js'),
            }));

            // Stub pikaday CSS (already loaded globally)
            build.onResolve({ filter: /^pikaday\/css\// }, () => ({
                path: emptyShim,
            }));

            // Resolve moment to global shim (already loaded via vendor.js)
            build.onResolve({ filter: /^moment$/ }, () => ({
                path: path.join(handsontableDir, '_shims/moment.js'),
            }));
        }
    };

    // Bundle JavaScript (IIFE format, globals external)
    await esbuild.build({
        entryPoints: [path.join(handsontableDir, 'src/index.js')],
        bundle: true,
        format: 'iife',
        outfile: path.join(handsontableOutDir, 'handsontable.js'),
        minify: true,
        globalName: 'Handsontable',
        footer: { js: 'Handsontable=Handsontable.default||Handsontable;window.Handsontable=Handsontable;' },
        external: ['jquery'],
        loader: { '.css': 'empty' },
        plugins: [hotResolvePlugin],
        define: {
            'process.env.HOT_BUILD_DATE': JSON.stringify(new Date().toISOString()),
            'process.env.HOT_PACKAGE_NAME': JSON.stringify('handsontable'),
            'process.env.HOT_PACKAGE_TYPE': JSON.stringify('ce'),
            'process.env.HOT_VERSION': JSON.stringify('6.2.2'),
            'process.env.HOT_BASE_VERSION': JSON.stringify(''),
            'process.env.HOT_RELEASE_DATE': JSON.stringify(new Date().toISOString()),
        },
    });
    console.log('  ✓ handsontable/handsontable.js (bundled)');
}

console.log('\n  Done.\n');

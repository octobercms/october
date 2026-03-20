import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import { copyFileSync, mkdirSync } from 'fs';

const isProduction = process.argv.includes('--production');

function copyDir(src, dest) {
    execSync(`cp -r "${src}" "${dest}"`, { stdio: 'inherit' });
}

// JS Bundling
// =========================================================================

console.log('Bundling JS...');

await esbuild.build({
    entryPoints: ['assets/vendor/bootstrap/bootstrap.js'],
    bundle: true,
    format: 'iife',
    outfile: 'assets/vendor/bootstrap/bootstrap.min.js',
    minify: isProduction,
    sourcemap: false,
    target: ['es2020'],
    external: ['jquery'],
});

await esbuild.build({
    entryPoints: ['assets/vendor/codeblocks/codeblocks.js'],
    bundle: true,
    format: 'iife',
    outfile: 'assets/vendor/codeblocks/codeblocks.min.js',
    minify: isProduction,
    sourcemap: false,
    target: ['es2020'],
    external: ['jquery'],
});

// SCSS Compilation
// =========================================================================

console.log('Compiling SCSS...');

const sassFlags = '--load-path=node_modules --no-source-map' + (isProduction ? ' --style=compressed' : '');

execSync(`npx sass assets/vendor/bootstrap/bootstrap.scss assets/vendor/bootstrap/bootstrap.css ${sassFlags}`, { stdio: 'inherit' });
execSync(`npx sass assets/vendor/bootstrap-icons/bootstrap-icons.scss assets/vendor/bootstrap-icons/bootstrap-icons.css ${sassFlags}`, { stdio: 'inherit' });

// File Copies
// =========================================================================

console.log('Copying vendor files...');

copyFileSync('node_modules/jquery/dist/jquery.min.js', 'assets/vendor/jquery.min.js');

mkdirSync('assets/vendor/bootstrap-icons/fonts', { recursive: true });
copyDir('node_modules/bootstrap-icons/font/fonts/.', 'assets/vendor/bootstrap-icons/fonts/');

copyDir('node_modules/slick-carousel/slick/.', 'assets/vendor/slick-carousel/');

mkdirSync('assets/vendor/photoswipe', { recursive: true });
copyFileSync('node_modules/photoswipe/dist/photoswipe.css', 'assets/vendor/photoswipe/photoswipe.css');
copyFileSync('node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js', 'assets/vendor/photoswipe/photoswipe-lightbox.esm.min.js');
copyFileSync('node_modules/photoswipe/dist/photoswipe.esm.min.js', 'assets/vendor/photoswipe/photoswipe.esm.min.js');

mkdirSync('assets/vendor/photoswipe-dynamic-caption-plugin', { recursive: true });
copyFileSync('node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js', 'assets/vendor/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.esm.js');
copyFileSync('node_modules/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css', 'assets/vendor/photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css');

console.log('Build complete.');

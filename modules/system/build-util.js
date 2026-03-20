/**
 * October CMS Build Utilities
 *
 * Helper functions for building vendor assets
 */
import * as esbuild from 'esbuild';
import * as sass from 'sass';
import less from 'less';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const nodeModules = path.join(__dirname, 'node_modules');
const vendorDir = path.join(__dirname, 'assets/vendor');
const assetsDir = path.join(__dirname, 'assets');

// Copy a single file
export function copy(src, dest) {
    const srcPath = path.join(nodeModules, src);
    const destPath = path.join(vendorDir, dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${dest}`);
}

// Concatenate files into one
export function concat(files, dest) {
    const destPath = path.join(assetsDir, dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const contents = files.map(f => {
        let filePath;
        if (f.startsWith('modules/')) {
            // Absolute path from project root
            filePath = path.join(rootDir, f);
        } else if (f.startsWith('vendor/')) {
            // Local vendor file in system assets
            filePath = path.join(assetsDir, f);
        } else {
            // npm package
            filePath = path.join(nodeModules, f);
        }
        return fs.readFileSync(filePath, 'utf8');
    });
    fs.writeFileSync(destPath, contents.join('\n;\n'));
    console.log(`  ✓ ${dest} (${files.length} files)`);
}

// Copy a directory of files
export function copyDir(src, dest) {
    const srcPath = path.join(nodeModules, src);
    const destPath = path.join(vendorDir, dest);
    fs.mkdirSync(destPath, { recursive: true });
    const files = fs.readdirSync(srcPath);
    let count = 0;
    for (const file of files) {
        const srcFile = path.join(srcPath, file);
        const destFile = path.join(destPath, file);
        if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            count++;
        }
    }
    console.log(`  ✓ ${dest}/ (${count} files)`);
}

// Bundle an ESM package with esbuild
export async function bundle(entry, outfile, options = {}) {
    const destPath = path.join(vendorDir, outfile);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        format: 'esm',
        outfile: destPath,
        minify: true,
        ...options
    });
    console.log(`  ✓ ${outfile} (bundled)`);
}

// Build script (IIFE)
export async function script(srcFile, destFile, minify = false) {
    const srcPath = path.join(vendorDir, srcFile);
    const destPath = path.join(assetsDir, destFile);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    await esbuild.build({
        entryPoints: [srcPath],
        bundle: true,
        format: 'iife',
        outfile: destPath,
        minify,
        ignoreAnnotations: true
    });
    console.log(`  ✓ ${destFile}`);
}

// Compile SCSS to CSS
export function compileSass(srcFile, destFile) {
    const srcPath = path.join(vendorDir, srcFile);
    const destPath = path.join(vendorDir, destFile);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const result = sass.compile(srcPath, {
        style: 'compressed',
        loadPaths: [nodeModules],
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions']
    });
    fs.writeFileSync(destPath, result.css);
    console.log(`  ✓ ${destFile} (compiled)`);
}

// Compile LESS to CSS
export async function compileLess(srcFile, destFile) {
    const srcPath = path.join(rootDir, srcFile);
    const destPath = path.join(rootDir, destFile);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const source = fs.readFileSync(srcPath, 'utf8');
    const result = await less.render(source, {
        filename: srcPath,
        compress: true
    });
    fs.writeFileSync(destPath, result.css);
    console.log(`  ✓ ${destFile} (compiled)`);
}

// Bundle a Vue component library as ESM with Vue as external (uses importmap)
// Outputs JS and CSS to a specified directory relative to project root
export async function bundleVueComponent(npmPackage, outDir, options = {}) {
    const {
        cssFile = 'dist/style.css',
        jsFile = 'vue-component.esm.js',
        cssOutFile = 'vue-component.min.css'
    } = options;

    const destDir = path.join(rootDir, outDir);
    fs.mkdirSync(destDir, { recursive: true });

    const outfile = path.join(destDir, jsFile);

    // Bundle JS as ESM with external Vue (resolved via importmap in browser)
    await esbuild.build({
        entryPoints: [npmPackage],
        bundle: true,
        format: 'esm',
        outfile,
        minify: true,
        external: ['vue']
    });

    // Remove Vue 2 auto-install code that breaks in Vue 3
    // Pattern: `var v;typeof window<"u"?v=window.Vue:...;v&&v.use(...)`
    let content = fs.readFileSync(outfile, 'utf8');
    content = content.replace(
        /,(\w);typeof window<"u"\?\1=window\.Vue:typeof global<"u"&&\(\1=global\.Vue\);\1&&\1\.use\(\w+\)/g,
        ''
    );
    fs.writeFileSync(outfile, content);

    // Copy CSS file
    const cssSrcPath = path.join(nodeModules, npmPackage, cssFile);
    if (fs.existsSync(cssSrcPath)) {
        fs.copyFileSync(cssSrcPath, path.join(destDir, cssOutFile));
    }

    const shortPath = outDir.replace('modules/backend/vuecomponents/', '');
    console.log(`  ✓ ${shortPath} (bundled)`);
}

// Export directory paths for use in build scripts
export { rootDir, nodeModules, vendorDir, assetsDir };

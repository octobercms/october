/*
 |--------------------------------------------------------------------------
 | Mix Extensions
 |--------------------------------------------------------------------------
 |
 | Adds custom helper functions to the mix object.
 |
 */

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const fs = require('fs');

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) => readdirSync(source).map((name) => join(source, name)).filter(isDirectory);

function makeComponentLessList(source) {
    const componentDirs = getDirectories(source);
    const result = [];

    componentDirs.forEach((dir) => {
        const parts = dir.replace(/\\/g, '/').split('/');
        const componentName = parts[parts.length - 1];
        const lessFile = dir + '/assets/less/' + componentName + '.less';

        if (fs.existsSync(lessFile)) {
            result.push(componentName);
        }
    });

    return result;
}

// Attach the helpers to the mix object
module.exports = (mix) => {

    // Wildcard helper for components
    mix.lessList = (path, except = []) => {
        makeComponentLessList(path)
            .filter(name => !except.includes(name))
            .forEach(name => mix.less(`${path}/${name}/assets/less/${name}.less`, `${path}/${name}/assets/css/`))
        ;
    };

};

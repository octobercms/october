const webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
    ],
    externals: {
        // Use external version of jQuery
        jquery: 'jQuery'
    },
};

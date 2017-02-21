'use strict';

const NODE_ENV = 'production'; //process.env.NODE_ENV || 'development'
const webpack = require('webpack');

module.exports = [
{
    watch: false,
    entry: __dirname + "/src/entry.js",
    output: {
        path: __dirname + '/bin/',
        filename: "dymatrix.min.js",
        library: "dymatrix",
        libraryTarget: "var"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules)/,
                query: {
                    plugins: [
                                ['transform-runtime', {
                                    helpers: true,
                                    polyfill: true,
                                    regenerator: true,
                                }],
                                'transform-es2015-destructuring',
                                'transform-object-rest-spread',
                                'transform-async-to-generator',
                    ],
                    presets: ['stage-0', 'es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.EnvironmentPlugin('NODE_ENV'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    ],
    devtool: (NODE_ENV == "development") ? "cheap-inline-module-source-map" : false
}
];



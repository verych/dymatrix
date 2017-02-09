'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development'
const webpack = require('webpack');

module.exports = {
    watch: true,
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "dymatrix.js",
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
            $: 'jquery'
        })
    ],

    devtool: NODE_ENV == "development"? "cheap-inline-module-source-map" : null
};
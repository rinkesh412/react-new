const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');

const BASE_URL = '/'   // relative path for loading non-root website paths. previously it was root-relative path const BASE_URL = '/'

let pathsToClean = [
    '../dist'
]

let cleanOptions = {
    verbose: true,
    exclude: [ '*.json' ],
    dry: false,
    allowExternal: true
}

module.exports = {

    devtool: 'source-map',

    entry: {
        'main': [
            'webpack-dev-server/client?http://localhost:3000/',
            'webpack/hot/only-dev-server',
            './src/app.js'
        ]
    },

    output: {
        path: helpers.root('dist'),
        filename: '[name].[hash:8].js',
        publicPath: ''
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                use: [ {
                    loader: 'eslint-loader'
                } ],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                use: [ {
                    loader: 'babel-loader'
                } ],
                exclude: /node_modules/
            },
            {
                test: /\.styl?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]'
                        }
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        plugins: [
                          require('autoprefixer'),
                        ],
                        sourceMap: true
                      }
                    },
                    {
                      loader: 'stylus-loader',
                      options: {
                        'include css': true,
                        preferPathResolver: 'webpack',
                      }
                    }
                ]

            },
            {
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'static/images/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
                options: {
                    name: 'static/images/[name].[hash:8].[ext]'
                }
            }
        ]
    },

    resolve: {

        modules: [
            'node_modules'
        ],

        extensions: [ '.js', '.jsx', '.json', '.css', '.styl' ]
    },

    plugins: [

        new webpack.NamedModulesPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            }
        }),

        new CleanWebpackPlugin(pathsToClean, cleanOptions),

        new HtmlWebpackPlugin({
            title: 'Service Portal',
            filename: 'index.html',
            template: 'index.html',
            baseUrl: '.'+BASE_URL
        }),

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: 'styles.css'
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),

        new webpack.IgnorePlugin(/^\.\/.*js.map$/ ,/.*xterm\/lib\/addons/),

        new CopyWebpackPlugin([
            { from: 'node_modules/@nokia-csf-uxr/csfWidgets/images', to: 'static/images' },
            { from: 'node_modules/@mdi/svg/svg', to: 'static/images'}
        ])
    ]
};
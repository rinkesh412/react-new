const path = require('path');
const webpack = require('webpack');

/*
Define a unique pluginUri value and
it must be match with the jsPluginUri and cssPluginUri
in site defintion.
The pattern must be like this 'namespace/pluginName'
*/
const pluginUri = 'nokia/dsp';
// ***********************************************

var pluginIdent = '_' + pluginUri.replace(/\//g, '_');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');


module.exports = {
    // 'library': 'Component',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@nokia-csf-uxr/csfWidgets': 'CSFWidget'
    },

    entry: './src/index.js',
    // export the component only
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: `/portalweb/resource/smp/portalweb/common/custom/${pluginUri}/`,
        filename: 'plugin.js',
        library: pluginIdent,
        // libraryTarget: "jsonp",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        // contentBase: './dist',
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
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
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.json', '.css', '.styl' ]
    },

    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: 'styles.css'
            filename: 'plugin.css',
            chunkFilename: '[id].css'
        }),

        new webpack.IgnorePlugin(/^\.\/.*js.map$/, /.*xterm\/lib\/addons/)

    ]
};
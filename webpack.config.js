const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require("webpack");
const path = require('path');


module.exports = {
    mode: 'production',
    entry: {
        main: __dirname + "/src/app/index.js",
        //jquery: __dirname + "/src/app/jquery_module.js"
    }, // webpack entry point. Module to start building dependency graph
    output: {
        path: __dirname + '/dist', // Folder to store generated bundle
        filename: '[name]-[contenthash].js',  // Name of generated bundle after build
        publicPath: '/', // public URL of the output directory when referenced in a browser
        pathinfo: true
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
        ],
    },
    module: {  // where we defined file patterns and their loaders
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'link:href'],
                        root: path.resolve('', 'images')
                    }
                }
            },
            {
                test: /\.(sass|scss)$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/public/index.html",
            inject: 'body',
            minify   : {
                html5                          : true,
                collapseWhitespace             : true,
                minifyCSS                      : true,
                minifyJS                       : true,
                minifyURLs                     : false,
                removeAttributeQuotes          : true,
                removeComments                 : true,
                removeEmptyAttributes          : true,
                removeOptionalTags             : true,
                removeRedundantAttributes      : true,
                removeScriptTypeAttributes     : true,
                removeStyleLinkTypeAttributese : true,
                useShortDoctype                : true
            }
        })
    ],
    devServer: {  // configuration for webpack-dev-server
        contentBase: './src/public',  //source of static assets
        port: 7700, // port to run dev-server
    }
};

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;


const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: `${filename('js')}`,
      path: path.resolve(__dirname, 'dist'),
      publicPath: ''
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
        writeToDisk: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'colors.html',
            template: './src/pages/colors.pug',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${filename('css')}`
        }),
    ],
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev
                        },
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      publicPath: (resourcePath, context) => {
                        return path.relative(path.dirname(resourcePath), context) + '/';
                      },
                    }
                  },
                  'css-loader',
                  'sass-loader'
                ],
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./img/${filename('[ext]')}`
                    }
                }],
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/,
                use: [{
                  loader: 'file-loader',
                  options: {
                    name: `./fonts/${filename('[ext]')}`
                  }
                }],
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }
        ]
    }
}
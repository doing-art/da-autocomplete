import webpack from 'webpack';
import pkg from './package.json';
import ExtractTextPlugin  from 'extract-text-webpack-plugin'

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
    context: __dirname + '/src',

    entry: {
        js: './javascript/index',
        extra: './stylesheets/main'
    },

    output: {
        path: __dirname + '/lib',
        publicPath: NODE_ENV === 'development' ? '/' : '../',
        library: 'da',
        libraryTarget: "umd",
        filename: NODE_ENV === 'production' ? `[name]/${pkg.name}.min.js` : `[name]/${pkg.name}.js`,
    },

    watch: NODE_ENV === 'development',

    devtool: NODE_ENV === 'development' ? 'source-map' : false,

    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.sass', '.ttf', '.eot', '.woff', '.svg']
    },

    resolveLoader: {
        modules: ['node_modules'],
        moduleExtensions: ['-loader'],
        extensions: ['.js']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?optional[]=runtime',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.sass$/,
                loader: NODE_ENV === 'development' ? 'style-loader!css-loader?sourceMap!autoprefixer-loader?browsers=last 50 version!sass-loader?sourceMap'
                    : ExtractTextPlugin.extract(['css-loader?minimize', 'autoprefixer-loader?browsers=last 50 version', 'sass-loader'])
            },
            {
                test: /\.(ttf|eot|woff|svg)$/,
                loader: 'file?name=[path][name].[ext]?[hash]'
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new webpack.BannerPlugin(`
           ${pkg.name} - ${pkg.description}
           Author: ${pkg.author}
           Version: v${pkg.version}
           Url: ${pkg.homepage}
           License(s): ${pkg.license}
        `),
        new ExtractTextPlugin(NODE_ENV === 'production' ? `css/${pkg.name}.min.css` : `css/${pkg.name}.css`),
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        host: 'localhost',
        port: '8080',
        contentBase: __dirname + '/lib',
        hot: true,
        proxy: [
            {
                context: ['/search'],
                target: 'http://localhost:3000',
                secure: false
            }
        ]
    }
};

if(NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

export default config
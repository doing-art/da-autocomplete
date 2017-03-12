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
        library: 'DaAutocomplete',
        libraryTarget: "umd",
        filename: NODE_ENV === 'production' ? `[name]/${pkg.name}.min.js` : `[name]/${pkg.name}.js`,
    },

    watch: NODE_ENV === 'development',

    devtool: NODE_ENV === 'development' ? 'source-map' : false,

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.sass', '.ttf']
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
                    presets: ['es2015']
                }
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader?',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                            minimize: NODE_ENV === 'production'
                        }
                    }, {
                        loader: 'autoprefixer-loader?browsers=last 50 version'
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: NODE_ENV === 'development',
                            sourceMapContents: NODE_ENV === 'development'
                        }
                    }]
                })
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
        hot: true
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
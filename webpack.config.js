import webpack from "webpack";
import pkg from "./package.json";

export default {
    output: {
        library: pkg.name,
        libraryTarget: "umd",
        filename: `${pkg.name}.js`
    },
    devtool: "#inline-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    compact: false
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(`
           ${pkg.name} - ${pkg.description}
           Author: ${pkg.author}
           Version: v${pkg.version}
           Url: ${pkg.homepage}
           License(s): ${pkg.license}
        `)
    ]
};
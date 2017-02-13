module.exports = {
    entry: './src/javascript/index.js',
    output: {
        library: 'daAutocomplete',
        libraryTarget: "umd",
        filename: "lib/js/da-autocomplete.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    compact: false // because I want readable output
                }
            }
        ]
    }
};
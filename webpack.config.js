module.exports = {
    name: 'default',
    entry: './src/index.js',
    output: {
        library: 'io',
        libraryTarget: 'umd',
        filename: 'common.js'
    },
    devtool: 'cheap-module-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        }]
    }
};
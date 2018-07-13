const path = require('path');

module.exports = {
    entry: {
        index: ['babel-polyfill', path.resolve(__dirname, 'src/index.jsx')]
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            }
        ],
    }
};
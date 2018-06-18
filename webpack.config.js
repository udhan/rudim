const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode:'production',
    entry: './src/rudim.js',
    output: {
        filename: 'rudim.min.js',
    },
    plugins: [
        new CleanWebpackPlugin(["dist"])
    ]
};

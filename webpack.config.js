const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // relative path
  output: {
    path: path.join(__dirname, 'dist'), // absolute path
    filename: 'bundle.js' // file name
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three',
      ReactDOM: 'react-dom',
      React: 'react',
      d3: 'd3'
    })
  ]
};
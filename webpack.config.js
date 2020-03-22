const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './src/index.js',
    worker: './src/workers/worker_projection.js',
    cluster: './src/workers/worker_cluster.js'
  },
  output: {
    path: path.join(__dirname, 'dist'), // absolute path
    filename: '[name].js' // file name
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
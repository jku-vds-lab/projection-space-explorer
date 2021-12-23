const webpack = require('webpack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  mode: "development",
  watch: false, //true
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    'redux': 'redux',
    '@mui/material': '@mui/material',
    '@mui/styles': '@mui/styles',
    '@emotion/react': '@emotion/react',
    '@emotion/styled': '@emotion/styled'
  },
  entry: {
    bundle: "./src/index.ts"
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    publicPath: '',
    library: 'PSE',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: { inline: "no-fallback" }
      },
      { test: /\.scss$/, use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ] },
      { test: /\.tsx?$/, loader: "babel-loader" },
      { test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
});

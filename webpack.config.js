
module.exports = {
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
    alias: {
      "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
      "react/jsx-runtime": "react/jsx-runtime.js",
    },
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        resourceQuery: /inline/,
        type: 'asset/inline',
      },
      {
        test: /\.svg(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // css-loader is messing up SVGs: https://github.com/webpack/webpack/issues/13835
        // Pin css-loader and always load them as file-resource.
        type: 'asset/inline',
      },
      { test: /\.scss$/, use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ] },
      { test: /\.tsx?$/, loader: "babel-loader" },
      { test: /\.tsx?$/, loader: "ts-loader" },
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
  }
};

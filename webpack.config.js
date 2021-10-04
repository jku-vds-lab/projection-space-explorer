const webpack = require('webpack');

module.exports = {
  mode: "development",
  watch: false,
  entry: {
    bundle: "./src/index.tsx",
    tsne: './src/components/workers/embeddings/worker_tsne.ts',
    umap: './src/components/workers/embeddings/worker_umap.ts',
    cluster: './src/components/workers/worker_cluster.tsx',
    forceatlas2: './src/components/workers/embeddings/worker_forceatlas2.ts',
    tessy: './src/components/workers/worker_triangulate.ts'
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    publicPath: '',
    library: 'testlib',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.scss$/, use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ] },
      { test: /\.tsx?$/, loader: "babel-loader" },
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react'
    })
  ]
};

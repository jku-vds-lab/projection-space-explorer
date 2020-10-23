const webpack = require('webpack');

module.exports = {
  mode: "development",
  watch: true,
  entry: {
    bundle: "./src/components/index.tsx",
    tsne: './src/components/workers/embeddings/worker_tsne.ts',
    umap: './src/components/workers/embeddings/worker_umap.ts',
    cluster: './src/components/workers/worker_cluster.tsx',
    forceatlas2: './src/components/workers/embeddings/worker_forceatlas2.ts',
    healthcheck: './src/components/workers/worker_healthcheck.tsx'
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
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
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react'
    })
  ]
};

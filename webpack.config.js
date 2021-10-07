const webpack = require('webpack');

module.exports = {
  mode: "development",
  watch: false,
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  entry: {
    bundle: "./src/exports.ts",
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
    library: 'PSE',
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
  }
};

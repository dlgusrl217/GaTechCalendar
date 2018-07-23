const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      appMountId: 'app',
      meta: [{
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
      }]
    }),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/, options: {
          compilerOptions: { declaration: false, sourceMap: false }
        }
      },
      { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
      { test: /\.(png|jpg|gif|avi|mp4|m4v|mp3|wav)$/, loader: 'file-loader' },
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: { vue$: 'vue/dist/vue.esm.js' }
  },
  watch: true,
  mode: 'development',
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    useLocalIp: true,
    contentBase: path.join(__dirname, 'dist'),
    lazy: true,
    filename: 'undefined',
    https: false
  }
};
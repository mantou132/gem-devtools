const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  entry: {
    test: './src/test',
    devtools: './src/devtools',
    content: './src/content',
    sidebarpanel: './src/sidebarpanel',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'extension'),
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyWebpackPlugin({ patterns: [{ from: './public', to: './' }] }),
    new HtmlWebpackPlugin({ filename: 'devtools.html', chunks: ['devtools'] }),
    new HtmlWebpackPlugin({ filename: 'sidebarpanel.html', chunks: ['sidebarpanel'] }),
    new HtmlWebpackPlugin({ filename: 'index.html', chunks: ['test'] }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    new WriteFilePlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './extension',
    historyApiFallback: true,
    disableHostCheck: true,
  },
};

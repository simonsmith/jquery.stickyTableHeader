const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

const config = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'jquery.stickyTableHeader.js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: `${pkg.name}\n${pkg.version}\nRequires jQuery 1.12.0+\n${
        pkg.repository.url
      }\nLicense: ${pkg.license}`,
    }),
  ],

  externals: {
    jquery: {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
      root: 'jQuery',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            beautify: true,
            comments: /^!/,
          },
          compress: false,
          mangle: false,
        },
      }),
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map';
}

module.exports = config;

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
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
      banner: `${pkg.name}\n${pkg.version}\nTested with jQuery 1.12+\n${pkg.repository.url}\nLicense: ${pkg.license}`,
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
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map';
}
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJsPlugin({
      beautify: true,
      mangle: false,
    })
  );
}

module.exports = config;

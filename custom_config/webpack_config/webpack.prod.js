/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  output: {
    filename: '[name]-[contenthash].js',
    path: path.resolve(__dirname, '../../dist'),
    clean: true,
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers
      // (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      // new CssMinimizerPlugin(),
      new TerserPlugin({
        // minify: TerserPlugin.swcMinify,
        // `terserOptions` options will be passed to `swc` (`@swc/core`)
        // Link to options - https://swc.rs/docs/config-js-minify
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            ecma: 5,
            passes: 3,
          },
          // compress:{ pure_funcs: ['console.info', 'console.debug', 'console.warn'] }
        },
      }),
    ],
  },
  plugins: [
    // Dumps css into it's own seperate file
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    // Copies html from a template and also minifies it
    new HtmlWebpackPlugin({
      template: './src/template.ejs',
      minify: true,
      inject: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [require('autoprefixer')] } },
          },
        ],
      },
    ],
  },
});

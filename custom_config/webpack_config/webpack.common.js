module.exports = {
  entry: './src/TypeScript/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/(node_modules)/, /(test)/, /(coverage)/],
        use: {
          loader: 'swc-loader',
          options: {
            // This makes swc-loader invoke swc synchronously.
            // sync: true,
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
        },
      },

      {
        test: /\.ejs$/,
        use: ['ejs-compiled-loader'],
      },

      {
        test: /\.(png|jpeg|svg)/,
        type: 'asset/resource',
        generator: {
          // If emitting file, the file path is
          filename: 'assets/img/[hash][ext]',
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          // If emitting file, the file path is
          filename: 'assets/fonts/[hash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

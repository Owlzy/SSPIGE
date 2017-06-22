const path = require('path');
var webpack = require('webpack');

const config = {
  entry: [ 'babel-polyfill', /*'babel-plugin-transform-es2015-classes' , 'babel-plugin-transform-es2015-object-super',*/ './src/Main.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ],
  /*
    loaders: [
      {
       test: /.jsx?$/,
       loader: 'babel-loader',

      //  Skip any files outside of your project's `src` directory
      include: [
        path.resolve(__dirname, "src"),
    ],

      query: {
        presets: ['es2015']
       }
      }
    ]
*/
  }
};

module.exports = config;
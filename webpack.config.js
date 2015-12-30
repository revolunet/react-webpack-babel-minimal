var webpack = require('webpack');

var PORT = 9997;

var entries = [ './src/index' ];
var plugins = [];

// include hot reload stuff only in development
if (process.env.NODE_ENV !== 'production') {

  entries = [
    `webpack-dev-server/client?http://0.0.0.0:${PORT}`,
    'webpack/hot/only-dev-server'
  ].concat(entries);

  plugins = [new webpack.HotModuleReplacementPlugin()].concat(plugins);

}


module.exports = {
  entry: entries,
  output: {
    filename: 'bundle.js',
    path: './build'
  },
  devServer: {
    port: PORT,
    contentBase: './build',
    historyApiFallback: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },{
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
      },{
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css',
      }
    ]
  },
  plugins: plugins
};

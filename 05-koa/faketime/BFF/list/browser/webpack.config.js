const path = require('path');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: path.join(__dirname, 'index.jsx'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../../static/list')
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  // stats: 'errors-only'
}

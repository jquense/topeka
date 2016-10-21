import path from 'path'

export default {
  devtool: 'source-map',

  entry: './example/example.js',
  output: {
    path: path.join(__dirname, './example'),
    filename: 'bundle.js',
    publicPath: '/example/'
  },
  resolve: {
    alias: {
      topeka: path.resolve(__dirname, 'src')
    }
  },
  module: {
    loaders: [
      { test: /\.jsx$|\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css/, loader: 'style!css' },
      { test: /\.less/, loader: 'style!css!less', exclude: /node_modules/ }
    ]
  }
}

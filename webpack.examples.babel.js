import path from 'path'
import HtmlPlugin from 'html-webpack-plugin';

export default {
  devtool: 'source-map',

  entry: './example/example.jsx',
  output: {
    path: path.join(__dirname, '../example'),
    filename: 'example.js'
  },
  resolve: {
    alias: {
      topeka: path.resolve(__dirname, 'src/index.js')
    }
  },
  module: {
    loaders: [
      { test: /\.jsx$|\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.less/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ }
    ]
  }
}

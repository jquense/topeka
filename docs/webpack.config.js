const path = require('path')
const { plugins, rules } = require('webpack-atoms')

module.exports = {
  devtool: 'source-map',

  entry: require.resolve('./client.js'),
  output: {
    path: path.join(__dirname, '../docs/'),
    filename: 'bundle.js',
    publicPath: '/docs',
  },
  resolve: {
    alias: {
      topeka: path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [rules.js(), rules.css(), rules.less()],
  },
  plugins: [plugins.extractCss()],
}

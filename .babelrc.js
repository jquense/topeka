module.exports = {
  presets: [
    ['jason', {
      modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs'
    }]
  ],
}

module.exports = api => ({
  presets: [
    [
      'jason',
      {
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
  ],
})

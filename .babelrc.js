module.exports = api => ({
  presets: [
    '@babel/typescript',
    [
      'jason',
      {
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
  ],
})

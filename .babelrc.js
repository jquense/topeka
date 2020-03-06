module.exports = api => ({
  presets: [
    '@babel/typescript',
    [
      'babel-preset-jason/esm',
      {
        modules: api.env() !== 'esm',
      },
    ],
  ],
})

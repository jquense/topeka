module.exports = api => ({
  presets: [
    '@babel/typescript',
    '@babel/react',
    [
      'babel-preset-env-modules',
      {
        modules: api.env() !== 'esm' ? 'commonjs' : false,
      },
    ],
  ],
})

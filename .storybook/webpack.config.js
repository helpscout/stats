module.exports = (baseConfig, env, config) => {
  // Typescript
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /__tests__/,
    loader: require.resolve('awesome-typescript-loader'),
  })
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}

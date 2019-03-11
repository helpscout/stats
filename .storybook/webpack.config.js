module.exports = (baseConfig, env, config) => {
  // Typescript
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /__tests__/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: ['@helpscout/zero/babel'],
      },
    },
  })
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}

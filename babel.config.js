module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@config': './src/config',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@store': './src/store',
          '@types': './src/types',
          '@utils': './src/utils',
          '@socket': './src/socket',
          '@services': './src/services',
        },
      },
    ],
    'react-native-paper/babel',
    'react-native-worklets/plugin',
  ],
};

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],

  plugins: [
    [
      'react-native-reanimated/plugin',
      //  {
      //     relativeSourceLocation: true,
      // },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          _assets: './src/assets',
          _atoms: './src/components/atoms',
          _molecules: './src/components/molecules',
          _organisms: './src/components/organisms',
          _templates: './src/components/templates',
          _navigations: './src/navigations',
          _scenes: './src/scenes',
          _utils: './src/utils',
          _locales: './src/locales',
          _icons: './src/assets/icons',
          _images: './src/assets/images',
          _actions: './src/store/actions',
        },
      },
    ],
  ],
};

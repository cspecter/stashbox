// @generated: @expo/next-adapter@2.1.41
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const { withExpo } = require('@expo/next-adapter');
const withFonts = require('next-fonts');
const withImages = require('next-images');

const withTM = require('next-transpile-modules')([
  'react-native',
  'native-base',
  '@codler/react-native-keyboard-aware-scroll-view'
]);

module.exports = withTM(
  withExpo(
    withFonts(
      withImages({
        projectRoot: __dirname,
      })
    )
  )
)

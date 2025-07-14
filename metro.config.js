const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    transformer: {
        // FIXME: Compatibility issue with react-native-obfuscating-transformer
        // Following the official documentation for react-native-obfuscating-transformer causes issues (Cannot read properties of undefined (reading 'transformFile') at Bundler.transformFile). To resolve this, followed the approach suggested from https://github.com/javascript-obfuscator/react-native-obfuscating-transformer/issues/16#issuecomment-628481855, but this is causing "index.js could not be cloned" issue.
        // getTransformModulePath: () => {
        //     return require.resolve('./transformer');
        // },
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

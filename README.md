# Getting Started with Soloana Wallet Connection With React

first of all install phantom wallet [Chrome Extension](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa/related?hl=en).

Add these packages:

### `npm i @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js`

You can use the above One line command to install all the packages.
or you can install them one by one using the below command:

### `npm i @solana/web3.js`

### `npm i @solana/wallet-adapter-base`

### `npm i @solana/wallet-adapter-react`

### `npm i @solana/wallet-adapter-react-ui`

### `npm i @solana/wallet-adapter-wallets`

after installing all the packages, you can Paste the below code in app.js to connect your wallet.

Now if you run the app you will get these errors because we created a new project and that uses webpack 5 and the packages we installed are using some of the crypto/web3 auth related packages that are not supported by webpack 5. by default So we need to create polyfills for them, i was unfimiliar with that process so i used this [link](https://web3auth.io/docs/troubleshooting/webpack-issues) to solve the issue as mentioned in the web3auth.io docs.

ERROR in ./node_modules/@toruslabs/eccrypto/browser.js 7:17-34
Module not found: Error: Can't resolve 'crypto' in 'C:\Users\owais\OneDrive\Desktop\AshtarGroup\intro-to-solana\node_modules\@toruslabs\eccrypto'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }' - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "crypto": false }

ERROR in ./node_modules/cipher-base/index.js 2:16-43
Module not found: Error: Can't resolve 'stream' in 'C:\Users\owais\OneDrive\Desktop\AshtarGroup\intro-to-solana\node_modules\cipher-base'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }' - install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "stream": false }

Solution for the above error:

### `npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process`

Create config-overrides.js in the root of your project folder with the content:

### `

const webpack = require("webpack");

module.exports = function override(config) {
const fallback = config.resolve.fallback || {};
Object.assign(fallback, {
crypto: require.resolve("crypto-browserify"),
stream: require.resolve("stream-browserify"),
assert: require.resolve("assert"),
http: require.resolve("stream-http"),
https: require.resolve("https-browserify"),
os: require.resolve("os-browserify"),
url: require.resolve("url"),
});
config.resolve.fallback = fallback;
config.plugins = (config.plugins || []).concat([
new webpack.ProvidePlugin({
process: "process/browser",
Buffer: ["buffer", "Buffer"],
}),
]);
config.ignoreWarnings = [/Failed to parse source map/];
return config;
};
`
and replace scripts in package.json with the following to use react-app-rewired instead of react-scripts:

"scripts": {
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
"eject": "react-scripts eject"
},

we are done with the setup now we can connect our wallet.

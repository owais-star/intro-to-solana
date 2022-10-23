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

```js
import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import React, { useMemo, useState } from "react"
import "./App.css"
import "@solana/wallet-adapter-react-ui/styles.css"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import "./App.css"

function App() {
  // // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet;
  // // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]); console.log(endpoint);
  // //wallet connection Error handling
  // const walletConnectionErr = (error = WalletError) => {
  //   console.log("Wallet Connection Error:", error);
  // };
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Content />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Content = () => {
  const [userSOLBalance, setSOLBalance] = useState()
  const wallet = useAnchorWallet()

  const network = WalletAdapterNetwork.Devnet

  const connection = new Connection(clusterApiUrl(network))

  if (wallet?.publicKey) {
    const SOL = connection.getAccountInfo(wallet.publicKey)
    SOL.then((res) => setSOLBalance(res && res.lamports / LAMPORTS_PER_SOL))
  }
  console.log(userSOLBalance)

  return (
    <div className="container">
      <div className="wrapper">
        <h1 className="title">Click here to connect Your Wallet</h1>
        {/* <button className="button">Wallet Connection</button> */}
        <WalletMultiButton className="button" />
        {userSOLBalance && (
          <>
            <h1 className="title">Your Balance</h1>
            <button className="button">{userSOLBalance} Sol</button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
```

Now if you run the app you will get these errors because we created a new project and that uses webpack 5 and the packages we installed are using some of the crypto/web3 auth related packages that are not supported by webpack 5. by default So we need to create polyfills for them, i was unfimiliar with that process so i used this [link](https://web3auth.io/docs/troubleshooting/webpack-issues) to solve the issue as mentioned in the web3auth.io docs.

```text
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
```

## Solution for the above error:

### `npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process`

Create config-overrides.js in the root of your project folder with the content:

```js
const webpack = require("webpack")

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ])
  config.ignoreWarnings = [/Failed to parse source map/]
  return config
}
```

and replace scripts in package.json with the following to use react-app-rewired instead of react-scripts:

```json
"scripts": {
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
"eject": "react-scripts eject"
},
```

we are done with the setup now we can connect our wallet.

## using solana's faucet to get some test SOL

Now we need some SOL to play around with the solana network, we can get some SOL from the solana's faucet by following the [Docs](https://docs.solana.com/wallet-guide/sending-and-receiving-sol#faucet) or we can use this simplified [Article](https://www.alchemy.com/overviews/solana-faucet) wallet to get some SOL.

## paste these commands line by line in a new administrator cmd window to download the solana cli and install it.

```bash
curl https://release.solana.com/v1.10.32/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs
```

now install it with this command

```bash
C:\solana-install-tmp\solana-install-init.exe v1.10.32
```

after installation you wil see press any key to continue, at this point close that terminal and open a new one and type the following command to check if the installation was successful.

```bash
solana --version
```

now to create a new wallet type the following command in the terminal

```bash
solana-keygen new
solana-keygen new --no-outfile
```

it will ask for pass phrase and then it will generate a new wallet for you, it will also generate a new public key and a private key, keep the private key safe and don't share it with anyone.

now we need to fund our wallet with some SOL, to do that we will use the solana's faucet, paste the following command in the terminal

```bash
solana airdrop 2 <RECIPIENT_ACCOUNT_ADDRESS> --url https://api.devnet.solana.com
```

replace the `<RECIPIENT_ACCOUNT_ADDRESS>` with your public key that you got from the previous command.
in my case it is

```text
EAWk6nY2HFevpWaJvozcxzk7a53oV8U6vKu3MNJqMw53
and
DMWuJPZhubK5NepB84tAeJSrBQnZuMaAuFzQGefTa3Cu
```

so i used the first one to fund my wallet like so:

```bash
solana airdrop 2 EAWk6nY2HFevpWaJvozcxzk7a53oV8U6vKu3MNJqMw53 --url https://api.devnet.solana.com
```

you can also get sol in your test net or devnet wallet by using the [Solana's airdrop website](https://solfaucet.com/) just paste your public key and click on the airdrop button.

get some other tokens from the [Solana's token list](https://spl.solana.com/token-list) and fund your wallet with them.

get some usdc tokens from the [USDC Faucet](https://usdcfaucet.com/) and fund your wallet with them.

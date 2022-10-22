import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import {
  WalletAdapterNetwork,
  WalletError
} from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import React, { useMemo, useState } from 'react'
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import './App.css';

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

export default App;

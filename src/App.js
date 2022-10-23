import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import React, { useEffect, useMemo, useState } from 'react'
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
          <Child />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Child = () => {
  const [userSOLBalance, setSOLBalance] = useState(0)
  const [userSPLTokenAccounts, setUserSPLTokenAccounts] = useState([{
    tokenAccount: "HUqzBrSg2A8VSUnqnKUGYNChXj5QHBjcdN6Nq19xCg7D",
    tokenBalance: 2,
    tokenMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  }])
  const wallet = useAnchorWallet()

  const network = WalletAdapterNetwork.Devnet

  const connection = new Connection(clusterApiUrl(network))

  const getUsersTokenAccounts = async (MY_WALLET_ADDRESS) => {
    const tempArr = []
    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
              bytes: MY_WALLET_ADDRESS, // base58 encoded string

            },
          },
        ],
      }
    );
    console.log("accounts", accounts);
    accounts.forEach((account, i) => {
      //Parse the account data
      const parsedAccountInfo = account.account.data;
      const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
      const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      //Log results
      console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
      console.log(`--Token Mint: ${mintAddress}`);
      console.log(`--Token Balance: ${tokenBalance}`);
      tempArr.push({
        tokenAccount: account.pubkey.toString(),
        tokenMint: mintAddress,
        tokenBalance: tokenBalance
      })
    });
    setUserSPLTokenAccounts(tempArr)
  }

  useEffect(() => {
    if (wallet?.publicKey) {
      getUsersTokenAccounts(wallet.publicKey)
      const SOL = connection.getAccountInfo(wallet.publicKey)
      SOL.then((res) => setSOLBalance(res && res.lamports / LAMPORTS_PER_SOL))
    }
  }, [wallet?.publicKey])

  if (wallet?.publicKey && userSOLBalance && userSPLTokenAccounts.length > 0) {
    console.log(userSOLBalance)
    console.log(userSPLTokenAccounts)
  }

  if (wallet?.disconnected) {
    setSOLBalance()
    setUserSPLTokenAccounts([])
    console.log("disconnected")
  }
  console.log("wallet", wallet)
  return (
    <>
      {userSOLBalance && userSPLTokenAccounts.length > 0 ?
        <ConnectedUI
          userSOLBalance={userSOLBalance}
          userSPLTokenAccounts={userSPLTokenAccounts}
        /> :
        <div className="container">
          <div className="wrapper align-center">

            <h1 className="title">Click here to connect Your Wallet</h1>
            <WalletMultiButton className="button" />

          </div>
        </div>
      }
    </>
  )
}

const ConnectedUI = ({ userSOLBalance, userSPLTokenAccounts }) => {
  return (
    <div className="container">
      <div className="wrapper">
        <div className='connected-btn'>
          <WalletMultiButton className="button" />
        </div>
        <>
          <h1 className="title">Your Balance</h1>
          <button className="button">{userSOLBalance} Sol</button>
        </>
        {userSPLTokenAccounts.length > 0 && (
          <>
            <h1 className="title">Other Tokens</h1>
            {userSPLTokenAccounts.map((token, i) => (
              <button className="button" key={i}>Amount: {token.tokenBalance} <br /> Mint: {token.tokenMint}</button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default App;

import { NextPage } from "next";
import styles from "../style/Home.module.css";
import { AppBar } from "../components/AppBar";
import { useWallet } from "@solana/wallet-adapter-react";
import { Increment } from "../components/Increment";
import { Initialize } from "../components/Initialize";
import { useState } from "react";
import Head from "next/head";

const Home: NextPage = () => {
  const [counter, setCounter] = useState("");
  const [transactionUrl, setTransactionUrl] = useState("");
  const wallet = useWallet();

  return (
    <div className={styles.App}>
      <Head>
        <title>Anchor Frontend Example</title>
      </Head>
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppBar />
        <div className={styles.AppBody} style={{ textAlign: "center" }}>
          {wallet.connected ? (
            counter ? (
              <div>
                <Increment
                  counter={counter}
                  setTransactionUrl={setTransactionUrl}
                />
              </div>
            ) : (
              <Initialize
                setCounter={setCounter}
                setTransactionUrl={setTransactionUrl}
              />
            )
          ) : (
            <p style={{ color: "white" }}>Connect Wallet</p>
          )}
          {transactionUrl && (
            <a
              href={transactionUrl}
              style={{
                color: "white",
                marginTop: "20px",
                display: "block",
                textDecoration: "none",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View most recent transaction
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";
import styles from "../styles/Home.module.css";

export const SendSolForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const sendSol = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!publicKey || !connection) {
      alert("Wallet not connected!");
      return;
    }

    try {
      const form = event.target as HTMLFormElement;
      const amountInput = form.amount as HTMLInputElement;
      const recipientInput = form.recipient as HTMLInputElement;

      const amountToSend = parseFloat(amountInput.value);
      if (isNaN(amountToSend) || amountToSend <= 0) {
        alert("Invalid amount!");
        return;
      }

      // ✅ Check user's balance before proceeding
      const balance = await connection.getBalance(publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;

      if (balanceInSOL < amountToSend) {
        alert(
          "Insufficient balance! Your current balance is: " +
            balanceInSOL +
            " SOL"
        );
        return;
      }

      // Create transaction
      const transaction = new web3.Transaction();
      const recipientPubKey = new web3.PublicKey(recipientInput.value);

      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: LAMPORTS_PER_SOL * amountToSend,
      });

      transaction.add(sendSolInstruction);

      // Add latest blockhash for transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);

      console.log("Transaction sent:", signature);
    } catch (error) {
      console.error("Transaction failed:", error);

      // ✅ Only show alert, prevent the error page
      if (error instanceof Error) {
        alert(`Transaction failed: ${error.message || "Unknown error"}`);
      } else {
        alert("Transaction failed: Unknown error");
      }
    }
  };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={sendSol} className={styles.form}>
          <label htmlFor="amount">Amount (in SOL) to send:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="e.g. 0.1"
            required
          />
          <br />
          <label htmlFor="recipient">Send SOL to:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
            required
          />
          <button type="submit" className={styles.formButton}>
            Send
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {txSig ? (
        <div>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};

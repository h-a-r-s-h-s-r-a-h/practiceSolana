import { NextPage } from "next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";

const Index: NextPage = (props) => {
  const { publicKey, sendTransaction } = useWallet();
  const [txSig, setTxSig] = useState("");
  const { connection } = useConnection();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transfer SOL</h1>
          <p className="text-gray-400">Send SOL to any wallet address</p>
        </div>

        {publicKey ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            <form onSubmit={sendSol} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (in SOL) to send
                </label>
                <input
                  id="amount"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g. 0.1"
                  required
                />
              </div>

              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
                  Send SOL to
                </label>
                <input
                  id="recipient"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Send SOL
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
              <p className="text-xl text-white font-medium">Connect Your Wallet</p>
              <p className="text-gray-400 mt-2">Please connect your wallet to transfer SOL</p>
            </div>
          </div>
        )}

        {txSig && (
          <div className="mt-8 text-center">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700">
              <p className="text-gray-400 mb-2">View your transaction on</p>
              <a
                href={link()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
              >
                Solana Explorer
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

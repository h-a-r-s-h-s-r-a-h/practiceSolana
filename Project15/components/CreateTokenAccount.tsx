import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { FC, useState } from "react";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

export const CreateTokenAccountForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const createTokenAccount = async (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();
    const owner = new web3.PublicKey(event.target.owner.value);
    const mint = new web3.PublicKey(event.target.mint.value);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );

    sendTransaction(transaction, connection).then((sig) => {
      setTxSig(sig);
      setTokenAccount(associatedToken.toString());
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-800 mt-6">
      {publicKey ? (
        <form onSubmit={createTokenAccount} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mint" className="block text-sm font-medium text-gray-300">
              Token Mint:
            </label>
            <input
              id="mint"
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter Token Mint"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="owner" className="block text-sm font-medium text-gray-300">
              Token Account Owner:
            </label>
            <input
              id="owner"
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter Token Account Owner PublicKey"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Token Account
          </button>
        </form>
      ) : (
        <span className="text-gray-400">Connect Your Wallet</span>
      )}
      {txSig ? (
        <div className="mt-6 space-y-2">
          <p className="text-gray-300">
            Token Account Address:{" "}
            <span className="text-indigo-400 break-all">{tokenAccount}</span>
          </p>
          <p className="text-gray-300">
            View your transaction on{" "}
            <a
              href={link()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Solana Explorer
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
};

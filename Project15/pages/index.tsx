import { NextPage } from "next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";

const Home: NextPage = (props) => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    // Ensure the balance updates after the transaction completes
    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [connection, publicKey]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        {publicKey ? (
          <>
            <p className="text-lg font-semibold mb-4">
              Welcome to Solana Transfer App!
            </p>
            <p className="text-lg font-semibold mb-4">
              Your Balance: {balance}
            </p>
            <Link href="/transfer" passHref>
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Tranfer Money
              </button>
            </Link>
          </>
        ) : (
          <p className="text-lg font-semibold">Connect your wallet</p>
        )}
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { NextPage } from "next";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

const Home: NextPage = () => {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        {publicKey ? (
          <>
            <p className="text-lg font-semibold mb-4">
              Welcome, Start rating Movies!
            </p>
            <Link href="/rateMovie" passHref>
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Rate Now
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

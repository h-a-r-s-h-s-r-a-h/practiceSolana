import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export const AppBar: FC = () => {
  const { publicKey } = useWallet();

  return (
    <div>
      {publicKey ? (
        <header className="bg-gray-900 shadow-lg border-b border-gray-700">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/solanaLogo.png"
                  height={30}
                  width={150}
                  alt="Solana Logo"
                />
              </Link>
              <Link
                href="/rateMovie"
                className="text-gray-300 hover:text-blue-400 transition duration-200 text-lg font-medium"
              >
                Rate Now
              </Link>
              <Link
                href="/seeAllRatedMovie"
                className="text-gray-300 hover:text-blue-400 transition duration-200 text-lg font-medium"
              >
                All Rated Movie
              </Link>
            </div>

            <div className="flex items-center justify-center mb-4 md:mb-0">
              <span className="text-xl font-semibold text-white flex items-center">
                🎬 Movie Rating Application
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/movieYouAdded"
                className="text-gray-300 hover:text-blue-400 transition duration-200 text-lg font-medium"
              >
                Your Rated Movie
              </Link>
              <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md" />
            </div>
          </div>
        </header>
      ) : (
        <header className="bg-gray-900 shadow-lg border-b border-gray-700">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/solanaLogo.png"
                  height={30}
                  width={150}
                  alt="Solana Logo"
                />
              </Link>
            </div>

            <div className="flex items-center justify-center mb-4 md:mb-0">
              <span className="text-xl font-semibold text-white flex items-center">
                🎬 Movie Rating Application
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md" />
            </div>
          </div>
        </header>
      )}
    </div>
  );
};

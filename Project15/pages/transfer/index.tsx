import { NextPage } from "next";
import WalletContextProvider from "../../components/WalletContextProvider";
import { AppBar } from "../../components/AppBar";
import { MintToForm } from "../../components/MintToForm";
import { CreateTokenAccountForm } from "../../components/CreateTokenAccount";
import { CreateMintForm } from "../../components/CreateMint";
import Head from "next/head";

const Home: NextPage = (props) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Head>
        <title>Solana Token Manager</title>
        <meta name="description" content="Create and manage Solana tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Solana Token Manager
        </h1>
        <div className="max-w-2xl mx-auto space-y-6">
          <CreateMintForm />
          <CreateTokenAccountForm />
          <MintToForm />
        </div>
      </div>
    </div>
  );
};

export default Home;

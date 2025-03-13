import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { FC, useEffect, useState } from "react";
import idl from "../idl.json";
import { AnchorCounter } from "../types/anchor_counter";

export interface Props {
  counter;
  setTransactionUrl;
}

export const Increment: FC<Props> = ({ counter, setTransactionUrl }) => {
  const [count, setCount] = useState(0);
  const [program, setProgram] = useState<anchor.Program<AnchorCounter>>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet(); 

  useEffect(() => {
    let provider: anchor.Provider;

    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet, {});
      anchor.setProvider(provider);
    }

    const program = new anchor.Program(
      idl as AnchorCounter
    ) as anchor.Program<AnchorCounter>;
    setProgram(program);
    refreshCount(program);
  }, []);

  const incrementCount = async () => {
    const sig = await program.methods
      .increment()
      .accounts({
        counter: counter,
        user: wallet.publicKey,
      })
      .rpc();

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const refreshCount = async (program) => {
    const counterAccount = await program.account.counter.fetch(counter);
    setCount(counterAccount.count.toNumber());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex gap-4 mb-4">
          <button
            onClick={incrementCount}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Increment Counter
          </button>
          <button
            onClick={() => refreshCount(program)}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Refresh Count
          </button>
        </div>
        <p className="text-lg font-medium">Count: {count}</p>
      </div>
    </div>
  );
};

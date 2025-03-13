import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { FC, useEffect, useState } from "react";
import idl from "../idl.json";
import { AnchorCounter } from "../types/anchor_counter";

export interface Props {
  setCounter;
  setTransactionUrl;
}

export const Initialize: FC<Props> = ({ setCounter, setTransactionUrl }) => {
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
  }, [connection, wallet]);

  const onClick = async () => {
    try {
      if (!program) return;
      const newAccount = anchor.web3.Keypair.generate();

      const sig = await program.methods
        .initialize()
        .accounts({
          counter: newAccount.publicKey,
        })
        .signers([newAccount])
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      setCounter(newAccount.publicKey);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <button
        onClick={onClick}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Initialize Counter
      </button>
    </div>
  );
};

export default Initialize;

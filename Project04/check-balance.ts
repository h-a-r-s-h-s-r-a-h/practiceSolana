import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const keypair = getKeypairFromEnvironment("SECRET_KEY");

const balanceInLamports = await connection.getBalance(keypair.publicKey);

const balanceInSOL = balanceInLamports / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance : `, balanceInSOL, `SOL`);

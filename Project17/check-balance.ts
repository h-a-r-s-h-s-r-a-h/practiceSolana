import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

dotenv.config();

const keypair = await getKeypairFromEnvironment("SECRET_KEY");
console.log(`Keypair Loaded: `, keypair.publicKey.toBase58());

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
console.log(`Connection successfully established `);

const balanceInLamports = await connection.getBalance(keypair.publicKey);
const balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;

console.log(`Balance is: `, balanceInSol, `SOL`);

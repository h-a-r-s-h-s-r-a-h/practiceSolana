import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const balanceInLamports = await connection.getBalance(keypair.publicKey);
const balanceInSOL = balanceInLamports / web3.LAMPORTS_PER_SOL;

console.log(`💸 Balance: `, balanceInSOL, `SOL`);

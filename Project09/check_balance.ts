import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const keypair = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

console.log(`Connection established successfully ✅`);

const balanceInLamports = await connection.getBalance(keypair.publicKey);
const balanceInSOL = balanceInLamports / web3.LAMPORTS_PER_SOL;

console.log(
  `Balance of account ${keypair.publicKey.toBase58()} is `,
  balanceInSOL,
  "SOL"
);

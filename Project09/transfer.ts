import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const senderKeypair = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));

console.log(
  `🔐 Keypair loaded successfully ✅ `,
  senderKeypair.publicKey.toBase58()
);

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const balanceInLamports = await connection.getBalance(senderKeypair.publicKey);
const balanceInSOL = balanceInLamports / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of sender account is `, balanceInSOL, "SOL");

const receiverPublicKey = new web3.PublicKey(
  "AyRNWtd8vEVwebC5zaTNqYMWH1b2tpfGMAXtx5hqtSf5"
);

const transaction = new web3.Transaction();

const LAMPORTS_TO_SEND = 100000;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey: receiverPublicKey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [senderKeypair]
);

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${receiverPublicKey}. `
);
console.log(`Transaction signature is ${signature}!`);

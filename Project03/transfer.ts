import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(`🔐 Loaded Keypair : `, keypair.publicKey.toBase58());

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const balanceInLamports = await connection.getBalance(keypair.publicKey);
const balanceInSOL = balanceInLamports / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance in SOL :`, balanceInSOL, `SOL`);

const toPubKey = new web3.PublicKey(
  "37vW6EMycvnVMhhCdStFxPWkWjd1ySH149WLxeQDUuWK"
);
const balanceInLamportsOfReceiver = await connection.getBalance(toPubKey);
const balanceInSOLOfReceiver =
  balanceInLamportsOfReceiver / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of Receiver: `, balanceInSOLOfReceiver, `SOL`);

const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 1000000000;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: keypair.publicKey,
  toPubkey: toPubKey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [keypair]
);

console.log(`Finished, Sent 💸 ${LAMPORTS_TO_SEND}SOL`);
console.log(`Transaction signature is ${signature}`);

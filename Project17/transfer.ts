import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

dotenv.config();

const keypair = await getKeypairFromEnvironment("SECRET_KEY");
console.log(`Keypair loaded: `, keypair.publicKey.toBase58());

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
console.log(`Connection established successfully`);

const balanceInLamportsOfSender = await connection.getBalance(
  keypair.publicKey
);
const balanceInSolOfSender = balanceInLamportsOfSender / web3.LAMPORTS_PER_SOL;
console.log(`Balance of sender before sending: `, balanceInSolOfSender, `SOL`);

const receiverPubKey = new web3.PublicKey(
  "8weixq4yWSjXtwKZaAdo5Y6z9R6vqwd8LJhUJ6LCGMis"
);
console.log(`Receiver Public key loaded: `, receiverPubKey.toBase58());

const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 1000000000;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: keypair.publicKey,
  toPubkey: receiverPubKey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [keypair]
);

console.log(`Transaction successfully done`);

console.log(`Transaction signature is: `, signature);

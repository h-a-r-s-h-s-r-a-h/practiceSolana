import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
const receiverPublicKey = new web3.PublicKey(
  "EXMyzSh41GBiLoGcqE7QCYz7eNd3uPWcsBER1E8dTJxt"
);

const balanceInLamportsOfSender = await connection.getBalance(
  senderKeypair.publicKey
);
const balanceInSOLOfSender = balanceInLamportsOfSender / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of Sender :- `, balanceInSOLOfSender, `SOL`);

const balanceInLamportsOfReceiver = await connection.getBalance(
  receiverPublicKey
);
const balanceInSOLOfReceiver =
  balanceInLamportsOfReceiver / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of Receiver :- `, balanceInSOLOfReceiver, `SOL`);

const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 4000000000;

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
  `💸 Finished! Sent ${
    LAMPORTS_TO_SEND / web3.LAMPORTS_PER_SOL
  } to address ${receiverPublicKey}`
);

console.log(`Transaction Signature is  ${signature}`);

import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

dotenv.config();

const senderKeypair = await getKeypairFromEnvironment("SECRET_KEY");
console.log(
  `✅ Sender Keypair loaded successfully: `,
  senderKeypair.publicKey.toBase58()
);

const receiverPubKey = new web3.PublicKey(
  "AyRNWtd8vEVwebC5zaTNqYMWH1b2tpfGMAXtx5hqtSf5"
);
console.log(
  `✅ Receiver Keypair loaded successfully: `,
  receiverPubKey.toBase58()
);

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
console.log(`✅ Connection established successfully`);

const balanceInLamportsOfSender = await connection.getBalance(
  senderKeypair.publicKey
);
const balanceInSOLofSender = balanceInLamportsOfSender / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of sender: `, balanceInSOLofSender, `SOL`);

const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 1000000000;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey: receiverPubKey,
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
  } to address ${receiverPubKey}`
);

console.log(`Transaction Signature is  ${signature}`);

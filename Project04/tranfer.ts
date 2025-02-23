import "dotenv/config";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(`🔐 Sender Kepair loaded ✅`);
console.log(`🔐 Public key of Sender : `, keypair.publicKey.toBase58());

const receiverKey = new web3.PublicKey(
  "AyRNWtd8vEVwebC5zaTNqYMWH1b2tpfGMAXtx5hqtSf5"
);
console.log(`🔐 Receiver keypair loaded ✅`);
console.log(`🔐 Receiver public key :- `, receiverKey.toBase58());

const balanceInLamportsOfSender = await connection.getBalance(
  keypair.publicKey
);
const balanceInSOLofSender = balanceInLamportsOfSender / web3.LAMPORTS_PER_SOL;
console.log(`💸 Balance of sender `, balanceInSOLofSender, `SOL`);

const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 1000000000;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: keypair.publicKey,
  toPubkey: receiverKey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [keypair]
);

console.log(
  `Transfer Successed ✅ of SOL `,
  LAMPORTS_TO_SEND / web3.LAMPORTS_PER_SOL,
  `SOL`
);
console.log(`💸 Transaction signature : `, signature);

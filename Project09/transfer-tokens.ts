import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const senderSecretkey = JSON.parse(process.env.SECRET_KEY!);
const sender = web3.Keypair.fromSecretKey(new Uint8Array(senderSecretkey));

console.log(`🔐 Sender Keypair loaded: `, sender.publicKey.toBase58());

const recipient = new web3.PublicKey(
  "GpQXpytEZyhEJoKboN2DncrayTMojJGKjjC9qhqQyqs1"
);

const tokenMintAddress = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
);

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

// Get or create the source token account to store this token
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAddress,
  sender.publicKey
);

// Get or create the destination token account to store this token
const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAddress,
  recipient
);

// Transfer the tokens
const signature = await transfer(
  connection,
  sender,
  sourceTokenAccount.address,
  destinationTokenAccount.address,
  sender,
  1 * MINOR_UNITS_PER_MAJOR_UNITS
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);

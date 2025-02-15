import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔐 Sender Keypair loaded: `, sender.publicKey.toBase58());

const recipient = new web3.PublicKey(
  "GpQXpytEZyhEJoKboN2DncrayTMojJGKjjC9qhqQyqs1"
);

const tokenMintAddress = new web3.PublicKey(
  "9pWKekB5QZ757osan9i8S18GjsvhQAhEeUSApQuM9jNg"
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

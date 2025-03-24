import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

dotenv.config();

const user = await getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
console.log(
  `✅ Connection established successfully: `,
  user.publicKey.toBase58()
);

const tokenMintAccount = new web3.PublicKey(
  "HXW6dELaG4nhfC5WTFwfxZ85dagiqG7YUkLiEdaXFnGp"
);

const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Created token Account: ${link}`);

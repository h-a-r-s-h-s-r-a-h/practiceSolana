import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";

dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
const user = await getKeypairFromEnvironment("SECRET_KEY");
console.log(
  `✅ Connection successfully established with user: `,
  user.publicKey.toBase58()
);

const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Finished! Created token mint! successfully: ${link}`);

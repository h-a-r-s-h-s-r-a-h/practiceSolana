import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
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

import * as dotenv from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

dotenv.config();

const keypair = await getKeypairFromEnvironment("SECRET_KEY");
console.log(`Keypair loaded: `, keypair.publicKey.toBase58());

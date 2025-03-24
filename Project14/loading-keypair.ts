import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

dotenv.config();

const keypair = await getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔐 Keypair loaded successfully ✅`);
console.log(`🔐 Public key: `, keypair.publicKey.toBase58());
console.log(`🔐 Private key: `, keypair.secretKey);

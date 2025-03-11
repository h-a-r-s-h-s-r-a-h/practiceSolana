import * as dotenv from "dotenv";
import { Keypair } from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";

dotenv.config();

const keypair3 = await getKeypairFromFile("my-keypair.json"); // Load keypair from file

console.log("🔐 Keypair Generated ✅");
console.log(`🔐 Public Key: `, keypair3.publicKey.toBase58());
console.log(`🔐 Private Key: `, keypair3.secretKey);
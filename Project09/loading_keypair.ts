import { Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

console.log("🔐 Keypair loaded successfully ✅");
console.log(`🔐 Private key :- `, keypair.publicKey.toBase58());
console.log(`🔐 Public key :- `, keypair.secretKey);

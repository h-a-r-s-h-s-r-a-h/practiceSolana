import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔐 Keypair loaded successfully ✅`);
console.log(`🔐 Public Key is :- `, keypair.publicKey.toBase58());
console.log(`🔐 Private key is :- `, keypair.secretKey);

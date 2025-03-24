import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log("🔐 Keypair Generated ✅");
console.log(`🔐 Private key :- `, keypair.publicKey.toBase58());
console.log(`🔐 Public key :- `, keypair.secretKey);

import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔐 Keypair loaded`);
console.log(`🔐 Private Key :- `, keypair.secretKey);
console.log(`🔐 Public Key :- `, keypair.publicKey.toBase58());

import * as web3 from "@solana/web3.js";

const keypair = web3.Keypair.generate();

console.log(`🔐 Keypair Generated: `);
console.log(`🔐 Private key: `, keypair.secretKey);
console.log(`🔐 Public key: `, keypair.publicKey.toBase58());

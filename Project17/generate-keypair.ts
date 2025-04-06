import * as web3 from "@solana/web3.js";

const keypair = web3.Keypair.generate();

console.log(`Keypair generated: `, keypair.secretKey);
console.log(`Keypair generated: `, keypair.publicKey.toBase58());

import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import * as metaplex from "@metaplex-foundation/mpl-token-metadata";
import * as solanaHelper from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import * as metaplexUmi from "@metaplex-foundation/umi";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const Keypair = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));

console.log(`🔐 Keypair loaded successfully ✅`);
console.log(`🔐 Private key :- `, Keypair.secretKey);
console.log(`🔐 Public Key :- `, Keypair.publicKey.toBase58());

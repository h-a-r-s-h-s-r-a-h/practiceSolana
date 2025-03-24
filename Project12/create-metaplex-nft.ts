import * as dotenv from "dotenv";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";

dotenv.config();
const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromEnvironment("SECRET_KEY");

console.log("Loaded user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionAddress = publicKey(
  "3PBVYCFVmnZw3nEPtyYqeEJkJGJCtsquubpq9f6og48P"
);

console.log(`Creating NFT...`);

const mint = await generateSigner(umi);
console.log(mint.publicKey);

const transaction = await createNft(umi, {
  mint,
  name: "My NFT",
  uri: "https://walrus.tusky.io/OHFH6jpLcd-Js2fWI2doHETk2IowvY-eFNM-Qi5HaZA",
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectionAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(
  `🖼️ Created NFT! Address is ${getExplorerLink(
    "address",
    createdNft.mint.publicKey,
    "devnet"
  )}`
);

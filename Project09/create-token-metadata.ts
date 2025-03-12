import * as dotenv from "dotenv";
import * as web3 from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

dotenv.config();

const secretKey = JSON.parse(process.env.SECRET_KEY!);
const user = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log(`🔐 Keypair loaded successfully! ✅ `, user.publicKey.toBase58());

const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);
console.log(`Connection successfully established ✅`);

const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const tokenMintAddress = new web3.PublicKey(
  "7AfMSjU3LhTUUx5mnvqUVyuwGULCR6VXjDBt5t7ZNZVu"
);

const metadata = {
  name: "Solana Training Token",
  symbol: "TRAINING",
  // Arweave / IPFS / Pinata etc link using metaplex standard for offchain data
  uri: "https://walrus.tusky.io/AdjY0apD3PsZlhEJBCo-6uWGt4LUAESLpiQJhnOU-II",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const metadataPDAAndBump = web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAddress.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new web3.Transaction();

const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAddress,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadata,
        isMutable: true,
      },
    }
  );

transaction.add(createMetadataAccountInstruction);
const transactionSignature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [user]
);

const transactionLink = getExplorerLink(
  "transaction",
  transactionSignature,
  "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);

const tokenMintLink = getExplorerLink(
  "address",
  tokenMintAddress.toString(),
  "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}`);

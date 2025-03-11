import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKeyFrom = new PublicKey(
  "7CurE1AiwggBjA48er95GL3fboBjdFFqQPSXJZKS5Jrc"
);
const publicKeyTO = new PublicKey(
  "F9fnwCvJNUsppVXjBLVNp5RTYswsa4fgB7Z46SifJh3P"
);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const balanceInLamportsFrom = await connection.getBalance(publicKeyFrom);
const balanceInLamportsTo = await connection.getBalance(publicKeyTO);

const balanceInSOLFrom = balanceInLamportsFrom / LAMPORTS_PER_SOL;
const balanceInSOLTo = balanceInLamportsTo / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet from transfer strats at address ${publicKeyFrom} is ${balanceInSOLFrom}!`
);

console.log(
  `💰 Finished! The balance for the wallet at which we send at address ${publicKeyTO} is ${balanceInSOLTo}!`
);

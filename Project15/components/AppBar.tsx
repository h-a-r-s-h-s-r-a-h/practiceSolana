import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "../style/Home.module.css";
import Image from "next/image";

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Image src="/solanaLogo.png" height={30} width={200} alt="solanaLogo" />
      <span>Wallet-Adapter Example</span>
      <WalletMultiButton />
    </div>
  );
};

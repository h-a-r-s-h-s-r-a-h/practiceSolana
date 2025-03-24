import React from "react";
import "./globals.css"; // ✅ Import global styles here
import type { AppProps } from "next/app";
import WalletContextProvider from "../components/WalletContextProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;

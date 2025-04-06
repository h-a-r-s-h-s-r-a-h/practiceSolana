import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useConnection,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import idl from "../idl.json";
import { AnchorMovieReviewProgram } from "../types/anchor_movie_review_program";

interface SolanaContextType {
  program?: anchor.Program<AnchorMovieReviewProgram>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  commentId: string;
  setCommentId: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  transactionUrl: string;
  setTransactionUrl: React.Dispatch<React.SetStateAction<string>>;
  moviePda: anchor.web3.PublicKey | null;
  mint: anchor.web3.PublicKey | null;
  tokenAccount: anchor.web3.PublicKey | null;
  contextPublicKey: anchor.web3.PublicKey | null;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [contextPublicKey, setContextPublicKey] =
    useState<anchor.web3.PublicKey | null>(null);
  const { publicKey } = useWallet();

  const [program, setProgram] =
    useState<anchor.Program<AnchorMovieReviewProgram>>();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [transactionUrl, setTransactionUrl] = useState("");
  const [moviePda, setMoviePda] = useState<anchor.web3.PublicKey | null>(null);
  const [commentPda, setCommentPda] = useState<anchor.web3.PublicKey | null>(
    null
  );
  const [mint, setMint] = useState<anchor.web3.PublicKey | null>(null);
  const [tokenAccount, setTokenAccount] =
    useState<anchor.web3.PublicKey | null>(null);

  useEffect(() => {
    if (!wallet) return;
    setContextPublicKey(publicKey);

    let provider: anchor.Provider;
    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet, {});
      anchor.setProvider(provider);
    }

    const programInstance = new anchor.Program(
      idl as AnchorMovieReviewProgram
    ) as anchor.Program<AnchorMovieReviewProgram>;

    setProgram(programInstance);

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(title), wallet.publicKey.toBuffer()],
      programInstance.programId
    );
    setMoviePda(pda);

    const [commentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("comment"),
        Buffer.from(title),
        wallet.publicKey.toBuffer(),
        Buffer.from(commentId),
      ],
      programInstance.programId
    );
    setCommentPda(commentPDA);

    const [mintAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint")],
      programInstance.programId
    );
    setMint(mintAddress);
  }, [connection, wallet, title]);

  useEffect(() => {
    if (!wallet || !mint) return;
    (async () => {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        wallet.publicKey
      );
      setTokenAccount(associatedTokenAddress);
    })();
  }, [mint, wallet]);

  const contextValue = React.useMemo(
    () => ({
      program,
      title,
      setTitle,
      comment,
      setComment,
      commentId,
      setCommentId,
      description,
      setDescription,
      rating,
      setRating,
      transactionUrl,
      setTransactionUrl,
      moviePda,
      mint,
      tokenAccount,
      contextPublicKey,
    }),
    [
      program,
      title,
      setTitle,
      comment,
      setComment,
      commentId,
      setCommentId,
      description,
      setDescription,
      rating,
      setRating,
      transactionUrl,
      setTransactionUrl,
      moviePda,
      mint,
      tokenAccount,
      contextPublicKey,
    ]
  );

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = (): SolanaContextType => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};

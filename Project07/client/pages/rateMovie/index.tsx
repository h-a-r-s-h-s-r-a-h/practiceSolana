import React, { useState } from "react";
import { NextPage } from "next";

import { useSolana } from "../../contexts/SolanaContext";

const MAX_DESCRIPTION_LENGTH = 50;
const MAX_TITLE_LENGTH = 20;
const MAX_RATING = 5;
const MIN_RATING = 1;

const Home: NextPage = () => {
  const { program, moviePda, contextPublicKey } = useSolana();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [transactionUrl, setTransactionUrl] = useState("");

  const addReview = async () => {
    if (!program || !moviePda) return;

    if (
      title.length > MAX_TITLE_LENGTH ||
      description.length > MAX_DESCRIPTION_LENGTH ||
      rating < MIN_RATING ||
      rating > MAX_RATING
    ) {
      alert(
        `Please ensure the following constraints are met:\n` +
          `- Title max length is ${MAX_TITLE_LENGTH} characters\n` +
          `- Description max length is ${MAX_DESCRIPTION_LENGTH} characters\n` +
          `- Rating must be between ${MIN_RATING} and ${MAX_RATING}`
      );
      return;
    }

    try {
      const sig = await program.methods
        .addMovieReview(title, description, rating)
        .accounts({})
        .rpc();
      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    } catch (error) {
      console.error("Error adding movie review:", error);
    }
  };

  return (
    <div>
      {contextPublicKey ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
          <h1 className="text-3xl font-bold mb-6">Solana Movie Reviews</h1>

          <div className="border p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-sm text-red-500 mb-4">
              Note: Title max length is 20 characters, description max length is
              50 characters, and rating must be between 1 and 5.
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie Title"
              className="border p-2 m-2 w-full bg-gray-700 text-white rounded"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border p-2 m-2 w-full bg-gray-700 text-white rounded"
            />
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Rating (1-5)"
              className="border p-2 m-2 w-full bg-gray-700 text-white rounded"
            />
            <button
              onClick={addReview}
              className="bg-blue-500 text-white px-4 py-2 m-2 w-full rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>

          {transactionUrl && (
            <p className="mt-4">
              View Transaction:{" "}
              <a
                href={transactionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {transactionUrl}
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <p className="text-lg font-semibold text-center text-red-500">
            Connect your wallet
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

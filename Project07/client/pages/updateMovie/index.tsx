import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSolana } from "../../contexts/SolanaContext";
import { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  const { title, description, rating } = router.query;

  const [movieTitle, setMovieTitle] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [movieRating, setMovieRating] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { program, moviePda, contextPublicKey } = useSolana();

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (title && description && rating) {
      setMovieTitle(title as string);
      setMovieDescription(description as string);
      setMovieRating(Number(rating));
      setNewDescription(description as string);
      setNewRating(Number(rating));
    }
    fetchReviews(title as string);
  }, [title, description, rating]);

  const fetchReviews = async (title: string) => {
    if (!program) return;
    try {
      const allMovieReviews = await program.account.movieAccountState.all();
      const filteredReviews = allMovieReviews
        .map((a) => a.account)
        .filter((review) => review.title.toLowerCase() === title.toLowerCase());
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const updateReview = async (reviewTitle) => {
    if (!program) return;
    try {
      const newDescription = prompt("Enter new description:");
      const newRating = Number(prompt("Enter new rating (1-5):"));
      if (!newDescription || isNaN(newRating) || newRating < 1 || newRating > 5)
        return;
      await program.methods
        .updateMovieReview(reviewTitle, newDescription, newRating)
        .rpc();
      fetchReviews(movieTitle);
    } catch (error) {
      console.error("Error updating movie review:", error);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4 py-12">
      {contextPublicKey ? (
        <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Update Movie Review</h2>

          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-900 p-12 rounded-2xl shadow-lg border border-gray-800 hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-blue-500 flex items-center justify-center text-center"
            >
              <div className="mb-4">
                <p className="text-lg">
                  🎬 <span className="font-semibold">{review.title}</span>
                </p>
                <p className="text-gray-400 text-sm">{review.description}</p>
                <p className="text-yellow-400 text-lg font-bold">
                  ⭐ {review.rating} / 5
                </p>
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
              onClick={() => updateReview(title as string)}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Review"}
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
          <p className="text-xl font-semibold text-red-400 bg-gray-800 px-8 py-4 rounded-lg shadow-lg">
            🔗 Connect your wallet to view movie reviews!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

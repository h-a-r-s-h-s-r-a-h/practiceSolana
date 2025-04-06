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

  const { program, moviePda, contextPublicKey } = useSolana();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (title && description && rating) {
      setMovieTitle(title as string);
      setMovieDescription(description as string);
      setMovieRating(Number(rating));
    }
    fetchReviews(title as string);
  }, [title, description, rating]);

  const fetchReviews = async (title) => {
    if (!program) return;
    try {
      const allMovieReviews = await program.account.movieAccountState.all();

      const filteredReviews = allMovieReviews
        .map((a) => a.account)
        .filter((review) => review.title.toLowerCase() === title.toLowerCase());
      console.log(filteredReviews);
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4 py-12">
      {contextPublicKey ? (
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl font-extrabold text-white border-b-4 border-blue-500 pb-3 text-center mb-10">
            🎬 Movie Reviews
          </h2>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-900 p-12 rounded-2xl shadow-lg border border-gray-800 hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-blue-500 flex items-center justify-center text-center"
            >
              <div>
                <h3 className="text-4xl font-bold text-blue-400">
                  {review.title}
                </h3>
                <p className="text-gray-300 mt-6 text-lg">
                  {review.description}
                </p>
                <p className="mt-6 text-green-400 font-semibold text-2xl flex items-center justify-center">
                  ⭐ {review.rating} / 5
                </p>
              </div>
            </div>
          ))}
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

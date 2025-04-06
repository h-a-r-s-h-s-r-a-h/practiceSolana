import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useSolana } from "../../contexts/SolanaContext";

const Home: NextPage = () => {
  const { program, moviePda, contextPublicKey } = useSolana();
  const [reviews, setReviews] = useState([]);

  const fetchOnlyActiveAccountReviews = async () => {
    if (!program || !contextPublicKey) return;

    try {
      const allMovieReviews = await program.account.movieAccountState.all([
        {
          memcmp: {
            offset: 8,
            bytes: contextPublicKey.toBase58(),
          },
        },
      ]);

      setReviews(allMovieReviews.map((a) => a.account));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const deleteReview = async (title: string) => {
    if (!program) return;
    try {
      await program.methods.deleteMovieReview(title).rpc();
      fetchOnlyActiveAccountReviews();
    } catch (error) {
      console.error("Error deleting movie review:", error);
    }
  };

  useEffect(() => {
    fetchOnlyActiveAccountReviews();
  }, [program]);

  return (
    <div className="bg-gray-950 min-h-screen py-12">
      {contextPublicKey ? (
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-white border-b-4 border-blue-500 pb-3 text-center mb-10">
            🎬 Movie Reviews
          </h2>
          {reviews.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <li
                  key={index}
                  className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-blue-500"
                >
                  <h3 className="text-2xl font-bold text-blue-400">
                    {review.title}
                  </h3>
                  <p className="text-gray-300 mt-2 text-sm italic">
                    {review.description}
                  </p>
                  <p className="mt-3 text-green-400 font-semibold text-lg flex items-center">
                    ⭐ {review.rating} / 5
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
                    <Link
                      href={{
                        pathname: "/updateMovie",
                        query: {
                          title: review.title,
                          description: review.description,
                          rating: review.rating,
                        },
                      }}
                      passHref
                    >
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:scale-105">
                        Update
                      </button>
                    </Link>
                    <Link
                      href={{
                        pathname: "/details",
                        query: {
                          title: review.title,
                          description: review.description,
                          rating: review.rating,
                        },
                      }}
                      passHref
                    >
                      <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:scale-105">
                        📜 See Full Detail
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteReview(review.title)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl font-semibold text-center text-gray-400 mt-10">
              You have not added any movies yet.
            </p>
          )}
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

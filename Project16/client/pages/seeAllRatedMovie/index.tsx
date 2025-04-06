import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useSolana } from "../../contexts/SolanaContext";

const Home: NextPage = () => {
  const { program, moviePda, contextPublicKey } = useSolana();
  const [reviews, setReviews] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentId, setCommentId] = useState("");
  const [comments, setComments] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [editText, setEditText] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchReviews = async () => {
    if (!program) return;
    try {
      const allMovieReviews = await program.account.movieAccountState.all();
      setReviews(allMovieReviews.map((a) => a.account));
      // Fetch comments for each review
      await fetchCommentsForMovies(allMovieReviews.map((a) => a.account.title));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchCommentsForMovies = async (movieTitles) => {
    if (!program) return;
    try {
      const allComments = await program.account.commentAccountState.all();
      const commentsByMovie = {};
      
      movieTitles.forEach(title => {
        commentsByMovie[title] = allComments
          .map(a => a.account)
          .filter(comment => comment.movieTitle === title)
          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      });
      
      setComments(commentsByMovie);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (movieTitle) => {
    if (!program || !contextPublicKey) return;
    try {
      const uniqueCommentId = `cmt_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;

      const tx = await program.methods
        .addComment(movieTitle, commentText[movieTitle], uniqueCommentId)
        .accounts({
          commenter: contextPublicKey,
        })
        .rpc();

      // Clear comment and hide comment box after submission
      setCommentText((prev) => ({ ...prev, [movieTitle]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [movieTitle]: false }));
      
      // Wait for transaction confirmation
      await program.provider.connection.confirmTransaction(tx);
      
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateComment = async (movieTitle, commentId, newText) => {
    if (!program || !contextPublicKey) return;
    try {
      const tx = await program.methods
        .updateComment(movieTitle, commentId, newText)
        .accounts({
          commenter: contextPublicKey,
        })
        .rpc();

      // Clear edit state
      setEditingComment(prev => ({ ...prev, [commentId]: false }));
      setEditText(prev => ({ ...prev, [commentId]: "" }));

      // Wait for transaction confirmation
      await program.provider.connection.confirmTransaction(tx);
      
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Effect to fetch reviews and comments
  useEffect(() => {
    fetchReviews();
  }, [program, refreshTrigger]);

  return (
    <div className="bg-gray-950 min-h-screen py-12">
      {contextPublicKey ? (
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-white border-b-4 border-blue-500 pb-3 text-center mb-10">
            🎬 Movie Reviews
          </h2>
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

                {/* Comments Section */}
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">Comments</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {comments[review.title]?.map((comment, commentIndex) => (
                      <div key={commentIndex} className="bg-gray-800 p-3 rounded-lg">
                        {editingComment[comment.commentId] ? (
                          <div>
                            <textarea
                              value={editText[comment.commentId]}
                              onChange={(e) => setEditText(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                              rows={2}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleUpdateComment(review.title, comment.commentId, editText[comment.commentId])}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition flex-1"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(prev => ({ ...prev, [comment.commentId]: false }));
                                  setEditText(prev => ({ ...prev, [comment.commentId]: "" }));
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300 text-sm">{comment.commentText}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-gray-400 text-xs">
                                {new Date(Number(comment.timestamp) * 1000).toLocaleString()}
                              </p>
                              {comment.commenter.toString() === contextPublicKey.toString() && (
                                <button
                                  onClick={() => {
                                    setEditingComment(prev => ({ ...prev, [comment.commentId]: true }));
                                    setEditText(prev => ({ ...prev, [comment.commentId]: comment.commentText }));
                                  }}
                                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
                                >
                                  ✏️ Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!comments[review.title] || comments[review.title].length === 0) && (
                      <p className="text-gray-500 text-sm italic">No comments yet</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-6">
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
                    <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-5 py-2 rounded-lg font-semibold transition hover:scale-105">
                      📜 See Full Detail
                    </button>
                  </Link>

                  {!showCommentBox[review.title] ? (
                    <button
                      onClick={() =>
                        setShowCommentBox((prev) => ({
                          ...prev,
                          [review.title]: true,
                        }))
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                    >
                      💬 Add Comment
                    </button>
                  ) : (
                    <div className="mt-4">
                      <textarea
                        value={commentText[review.title] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [review.title]: e.target.value,
                          }))
                        }
                        placeholder="Write your comment here..."
                        className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAddComment(review.title)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition flex-1"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setShowCommentBox((prev) => ({
                              ...prev,
                              [review.title]: false,
                            }));
                            setCommentText((prev) => ({
                              ...prev,
                              [review.title]: "",
                            }));
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
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

import React, { useState, useEffect } from "react";
import axios from "axios";

const Feedback = () => {
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  // 🔴 Replace this with real ID later
  const promiseId = "69a6af84dea6363b079b02ac";

  // GET feedback
  const getFeedback = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/feedback/${promiseId}`
      );
      setFeedbackList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeedback();
  }, []);

  // CREATE feedback
  const addFeedback = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/feedback/${promiseId}`,
        { comment }
      );

      setComment("");
      getFeedback();
    } catch (err) {
      console.log(err);
    }
  };
  // VOTE FUNCTION
const vote = async (id, type) => {
  try {
    await axios.post(
      `http://localhost:5000/api/feedback/${id}/vote`,
      { type }
    );
    getFeedback();
  } catch (err) {
    console.log(err);
  }
};

// DELETE FUNCTION
const deleteFeedback = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/feedback/${id}`
    );
    getFeedback();
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Citizen Feedback
      </h1>

      {/* Input */}
      <textarea
        className="w-full p-3 border border-gray-300 rounded mb-3"
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={addFeedback}
       className="bg-parliament-600 text-white px-4 py-2 rounded hover:bg-parliament-700"
      >
        Submit Feedback
      </button>

      <hr className="my-6" />

      {/* Display feedback */}
    {feedbackList.map((item) => (
  <div
    key={item._id}
    className="bg-white p-4 mb-4 rounded shadow border"
  >
    {/* COMMENT */}
    <p className="text-gray-800 font-medium">{item.comment}</p>

    {/* SENTIMENT */}
    <p className="text-sm mt-1 text-gray-500">
      Sentiment: {item.sentiment}
    </p>

    {/* BUTTONS */}
    <div className="mt-3 flex gap-3">

      {/* 👍 UPVOTE */}
      <button
        onClick={() => vote(item._id, "up")}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        👍 {item.upvotes}
      </button>

      {/* 👎 DOWNVOTE */}
      <button
        onClick={() => vote(item._id, "down")}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        👎 {item.downvotes}
      </button>

      {/* DELETE */}
      <button
        onClick={() => deleteFeedback(item._id)}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>

    </div>
  </div>
))}
    </div>
  );
};

export default Feedback;
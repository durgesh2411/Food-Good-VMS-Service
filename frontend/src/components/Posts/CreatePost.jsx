import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../lib/constant";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${backendUrl}/posts/`,
        { content },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message); // Use the dynamic message from backend
        setContent("");
        setTimeout(() => {
          navigate("/posts"); // Navigate back to posts list
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError(
        error.response?.data?.message ||
        "Failed to create post. Make sure you are logged in as a volunteer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Post</h1>
            <p className="text-gray-600">
              Share your volunteer experience with the community. Your post will be reviewed by an admin before being published.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your volunteer experience, achievements, or community updates..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters required
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  loading || !content.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                } transition-colors duration-200`}
              >
                {loading ? "Creating Post..." : "Create Post"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Post Guidelines:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share authentic volunteer experiences</li>
              <li>• Keep content respectful and professional</li>
              <li>• Posts are reviewed before publication</li>
              <li>• Only volunteers can create posts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

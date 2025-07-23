import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../lib/constant";

const VolunteerMyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/posts/volunteer/myPosts`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setPosts(response.data.data.posts.reverse());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch your posts. Please make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/posts/${postId}`, {
        withCredentials: true,
      });

      // Remove post from local state
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending Review
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
            <button
              onClick={() => navigate("/posts/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              + Create New Post
            </button>
          </div>
          <p className="text-gray-600">
            Manage your volunteer posts. Pending posts are awaiting admin approval.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">Posts</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first post to share your volunteer experience!
            </p>
            <button
              onClick={() => navigate("/posts/create")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {post.fullName}
                      </h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/posts/edit/${post._id}`)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>

                {post.status === "pending" && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      This post is awaiting admin approval before it becomes visible to other users.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/posts")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to All Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMyPosts;

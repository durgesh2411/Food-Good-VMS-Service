import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../lib/constant";

function PostAdmin() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const [pendingResponse, approvedResponse] = await Promise.all([
        axios.get(`${backendUrl}/posts/admin/pending`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/posts/admin/approved`, {
          withCredentials: true,
        })
      ]);

      if (pendingResponse.data.success) {
        setPendingPosts(pendingResponse.data.data.posts.reverse());
      }

      if (approvedResponse.data.success) {
        setApprovedPosts(approvedResponse.data.data.posts.reverse());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    try {
      const response = await axios.patch(`${backendUrl}/posts/admin/${postId}/approve`, {}, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Post approved successfully!");
        fetchPosts(); // Refresh the posts
      }
    } catch (error) {
      console.error("Error approving post:", error);
      alert("Failed to approve post");
    }
  };

  const handleReject = async (postId) => {
    try {
      const response = await axios.patch(`${backendUrl}/posts/admin/${postId}/reject`, {}, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Post rejected successfully!");
        fetchPosts(); // Refresh the posts
      }
    } catch (error) {
      console.error("Error rejecting post:", error);
      alert("Failed to reject post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderPosts = (posts) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">No Posts</div>
          <h3 className="text-2xl font-medium text-gray-800 mb-2">
            {activeTab === "pending" ? "No pending posts" : "No approved posts"}
          </h3>
          <p className="text-gray-600">
            {activeTab === "pending"
              ? "All posts have been reviewed!"
              : "No posts have been approved yet."
            }
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  By {post.fullName || "Unknown"}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {post.status === "approved" ? "Approved" : "Pending"}
                </span>
              </div>
              {activeTab === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(post._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(post._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex-1"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
          <p className="text-gray-600 mt-2">Review and manage volunteer posts</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Posts ({pendingPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "approved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Approved Posts ({approvedPosts.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "pending" && renderPosts(pendingPosts)}
        {activeTab === "approved" && renderPosts(approvedPosts)}

        {/* Statistics */}
        {(pendingPosts.length > 0 || approvedPosts.length > 0) && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Post Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pendingPosts.length + approvedPosts.length}
                </div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {approvedPosts.length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingPosts.length}
                </div>
                <div className="text-sm text-gray-500">Pending Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((approvedPosts.length / (pendingPosts.length + approvedPosts.length)) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-500">Approval Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostAdmin;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../lib/constant";

const PostCardAdmin = ({ posts }) => {
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const handleApprove = (postId) => {
    axios
      .patch(`/api/v1/posts/admin/${postId}`)
      .then((response) => {
        if (response.data.success) {
          window.location.reload(0);
        } else {
          toast.error("Error approving post.");
        }
      })
      .catch((error) => {
        toast.error("Error approving post.");
        console.error("Error approving post:", error);
      });
  };

  const toggleExpanded = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const truncateContent = (content, postId, limit = 100) => {
    if (!content || content.length <= limit) {
      return content;
    }

    const isExpanded = expandedPosts.has(postId);
    const displayContent = isExpanded ? content : content.substring(0, limit) + "...";

    return (
      <div className="space-y-2">
        <span className="text-gray-600 break-words whitespace-pre-wrap">
          {displayContent}
        </span>
        <button
          onClick={() => toggleExpanded(postId)}
          className="block text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Approve
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                <span className="text-gray-900 font-medium">
                  {post.fullName}
                </span>
              </td>
              <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm max-w-xs">
                {truncateContent(post.content, post._id, 100)}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                <span className="text-gray-600">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 border-b border-gray-200 bg-white text-center text-sm">
                <button
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
                  onClick={() => handleApprove(post._id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostCardAdmin;

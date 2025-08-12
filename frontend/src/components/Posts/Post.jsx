import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard"; // Ensure you have a PostCard component
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router
import { useTranslation } from "react-i18next";
import { backendUrl } from "../../lib/constant";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  const fetchApprovedPosts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/posts/volunteer/allPosts`, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log(response.data.data.posts);
        setPosts(response.data.data.posts.reverse());
      } else {
        setError("Error fetching posts: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const handleMyPosts = () => {
    navigate("/posts/my-posts");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("posts.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {t("posts.title")}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleMyPosts}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                {t("posts.myPosts")}
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                {t("posts.create")}
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-center sm:text-left">
            {t("posts.description")}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard post={post} key={post._id} />
            ))}
          </div>
        ) : (
                    <div className="text-center py-12">
            <div className="text-6xl mb-4 text-indigo-500 font-bold">✎</div>
            <h3 className="text-2xl font-medium text-gray-800 mb-2">
              {t("posts.noPosts")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("posts.noPostsDesc")}
            </p>
            <button
              onClick={handleCreatePost}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              {t("posts.create")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;

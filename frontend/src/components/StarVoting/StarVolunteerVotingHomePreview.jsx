import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Award, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { backendUrl } from "../../lib/constant";

const StarVolunteerVoting = () => {
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchTopVolunteers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCurrentUser(response.data.data);
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const fetchTopVolunteers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/star-votes/volunteers/public`, {
        withCredentials: true,
      });
      if (response.data.success) {
        // Get top 3 volunteers with most votes
        const sortedVolunteers = response.data.data
          .sort((a, b) => b.starVotes - a.starVotes)
          .slice(0, 3);
        setTopVolunteers(sortedVolunteers);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only show to regular users
  if (!currentUser || currentUser.role !== "user") {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
            <Award className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-600" />
            Star Volunteers Spotlight
          </h2>
          <p className="text-gray-600 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed px-4 sm:px-0">
            Recognize outstanding volunteers in our community! Check out our top-voted star volunteers
            and cast your vote to help others discover amazing contributors.
          </p>

          <Link
            to="/vote-stars"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#2b3359] to-[#3d4373] text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full hover:from-[#3d4373] hover:to-[#4a5282] transition-all duration-300 font-semibold text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            Vote for Star Volunteers
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-base">Loading top volunteers...</span>
          </div>
        ) : topVolunteers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {topVolunteers.map((volunteer, index) => (
              <div
                key={volunteer._id}
                className={`bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 md:p-8 border-2 relative ${
                  index === 0
                    ? "border-yellow-400 ring-2 ring-yellow-200"
                    : "border-gray-200"
                }`}
              >
                {/* Ranking Badge */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold text-xs sm:text-sm ${
                  index === 0 ? "bg-yellow-500" :
                  index === 1 ? "bg-gray-400" : "bg-orange-400"
                }`}>
                  {index === 0 ? "#1" : index === 1 ? "#2" : "#3"}
                </div>

                <div className="text-center pt-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    {volunteer.avatar ? (
                      <img
                        src={volunteer.avatar}
                        alt={volunteer.fullName}
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                        {volunteer.fullName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                    {volunteer.fullName}
                  </h3>

                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                    <span className="text-base sm:text-lg md:text-xl font-bold text-yellow-600">
                      {volunteer.starVotes}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-1">
                      {volunteer.starVotes === 1 ? "vote" : "votes"}
                    </span>
                  </div>

                  {index === 0 && volunteer.starVotes > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      Top Star Volunteer
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 md:py-16 max-w-2xl mx-auto">
            <Award className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 mb-2 sm:mb-4">
              Be the first to vote!
            </h3>
            <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed px-4 sm:px-0">
              No volunteers have been voted for yet. Help us recognize outstanding volunteers!
            </p>
            <Link
              to="/vote-stars"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2b3359] to-[#3d4373] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:from-[#3d4373] hover:to-[#4a5282] transition-all duration-300 font-medium text-sm sm:text-base"
            >
              <Heart className="h-4 w-4" />
              Start Voting
            </Link>
          </div>
        )}

        {topVolunteers.length > 0 && (
          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              to="/vote-stars"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all text-sm sm:text-base md:text-lg"
            >
              View all volunteers and vote
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarVolunteerVoting;

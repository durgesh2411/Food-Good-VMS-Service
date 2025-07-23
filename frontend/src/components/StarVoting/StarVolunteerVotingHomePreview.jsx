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
      const response = await axios.get(`${backendUrl}/star-votes/volunteers`, {
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
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-yellow-500" />
            Star Volunteers Spotlight
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Recognize outstanding volunteers in our community! Check out our top-voted star volunteers
            and cast your vote to help others discover amazing contributors.
          </p>

          <Link
            to="/vote-stars"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="h-5 w-5" />
            Vote for Star Volunteers
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-2 text-gray-600">Loading top volunteers...</span>
          </div>
        ) : topVolunteers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topVolunteers.map((volunteer, index) => (
              <div
                key={volunteer._id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-2 relative ${
                  index === 0
                    ? "border-yellow-400 ring-2 ring-yellow-200"
                    : "border-gray-200"
                }`}
              >
                {/* Ranking Badge */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold text-sm ${
                  index === 0 ? "bg-yellow-500" :
                  index === 1 ? "bg-gray-400" : "bg-orange-400"
                }`}>
                  {index === 0 ? "🥇 #1" : index === 1 ? "🥈 #2" : "🥉 #3"}
                </div>

                <div className="text-center pt-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    {volunteer.avatar ? (
                      <img
                        src={volunteer.avatar}
                        alt={volunteer.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-blue-600">
                        {volunteer.fullName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {volunteer.fullName}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold text-yellow-600">
                      {volunteer.starVotes}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {volunteer.starVotes === 1 ? "vote" : "votes"}
                    </span>
                  </div>

                  {index === 0 && volunteer.starVotes > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      ⭐ Top Star Volunteer
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Be the first to vote!
            </h3>
            <p className="text-gray-500 mb-6">
              No volunteers have been voted for yet. Help us recognize outstanding volunteers!
            </p>
            <Link
              to="/vote-stars"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium"
            >
              <Heart className="h-4 w-4" />
              Start Voting
            </Link>
          </div>
        )}

        {topVolunteers.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/vote-stars"
              className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all"
            >
              View all volunteers and vote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarVolunteerVoting;

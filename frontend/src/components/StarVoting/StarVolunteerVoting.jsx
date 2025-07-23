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
                volunteerId: volunteer._id,
                hasVoted: voteResponse.data.data.hasVoted,
              };
            } catch (error) {
              return { volunteerId: volunteer._id, hasVoted: false };
            }
          });

          const voteResults = await Promise.all(votePromises);
          const votesMap = {};
          voteResults.forEach((result) => {
            votesMap[result.volunteerId] = result.hasVoted;
          });
          setUserVotes(votesMap);
        }
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const handleVoteClick = (volunteer) => {
    if (!currentUser) {
      alert("Please login to vote for volunteers");
      return;
    }

    if (currentUser.role !== "user") {
      alert("Only regular users can vote for volunteers");
      return;
    }

    if (userVotes[volunteer._id]) {
      alert("You have already voted for this volunteer");
      return;
    }

    setSelectedVolunteer(volunteer);
    setShowModal(true);
  };

  const submitVote = async () => {
    if (!selectedVolunteer) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/star-votes`,
        {
          volunteerId: selectedVolunteer._id,
          reason: voteReason,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Thank you for voting! Your star vote has been recorded.");
        setUserVotes({
          ...userVotes,
          [selectedVolunteer._id]: true,
        });

        // Update the volunteer's vote count
        setVolunteers(volunteers.map(v =>
          v._id === selectedVolunteer._id
            ? { ...v, starVotes: v.starVotes + 1 }
            : v
        ));

        setShowModal(false);
        setVoteReason("");
        setSelectedVolunteer(null);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to submit vote. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeVote = async (volunteerId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/star-votes/${volunteerId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserVotes({
          ...userVotes,
          [volunteerId]: false,
        });

        // Update the volunteer's vote count
        setVolunteers(volunteers.map(v =>
          v._id === volunteerId
            ? { ...v, starVotes: Math.max(0, v.starVotes - 1) }
            : v
        ));

        alert("Your vote has been removed.");
      }
    } catch (error) {
      console.error("Error removing vote:", error);
      alert("Failed to remove vote. Please try again.");
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
            Vote for Star Volunteers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Recognize outstanding volunteers in our community! Your vote helps highlight
            volunteers who go above and beyond in their service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  {volunteer.avatar ? (
                    <img
                      src={volunteer.avatar}
                      alt={volunteer.fullName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {volunteer.fullName.charAt(0)}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {volunteer.fullName}
                </h3>

                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-bold text-yellow-600">
                    {volunteer.starVotes}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">votes</span>
                </div>

                {userVotes[volunteer._id] ? (
                  <div className="space-y-2">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                      You voted for this volunteer
                    </div>
                    <button
                      onClick={() => removeVote(volunteer._id)}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Remove vote
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVoteClick(volunteer)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium flex items-center gap-2 mx-auto"
                  >
                    <Heart className="h-4 w-4" />
                    Vote as Star
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {volunteers.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No volunteers yet
            </h3>
            <p className="text-gray-500">
              Check back later to vote for star volunteers!
            </p>
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Vote for {selectedVolunteer?.fullName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you think this volunteer deserves a star? (Optional)
              </label>
              <textarea
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
                placeholder="Share why this volunteer is outstanding..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows="4"
                maxLength="500"
              />
              <div className="text-sm text-gray-500 mt-1">
                {voteReason.length}/500 characters
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitVote}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    Cast Vote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarVolunteerVoting;

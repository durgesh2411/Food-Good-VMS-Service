import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Award, Heart, Search, Filter, ArrowRight, Trophy, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { backendUrl } from "../../lib/constant";

const StarVotingPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [voteReason, setVoteReason] = useState("");
  const [loading, setLoading] = useState(false); // Start with false for smooth navigation
  const [voting, setVoting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, votes, posts

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === "user") {
      fetchVolunteers();
    }
  }, [currentUser]);

  useEffect(() => {
    filterAndSortVolunteers();
  }, [volunteers, searchQuery, sortBy]);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      // Don't set loading for navigation smoothness
      // setLoading(true);

      // Get all volunteers with star votes
      const volunteersResponse = await axios.get(`${backendUrl}/star-votes/volunteers`, {
        withCredentials: true,
      });

      if (volunteersResponse.data.success) {
        const volunteersData = volunteersResponse.data.data;

        // Fetch additional data for each volunteer (posts count, hours worked)
        const enhancedVolunteers = await Promise.all(
          volunteersData.map(async (volunteer) => {
            let approvedPosts = 0;
            let hoursWorked = 0;

            try {
              // Get approved posts count
              const postsResponse = await axios.get(
                `${backendUrl}/posts/volunteer/allPosts`,
                { withCredentials: true }
              );

              if (postsResponse.data.success) {
                const userPosts = postsResponse.data.data.posts.filter(
                  post => post.owner === volunteer._id && post.status === 'approved'
                );
                approvedPosts = userPosts.length;
              }
            } catch (error) {
              console.log("Could not fetch posts for", volunteer.fullName);
            }

            try {
              // Get worked hours
              const hoursResponse = await axios.get(
                `${backendUrl}/volunteer-work/hours/${volunteer._id}`,
                { withCredentials: true }
              );
              if (hoursResponse.data.success) {
                hoursWorked = hoursResponse.data.data.totalHours || 0;
              }
            } catch (error) {
              console.log("Could not fetch hours for", volunteer.fullName);
            }

            return {
              ...volunteer,
              approvedPosts,
              hoursWorked,
              totalScore: (hoursWorked * 100) + (volunteer.starVotes * 10) + approvedPosts
            };
          })
        );

        setVolunteers(enhancedVolunteers);

        // Fetch user's votes for each volunteer
        const votePromises = enhancedVolunteers.map(async (volunteer) => {
          try {
            const voteResponse = await axios.get(
              `${backendUrl}/star-votes/check/${volunteer._id}`,
              { withCredentials: true }
            );
            return {
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
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVolunteers = () => {
    let filtered = volunteers.filter((volunteer) =>
      volunteer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort volunteers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.starVotes - a.starVotes;
        case "posts":
          return b.approvedPosts - a.approvedPosts;
        case "score":
          return b.totalScore - a.totalScore;
        case "name":
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

    setFilteredVolunteers(filtered);
  };

  const handleVoteClick = (volunteer) => {
    if (userVotes[volunteer._id]) {
      alert("You have already voted for this volunteer");
      return;
    }

    setSelectedVolunteer(volunteer);
    setShowModal(true);
  };

  const submitVote = async () => {
    if (!selectedVolunteer) return;

    setVoting(true);
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

        // Update local state
        setUserVotes({
          ...userVotes,
          [selectedVolunteer._id]: true,
        });

        // Update volunteer's vote count
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
      setVoting(false);
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

        // Update volunteer's vote count
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

  // Redirect if not a regular user
  if (!loading && (!currentUser || currentUser.role !== "user")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            This voting page is only accessible to regular users.
            {!currentUser ? " Please log in to continue." : " Volunteers and admins cannot vote."}
          </p>
          {!currentUser && (
            <button
              onClick={() => window.location.href = '/signin'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Star Volunteer Voting</h1>
          </div>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Recognize outstanding volunteers in our community! Your vote helps highlight
            volunteers who go above and beyond in their service.
          </p>
          <div className="mt-6 bg-yellow-400 text-yellow-900 inline-block px-6 py-2 rounded-full font-medium">
            💫 Your votes contribute to the leaderboard rankings
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search volunteers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="votes">Sort by Star Votes</option>
              <option value="posts">Sort by Posts</option>
              <option value="score">Sort by Total Score</option>
            </select>
          </div>
        </div>

        {/* Volunteers Grid */}
        {filteredVolunteers.length === 0 ? (
          <div className="text-center py-16">
            <Award className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-600 mb-4">
              {searchQuery ? "No volunteers found" : "No volunteers yet"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Check back later to vote for star volunteers!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 relative overflow-hidden"
              >
                {/* Top ranking badge */}
                {volunteer.starVotes > 0 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-bl-lg text-sm font-bold">
                    ⭐ {volunteer.starVotes} votes
                  </div>
                )}

                <div className="text-center">
                  {/* Avatar */}
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    {volunteer.avatar ? (
                      <AvatarImage src={volunteer.avatar} alt={volunteer.fullName} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                        {volunteer.fullName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {volunteer.fullName}
                  </h3>

                  {/* Stats */}
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{volunteer.hoursWorked}</div>
                      <div className="text-xs text-gray-500">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{volunteer.starVotes}</div>
                      <div className="text-xs text-gray-500">Stars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{volunteer.approvedPosts}</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                  </div>

                  {/* Total Score Badge */}
                  <Badge variant="outline" className="mb-4">
                    Total Score: {volunteer.totalScore} pts
                  </Badge>

                  {/* Vote Button */}
                  {userVotes[volunteer._id] ? (
                    <div className="space-y-3">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                        You voted for this volunteer
                      </div>
                      <button
                        onClick={() => removeVote(volunteer._id)}
                        className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
                      >
                        Remove vote
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVoteClick(volunteer)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
                    >
                      <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Vote as Star Volunteer
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Vote for {selectedVolunteer.fullName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={voting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Volunteer Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  {selectedVolunteer.avatar ? (
                    <AvatarImage src={selectedVolunteer.avatar} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {selectedVolunteer.fullName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-semibold">{selectedVolunteer.fullName}</div>
                  <div className="text-sm text-gray-500">
                    {selectedVolunteer.hoursWorked} hours • {selectedVolunteer.starVotes} stars • {selectedVolunteer.approvedPosts} posts
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you think this volunteer deserves a star? (Optional)
              </label>
              <textarea
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
                placeholder="Share why this volunteer is outstanding... (e.g., 'Always helpful during events', 'Goes above and beyond in their work', etc.)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                rows="4"
                maxLength="500"
                disabled={voting}
              />
              <div className="text-sm text-gray-500 mt-1 flex justify-between">
                <span>{voteReason.length}/500 characters</span>
                <span className="text-yellow-600">Your feedback helps others know why they're special!</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={voting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitVote}
                disabled={voting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {voting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Voting...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    Cast Star Vote
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

export default StarVotingPage;

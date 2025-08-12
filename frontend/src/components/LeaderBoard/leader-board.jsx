import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Trophy, Star, Award, MessageSquare, Eye, Calendar, X } from "lucide-react";
import { backendUrl } from "../../lib/constant";

export function LeaderBoard() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false for smoother navigation
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [dismissingFeedback, setDismissingFeedback] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchLeaderboardData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCurrentUser(response.data.data);
        // If user is admin, fetch feedbacks
        if (response.data.data.isAdmin) {
          fetchFeedbacks();
        }
      }
    } catch (error) {
      console.log("User not logged in");
      // Note: Authentication redirects are now handled by ProtectedRoute wrapper
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const response = await axios.get(`${backendUrl}/feedback`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setFeedbacks(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      // Note: Authentication redirects are now handled by ProtectedRoute wrapper
    } finally {
      setFeedbackLoading(false);
    }
  };

  const dismissFeedback = async (feedbackId) => {
    try {
      setDismissingFeedback(feedbackId);
      const response = await axios.delete(`${backendUrl}/feedback/${feedbackId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        // Remove the feedback from the local state
        setFeedbacks(prevFeedbacks =>
          prevFeedbacks.filter(feedback => feedback._id !== feedbackId)
        );
      }
    } catch (error) {
      console.error("Error dismissing feedback:", error);
      // Note: Authentication redirects are now handled by ProtectedRoute wrapper
      alert("Failed to dismiss feedback. Please try again.");
    } finally {
      setDismissingFeedback(null);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      // Don't set loading for navigation smoothness
      // setLoading(true);

      // Try the volunteer work hours endpoint first
      const response = await axios.get(
        `${backendUrl}/volunteerWorks/admin/approvedVolunteerWorkWithHours`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.data.length > 0) {
        // First, fetch all posts once to count approved posts per volunteer
        let allPosts = [];
        try {
          const postsResponse = await axios.get(
            `${backendUrl}/posts/volunteer/allPosts`,
            { withCredentials: true }
          );
          if (postsResponse.data.success) {
            allPosts = postsResponse.data.data.posts;
            console.log("All posts fetched:", allPosts.length, "posts");
            console.log("Sample post structure:", allPosts[0]);
          }
        } catch (error) {
          console.log("Could not fetch posts data", error);
        }

        // Map the backend data to the frontend format and fetch additional data
        const mappedVolunteers = await Promise.all(
          response.data.data.map(async (volunteer) => {
            const mappedVolunteer = {
              ...volunteer,
              hoursWorked: volunteer.totalWorkedHours || 0,
              starVotes: 0, // Will be fetched below
              approvedPosts: 0, // Will be calculated below
              totalScore: (volunteer.totalWorkedHours || 0) * 100 // Base score from hours
            };

            // Count approved posts by this volunteer
            const userApprovedPosts = allPosts.filter(post =>
              post.status === 'approved' && post.owner === volunteer._id
            ).length;
            mappedVolunteer.approvedPosts = userApprovedPosts;
            console.log(`${volunteer.fullName}: ${userApprovedPosts} approved posts`);

            // Fetch star votes for this volunteer
            try {
              const votesResponse = await axios.get(
                `${backendUrl}/star-votes/volunteer/${volunteer._id}`,
                { withCredentials: true }
              );
              if (votesResponse.data.success) {
                mappedVolunteer.starVotes = votesResponse.data.data.totalVotes || 0;
              }
            } catch (error) {
              console.log("Could not fetch star votes for", volunteer.fullName);
              mappedVolunteer.starVotes = 0;
            }

            // Recalculate total score with all data
            // Priority: Hours (100 points each) > Star Votes (10 points each) > Posts (1 point each)
            mappedVolunteer.totalScore = (mappedVolunteer.hoursWorked * 100) + (mappedVolunteer.starVotes * 10) + mappedVolunteer.approvedPosts;

            return mappedVolunteer;
          })
        );

        // Sort by priority: Hours worked > Star votes > Posts
        mappedVolunteers.sort((a, b) => {
          // First priority: Hours worked
          if (a.hoursWorked !== b.hoursWorked) {
            return b.hoursWorked - a.hoursWorked;
          }
          // Second priority: Star votes
          if (a.starVotes !== b.starVotes) {
            return b.starVotes - a.starVotes;
          }
          // Third priority: Posts
          return b.approvedPosts - a.approvedPosts;
        });

        setVolunteers(mappedVolunteers);
      } else {
        // Fallback: Get volunteers based on approved posts count
        await fetchVolunteersByPosts();
      }
    } catch (error) {
      console.error("Error fetching volunteer hours:", error);
      // Note: Authentication redirects are now handled by ProtectedRoute wrapper and global axios interceptor
      // Fallback: Get volunteers based on approved posts count
      await fetchVolunteersByPosts();
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteersByPosts = async () => {
    try {
      // Get all volunteers who have created posts
      const postsResponse = await axios.get(
        `${backendUrl}/posts/volunteer/allPosts`,
        { withCredentials: true }
      );

      if (postsResponse.data.success) {
        const posts = postsResponse.data.data.posts;
        console.log("Posts data:", posts);

        // Group posts by user and count approved posts
        const volunteerStats = {};
        posts.forEach(post => {
          console.log("Processing post:", post);
          if (post.status === 'approved' && post.owner) {
            const userId = post.owner;
            if (!volunteerStats[userId]) {
              volunteerStats[userId] = {
                _id: userId,
                fullName: post.fullName,
                avatar: null,
                hoursWorked: 0,        // From volunteer work submissions
                starVotes: 0,          // Star votes from users
                approvedPosts: 0,      // Number of approved posts
                totalScore: 0          // Calculated ranking score
              };
            }
            volunteerStats[userId].approvedPosts += 1;
          }
        });

        console.log("Volunteer stats:", volunteerStats);

        // Get additional volunteer data (hours, votes, avatars)
        const volunteerArray = await Promise.all(
          Object.values(volunteerStats).map(async (volunteer) => {
            try {
              // Get star votes
              const votesResponse = await axios.get(
                `${backendUrl}/star-votes/volunteer/${volunteer._id}`,
                { withCredentials: true }
              );
              if (votesResponse.data.success) {
                volunteer.starVotes = votesResponse.data.data.totalVotes || 0;
              }
            } catch (error) {
              console.log("Could not fetch star votes for", volunteer.fullName);
              volunteer.starVotes = 0;
            }

            try {
              // Get worked hours from volunteer work
              const hoursResponse = await axios.get(
                `${backendUrl}/volunteer-work/hours/${volunteer._id}`,
                { withCredentials: true }
              );
              if (hoursResponse.data.success) {
                volunteer.hoursWorked = hoursResponse.data.data.totalHours || 0;
              }
            } catch (error) {
              console.log("Could not fetch hours for", volunteer.fullName);
              volunteer.hoursWorked = 0;
            }

            try {
              // Get user avatar
              const userResponse = await axios.get(
                `${backendUrl}/users/${volunteer._id}`,
                { withCredentials: true }
              );
              if (userResponse.data.success) {
                volunteer.avatar = userResponse.data.data.avatar;
              }
            } catch (error) {
              console.log("Could not fetch user avatar for", volunteer.fullName);
            }

            // Calculate total score for ranking
            // Priority: Hours (100 points each) > Star Votes (10 points each) > Posts (1 point each)
            volunteer.totalScore = (volunteer.hoursWorked * 100) + (volunteer.starVotes * 10) + volunteer.approvedPosts;

            return volunteer;
          })
        );

        // Sort by priority: Hours worked > Star votes > Posts
        volunteerArray.sort((a, b) => {
          // First priority: Hours worked
          if (a.hoursWorked !== b.hoursWorked) {
            return b.hoursWorked - a.hoursWorked;
          }
          // Second priority: Star votes
          if (a.starVotes !== b.starVotes) {
            return b.starVotes - a.starVotes;
          }
          // Third priority: Posts
          return b.approvedPosts - a.approvedPosts;
        });

        console.log("Final volunteer array:", volunteerArray);
        setVolunteers(volunteerArray);
      }
    } catch (error) {
      console.error("Error fetching posts for leaderboard:", error);
      // Note: Authentication redirects are now handled by ProtectedRoute wrapper and global axios interceptor
      setError("Failed to load leaderboard data");
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6">
      {/* Top 3 Volunteers Showcase - Only for Volunteers and Admins */}
      {currentUser && (currentUser.role === "volunteer" || currentUser.isAdmin) && volunteers.length >= 3 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Award className="h-7 w-7 text-purple-600" />
              Top 3 Star Volunteers
            </h2>
            <p className="text-gray-600">Outstanding contributors in our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {volunteers.slice(0, 3).map((volunteer, index) => (
              <div
                key={volunteer._id}
                className={`relative bg-white rounded-lg p-4 shadow-md border-2 ${
                  index === 0
                    ? "border-yellow-400 ring-2 ring-yellow-200"
                    : index === 1
                    ? "border-gray-400 ring-2 ring-gray-200"
                    : "border-orange-400 ring-2 ring-orange-200"
                }`}
              >
                {/* Position Badge */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold text-sm ${
                  index === 0 ? "bg-amber-500" :
                  index === 1 ? "bg-gray-500" : "bg-orange-500"
                }`}>
                  {index === 0 ? "Champion" : index === 1 ? "Runner-up" : "Third Place"}
                </div>

                <div className="text-center pt-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    {volunteer.avatar ? (
                      <AvatarImage src={volunteer.avatar} />
                    ) : (
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl font-bold">
                        {volunteer.fullName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {volunteer.fullName}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{volunteer.hoursWorked || volunteer.totalWorkedHours || 0}</div>
                        <div className="text-xs text-gray-500">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{volunteer.starVotes || 0}</div>
                        <div className="text-xs text-gray-500">Stars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{volunteer.approvedPosts || 0}</div>
                        <div className="text-xs text-gray-500">Posts</div>
                      </div>
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {volunteer.totalScore || (volunteer.totalWorkedHours || 0) * 100} points
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Leaderboard */}
      <div className="border rounded-lg w-full">
        <div className="bg-gradient-to-r from-[#2b3359] to-[#3d4373] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Volunteer Leaderboard
          </h2>
          <p className="text-blue-100 mt-1">
            Ranked by: Hours Worked → Star Votes → Posts Created
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading leaderboard...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">{error}</div>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 text-yellow-500 font-bold">★</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No volunteer activity yet
            </h3>
            <p className="text-gray-600">
              Volunteers will appear here once they create and get posts approved
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Rank</TableHead>
                  <TableHead className="font-semibold">Volunteer</TableHead>
                  <TableHead className="font-semibold text-center">Hours Worked</TableHead>
                  <TableHead className="font-semibold text-center">Star Votes</TableHead>
                  <TableHead className="font-semibold text-center">Posts</TableHead>
                  <TableHead className="font-semibold">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer, index) => (
                  <TableRow
                    key={volunteer._id}
                    className={
                      index === 0
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400"
                        : index === 2
                        ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400"
                        : "hover:bg-gray-50"
                    }
                  >
                    <TableCell className="font-bold text-center">
                      {index === 0 && <div className="text-2xl text-yellow-600 font-bold">#1</div>}
                      {index === 1 && <div className="text-2xl text-gray-500 font-bold">#2</div>}
                      {index === 2 && <div className="text-2xl text-orange-600 font-bold">#3</div>}
                      {index > 2 && <div className="text-lg font-semibold text-gray-600">#{index + 1}</div>}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {volunteer.avatar ? (
                            <AvatarImage src={volunteer.avatar} />
                          ) : (
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                              {volunteer.fullName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            {volunteer.fullName}
                            {index === 0 && <Trophy className="text-yellow-500 h-4 w-4" />}
                            {volunteer.starVotes > 0 && (
                              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                Star Volunteer
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Score: {volunteer.totalScore || (volunteer.totalWorkedHours || volunteer.hoursWorked || 0) * 100} pts
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg text-blue-600 text-center">
                      {volunteer.hoursWorked || volunteer.totalWorkedHours || 0} hrs
                    </TableCell>
                    <TableCell className="font-bold text-lg text-yellow-600 text-center">
                      {volunteer.starVotes || 0}
                    </TableCell>
                    <TableCell className="font-bold text-lg text-green-600 text-center">
                      {volunteer.approvedPosts || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(
                            ((volunteer.totalScore || (volunteer.totalWorkedHours || volunteer.hoursWorked || 0) * 100) /
                            Math.max((volunteers[0].totalScore || (volunteers[0].totalWorkedHours || volunteers[0].hoursWorked || 0) * 100), 10)) * 100,
                            100
                          )}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500 min-w-[40px]">
                          {Math.round(
                            ((volunteer.totalScore || (volunteer.totalWorkedHours || volunteer.hoursWorked || 0) * 100) /
                            Math.max((volunteers[0].totalScore || (volunteers[0].totalWorkedHours || volunteers[0].hoursWorked || 0) * 100), 10)) * 100
                          )}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Admin Feedback Section - Moved to Bottom */}
      {currentUser && currentUser.isAdmin && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-red-600" />
              User Feedback - Admin Only
            </h2>
            <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
              {feedbacks.length} feedbacks
            </span>
          </div>

          {feedbackLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Loading feedbacks...</span>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No feedback received yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {feedbacks.slice(0, 10).map((feedback, index) => (
                <div key={feedback._id || index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Feedback #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {feedback.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      )}
                      {feedback._id && (
                        <button
                          onClick={() => dismissFeedback(feedback._id)}
                          disabled={dismissingFeedback === feedback._id}
                          className={`p-1 rounded-full transition-colors group ${
                            dismissingFeedback === feedback._id
                              ? "bg-gray-100 cursor-not-allowed"
                              : "hover:bg-rose-100"
                          }`}
                          title={dismissingFeedback === feedback._id ? "Dismissing..." : "Dismiss this feedback (issue resolved)"}
                        >
                          {dismissingFeedback === feedback._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <X className="h-4 w-4 text-gray-400 group-hover:text-red-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded border">
                    {feedback.message || "No message content"}
                  </div>

                  {feedback.user && (
                    <div className="mt-2 text-xs text-gray-500">
                      From: {feedback.user.fullName || feedback.user.email || "Anonymous"}
                    </div>
                  )}
                </div>
              ))}

              {feedbacks.length > 10 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">
                    Showing latest 10 of {feedbacks.length} feedbacks
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CardComponent } from "./CardComponent";
import { ActivityIcon, CalendarIcon, DollarSignIcon, UsersIcon } from "./Icons";
import {
  LinechartChart,
  BarchartChart,
  PiechartChart,
} from "./ChartComponents";
import { backendUrl } from "../../lib/constant";
import FeedbackList from "../FeedbackList";
import VolunteerWorkManager from "./VolunteerWorkManager";
import VolunteerWorkSubmission from "./VolunteerWorkSubmission";

export default function Dashboard() {
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [eventPieData, setEventPieData] = useState([]);
  const [eventLineData, setEventLineData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users/current-user`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Please login to view dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch dashboard data based on user role
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Don't show loading for navigation - page is already rendered
        // setLoading(true);

        // Admin gets full dashboard data
        if (user.isAdmin) {
          await Promise.all([
            fetchTotalDonatedAmount(),
            fetchTotalVolunteers(),
            fetchTotalEvents(),
            fetchTotalHours(),
            fetchLineChartData(),
            fetchBarChartData(),
            fetchPieChartData(),
          ]);
        }
        // Volunteers get limited data
        else if (user.role === "volunteer") {
          await Promise.all([
            fetchTotalEvents(),
            fetchTotalHours(),
            fetchBarChartData(),
          ]);
        }
        // Regular users get basic data
        else {
          await Promise.all([
            fetchTotalEvents(),
            fetchTotalVolunteers(),
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        // setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Individual fetch functions with proper error handling
  const fetchTotalDonatedAmount = async () => {
    try {
      const response = await axios.get(`${backendUrl}/dashboard/admin/getTotalDonatedAmount`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDonatedAmount(response.data.data.totalAmount || 0);
      }
    } catch (error) {
      console.error("Error fetching donated amount:", error);
    }
  };

  const fetchTotalVolunteers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/dashboard/admin/getTotalVolunteers`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setTotalVolunteers(response.data.data.totalVolunteers || 0);
      }
    } catch (error) {
      console.error("Error fetching total volunteers:", error);
    }
  };

  const fetchTotalEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/dashboard/admin/getTotalEvents`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setTotalEvents(response.data.data.totalEvents || 0);
      }
    } catch (error) {
      console.error("Error fetching total events:", error);
    }
  };

  const fetchTotalHours = async () => {
    try {
      const response = await axios.get(`${backendUrl}/dashboard/admin/getTotalHoursVolunteered`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setTotalHours(response.data.data.totalHoursVolunteered || 0);
      }
    } catch (error) {
      console.error("Error fetching total hours:", error);
    }
  };

  const fetchLineChartData = async () => {
    try {
      console.log("Fetching line chart data...");
      const response = await axios.get(`${backendUrl}/dashboard/admin/getLastSixEventsUserCounts`, {
        withCredentials: true,
      });
      console.log("Line chart response:", response.data);
      if (response.data.success) {
        setEventLineData(response.data.data || []);
        console.log("Line chart data set:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      console.log("Fetching bar chart data...");
      const response = await axios.get(`${backendUrl}/dashboard/admin/getLastSixEventsUserCounts`, {
        withCredentials: true,
      });
      console.log("Bar chart response:", response.data);
      if (response.data.success) {
        setEventData(response.data.data || []);
        console.log("Bar chart data set:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      console.log("Fetching pie chart data...");
      const response = await axios.get(`${backendUrl}/dashboard/admin/getUserHoursForPieChart`, {
        withCredentials: true,
      });
      console.log("Pie chart response:", response.data);
      if (response.data.success) {
        setEventPieData(response.data.data || []);
        console.log("Pie chart data set:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  // Loading state - only show for initial user fetch
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">{error}</div>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-2">Access Denied</div>
          <p className="text-gray-600">Please login to view the dashboard</p>
        </div>
      </div>
    );
  }

  // Render cards based on user role
  const renderCards = () => {
    const cards = [];

    if (user.isAdmin) {
      // Admin sees all cards
      cards.push(
        <CardComponent
          key="donations"
          title="Total Donations"
          icon={DollarSignIcon}
          value={`₹${donatedAmount.toLocaleString()}`}
          description="Total amount donated"
        />,
        <CardComponent
          key="volunteers"
          title="Total Volunteers"
          icon={UsersIcon}
          value={totalVolunteers}
          description="Active volunteers"
        />,
        <CardComponent
          key="events"
          title="Total Events"
          icon={CalendarIcon}
          value={totalEvents}
          description="Events organized"
        />,
        <CardComponent
          key="hours"
          title="Volunteer Hours"
          icon={ActivityIcon}
          value={totalHours}
          description="Total hours volunteered"
        />
      );
    } else if (user.role === "volunteer") {
      // Volunteers see limited cards
      cards.push(
        <CardComponent
          key="events"
          title="Total Events"
          icon={CalendarIcon}
          value={totalEvents}
          description="Events to participate"
        />,
        <CardComponent
          key="hours"
          title="My Contribution"
          icon={ActivityIcon}
          value={totalHours}
          description="Community volunteer hours"
        />
      );
    } else {
      // Regular users see basic info
      cards.push(
        <CardComponent
          key="events"
          title="Upcoming Events"
          icon={CalendarIcon}
          value={totalEvents}
          description="Events to join"
        />,
        <CardComponent
          key="volunteers"
          title="Active Volunteers"
          icon={UsersIcon}
          value={totalVolunteers}
          description="Community volunteers"
        />
      );
    }

    return cards;
  };

  // Render charts based on user role
  const renderCharts = () => {
    if (user.isAdmin) {
      return (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-9">
          <div className="md:col-span-4 lg:col-span-3">
            <LinechartChart data={eventLineData} />
          </div>
          <div className="md:col-span-4 lg:col-span-3">
            <BarchartChart data={eventData} />
          </div>
          <div className="md:col-span-4 lg:col-span-3">
            <PiechartChart data={eventPieData} />
          </div>
        </div>
      );
    } else if (user.role === "volunteer") {
      return (
        <div className="grid gap-10 md:grid-cols-2">
          <div className="md:col-span-1">
            <BarchartChart data={eventData} />
          </div>
          <div className="md:col-span-1">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Volunteer Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Participated:</span>
                  <span className="font-semibold text-blue-600">{totalEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Community Hours:</span>
                  <span className="font-semibold text-green-600">{totalHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Role:</span>
                  <span className="font-semibold text-purple-600">Volunteer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Our Community!</h3>
            <p className="text-gray-600 mb-6">Join our volunteer events and make a difference in the community</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-bold text-blue-600">{totalEvents}</div>
                <div className="text-sm text-gray-500">Events Available</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-bold text-green-600">{totalVolunteers}</div>
                <div className="text-sm text-gray-500">Active Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-8 pt-6 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#2b3359] to-[#3d4373] text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.fullName}!
        </h1>
        <p className="text-blue-100">
          {user.isAdmin
            ? "Admin Dashboard - Manage your organization's activities"
            : user.role === "volunteer"
            ? "Volunteer Dashboard - Track your contributions"
            : "Community Dashboard - Discover volunteer opportunities"
          }
        </p>
        <div className="mt-3 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            {user.isAdmin ? "Administrator" : user.role === "volunteer" ? "Volunteer" : "Community Member"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {renderCards()}
      </div>

      {/* Charts Section */}
      {renderCharts()}

      {/* Admin Sections */}
      {user.isAdmin && (
        <div className="space-y-8">
          {/* Volunteer Work Management */}
          <VolunteerWorkManager />

          {/* Feedback Management */}
          <FeedbackList />
        </div>
      )}

      {/* Star Voting Section for Regular Users */}
      {user.role !== "volunteer" && !user.isAdmin && (
        <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vote for Star Volunteers</h3>
          <p className="text-gray-600 mb-4">
            Recognize outstanding volunteers in our community by casting your vote!
          </p>
          <Link
            to="/vote-stars"
            className="inline-block bg-gradient-to-r from-[#2b3359] to-[#3d4373] text-white px-6 py-3 rounded-lg hover:from-[#3d4373] hover:to-[#4a5282] transition-all duration-200 font-semibold"
          >
            Vote for Volunteers →
          </Link>
        </div>
      )}

      {/* Quick Actions for Volunteers */}
      {user.role === "volunteer" && !user.isAdmin && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/events"
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
              >
                <div className="text-green-600 font-semibold">View Events</div>
                <div className="text-sm text-gray-600">Find upcoming volunteer opportunities</div>
              </Link>
              <Link
                to="/posts/my-posts"
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
              >
                <div className="text-blue-600 font-semibold">My Posts</div>
                <div className="text-sm text-gray-600">Manage your volunteer posts</div>
              </Link>
              <Link
                to="/leaderboard"
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
              >
                <div className="text-purple-600 font-semibold">Leaderboard</div>
                <div className="text-sm text-gray-600">Check your volunteer ranking</div>
              </Link>
            </div>
          </div>

          {/* Volunteer Work Submission */}
          <VolunteerWorkSubmission />
        </div>
      )}
    </div>
  );
}

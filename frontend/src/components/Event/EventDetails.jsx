import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../lib/constant";
import { toast } from "react-toastify";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { eventId } = useParams();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const response = await axios.get(
          `${backendUrl}/events/getEvents/${eventId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setEvent(response.data.data.event);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/events/getEvents/${eventId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Registered successfully!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register for the event.");
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateEvent = async (status) => {
    const confirmMessage = status === 'completed'
      ? "Are you sure you want to mark this event as completed?"
      : "Are you sure you want to cancel this event?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${backendUrl}/events/${eventId}/terminate`,
        { status },
        { withCredentials: true }
      );

      if (response.data.success) {
        setEvent(response.data.data.event);
        toast.success(`Event ${status} successfully!`);
      }
    } catch (error) {
      console.error("Error terminating event:", error);
      toast.error(error.response?.data?.message || `Failed to ${status} event`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canRegister = () => {
    return event?.status === 'active' && user?.role !== 'volunteer' && !user?.isAdmin;
  };

  const canTerminate = () => {
    console.log("DEBUG - Event:", event);
    console.log("DEBUG - Event status:", event?.status);
    console.log("DEBUG - User:", user);
    console.log("DEBUG - User isAdmin:", user?.isAdmin);
    const result = event?.status === 'active' && user?.isAdmin;
    console.log("DEBUG - Can terminate result:", result);
    return result;
  };

  return (
    <div className="max-w-2xl mx-auto my-4 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      {event ? (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800">
              {event.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status || 'active')}`}>
              {(event.status || 'active').charAt(0).toUpperCase() + (event.status || 'active').slice(1)}
            </span>
          </div>

          {/* Event Image */}
          <div className="flex justify-center">
            <img
              src={event.event_image}
              alt={event.title}
              className="w-2/3 md:w-1/2 rounded-lg shadow-md"
            />
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <p className="text-lg">
              <strong className="font-medium text-gray-700">Location:</strong>{" "}
              {event.location}
            </p>
            <p className="text-lg">
              <strong className="font-medium text-gray-700">Date:</strong>{" "}
              {event.date}
            </p>
            <p className="text-lg">
              <strong className="font-medium text-gray-700">Time:</strong>{" "}
              {event.time}
            </p>
            <p className="text-lg">
              <strong className="font-medium text-gray-700">
                Description:
              </strong>{" "}
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Debug Info */}
            <div className="p-3 bg-gray-100 rounded text-sm">
              <p>Debug Info:</p>
              <p>User: {user ? JSON.stringify({isAdmin: user.isAdmin, role: user.role}) : 'null'}</p>
              <p>Event Status: {event?.status || 'undefined'}</p>
              <p>Can Terminate: {canTerminate().toString()}</p>
              <p>Can Register: {canRegister().toString()}</p>
            </div>

            {/* Register Button for Users */}
            {canRegister() && (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-2 px-4 bg-black hover:bg-[#f2b705] text-white rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            )}

            {/* Admin Terminate Buttons */}
            {canTerminate() && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTerminateEvent('completed')}
                  disabled={loading}
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all ease-in-out duration-300 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Mark as Completed"}
                </button>
                <button
                  onClick={() => handleTerminateEvent('cancelled')}
                  disabled={loading}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all ease-in-out duration-300 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Cancel Event"}
                </button>
              </div>
            )}

            {/* Status Messages */}
            {event.status === 'completed' && (
              <div className="text-center p-3 bg-blue-50 rounded-md">
                <p className="text-blue-800 font-medium">This event has been completed.</p>
              </div>
            )}

            {event.status === 'cancelled' && (
              <div className="text-center p-3 bg-red-50 rounded-md">
                <p className="text-red-800 font-medium">This event has been cancelled.</p>
              </div>
            )}

            {event.status === 'active' && user?.role === 'volunteer' && (
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <p className="text-gray-600">Volunteers cannot register for events. This event is open for community members.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          Loading event details...
        </p>
      )}
    </div>
  );
}

export default EventDetails;

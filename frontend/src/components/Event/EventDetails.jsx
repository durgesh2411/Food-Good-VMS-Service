import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../lib/constant";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const response = await axios.get(
          `/api/v1/events/getEvents/${eventId}`
        );
        if (response.data.success) {
          setEvent(response.data.data.event);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `/api/v1/events/getEvents/${eventId}`
      );
      if (response.data.success) {
        alert("Registered successfully!");
      }
    } catch (error) {
      alert("Failed to register for the event.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-4 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      {event ? (
        <div className="space-y-2">
          <h1 className="text-center text-3xl font-bold text-gray-800">
            {event.title}
          </h1>

          {/* Event Image */}
          <div className="flex justify-center">
            <img
              src={event.event_image}
              alt={event.title}
              className="w-2/3 md:w-1/2 rounded-lg shadow-md"
            />
          </div>

          {/* Event Details */}
          <div className="space-y-2">
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

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full py-2 px-4 bg-black hover:bg-[#f2b705] text-white rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
          >
            Register Now
          </button>
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

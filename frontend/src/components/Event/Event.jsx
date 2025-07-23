import { useEffect, useState } from "react";
import axios from "axios";
import { EventCard } from "./EventCard";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../lib/constant";

function Event() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/events/getEvents`)
      .then((response) => {
        if (response.data.success) {
          setEvents(response.data.data.events.reverse());
        } else {
          console.error("Error fetching events:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        {/* Create Event Button */}
        <button
          onClick={handleCreateEvent}
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
        >
          Create Event
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 flex-1">
          Upcoming Events
        </h2>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {events?.map((event, key) => (
          <Link
            key={key}
            to={`/events/${event._id}`}
            className="transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <EventCard event={event} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Event;

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../lib/constant";

function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    event_image: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setEventData({ ...eventData, [e.target.name]: e.target.files[0] });
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, date, time, location, event_image } = eventData;

    if (!title || !description || !date || !time || !location || !event_image) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("location", location);
    formData.append("event_image", event_image);

    axios
      .post(`${backendUrl}/events`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Event created successfully!");
          setEventData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            event_image: "",
          });
        } else {
          toast.error("Failed to create event");
        }
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        toast.error("Error creating event");
      });
  };

  return (
    <div className="max-w-md mx-auto p-4  border border-gray-200 mt-4">
      <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block ">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-800 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-800 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="date" className="block">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-800 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="time" className="block">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-800 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="location" className="block">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-800 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="event_image" className="block">
            Event Image
          </label>
          <input
            type="file"
            accept="image/*"
            name="event_image"
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black hover:bg-[#f2b705] text-white rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;

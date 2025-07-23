import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../lib/constant";

function CreateAnnouncement() {
  const [announcementData, setAnnouncementData] = useState({
    announcement_type: "A",
    title: "",
    content: "",
    visibility: "user",
  });

  const handleChange = (e) => {
    setAnnouncementData({
      ...announcementData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/v1/announcements`, announcementData)
      .then((response) => {
        if (response.data.success) {
          toast.success("Announcement created successfully!");
          setAnnouncementData({
            announcement_type: "A",
            title: "",
            content: "",
            visibility: "user",
          });
        } else {
          toast.error("Failed to create announcement");
        }
      })
      .catch((error) => {
        console.error("Error creating announcement:", error);
        toast.error("Error creating announcement");
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Announcement
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="announcement_type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            name="announcement_type"
            value={announcementData.announcement_type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={announcementData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            value={announcementData.content}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
          />
        </div>
        <div>
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-700"
          >
            Visibility
          </label>
          <select
            name="visibility"
            value={announcementData.visibility}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="all">All</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black hover:bg-[#f2b705] text-white rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
        >
          Create Announcement
        </button>
      </form>
    </div>
  );
}

export default CreateAnnouncement;

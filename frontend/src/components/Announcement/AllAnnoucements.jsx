import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AnnouncementCard } from "./AnnouncementCard";
import { backendUrl } from "../../lib/constant";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/announcements/admin`)
      .then((response) => {
        if (response.data.success) {
          setAnnouncements(response.data.data.announcements.reverse());
        } else {
          console.error("Error fetching announcements:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-4 flex flex-col gap-2">
        <Link
          to="/announcements/create"
          className="bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] hover:text-black transition duration-300 self-start"
        >
          Create Announcement
        </Link>
        <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
          Announcements
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements?.map((announcement) => (
          <AnnouncementCard
            announcement={announcement}
            key={announcement._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Announcement;

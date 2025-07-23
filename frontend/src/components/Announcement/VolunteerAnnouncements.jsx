import { useEffect, useState } from "react";
import axios from "axios";
import { AnnouncementCard } from "./AnnouncementCard"; // Assuming AnnouncementCard can be reused
import { backendUrl } from "../../lib/constant";

function VolunteerAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/announcements/volunteer`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data.announcements);
          setAnnouncements(response.data.data.announcements.reverse());
        } else {
          console.error(
            "Error fetching volunteer announcements:",
            response.data.message
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching volunteer announcements:", error);
      });
  }, []);

  return (
    <div className="space-x-4 space-y-3 h-fit flex flex-row flex-wrap ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Volunteer Announcements</h2>
      </div>

      {announcements?.map((announcement) => {
        return (
          <AnnouncementCard
            announcement={announcement}
            key={announcement._id}
          />
        );
      })}
    </div>
  );
}

export default VolunteerAnnouncements;

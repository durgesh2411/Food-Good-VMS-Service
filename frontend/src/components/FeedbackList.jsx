import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage (inside useEffect to avoid SSR mismatch)
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    // Fetch feedbacks only if user is admin
    if (storedUser && JSON.parse(storedUser).role === "ADMIN") {
      axios.get("/api/v1/feedback").then(res => setFeedbacks(res.data.data));
    }
  }, []);

  // Don't render if user is not admin
  if (!user || user.role !== "ADMIN") return null;

  // Helper to extract value by label from message string
  const getValue = (lines, label) => {
    const line = lines.find((l) => l.startsWith(label));
    return line ? line.replace(label, "").trim() : "";
  };

  return (
    <div>
      <h1 style={{ fontWeight: "bold", fontSize: "2.5rem", marginBottom: "2rem" }}>User Feedback</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {feedbacks.map(fb => {
          const lines = fb.message.split('\n');
          return (
            <li
              key={fb._id}
              style={{
                marginBottom: "3em",
                borderBottom: "2px solid #bbb",
                paddingBottom: "2em",
                background: "#f8f9fa",
                borderRadius: "1em",
                boxShadow: "0 2px 8px #e3e3e3"
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "1.5rem", color: "#333" }}>
                Feedback Details:
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Name: <span style={{ fontWeight: "normal" }}>{getValue(lines, "Name:")}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Email: <span style={{ fontWeight: "normal" }}>{getValue(lines, "Email:")}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Phone: <span style={{ fontWeight: "normal" }}>{getValue(lines, "Phone:")}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Title: <span style={{ fontWeight: "normal" }}>{getValue(lines, "Title:")}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Description: <span style={{ fontWeight: "normal" }}>{getValue(lines, "Description:")}</span>
              </div>
              <div style={{ fontSize: "1rem", color: "#888", marginTop: "1em" }}>
                {new Date(fb.createdAt).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeedbackList;

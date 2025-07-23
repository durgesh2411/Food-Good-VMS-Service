// import React, { useState } from "react";

// const FeedbackForm = () => {
//   const [feedback, setFeedback] = useState("");

//   const handleInputChange = (e) => {
//     setFeedback(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle the feedback submission logic here
//     console.log("Feedback submitted:", feedback);
//     // Clear the input field after submission
//     setFeedback("");
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "50px",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <input
//           type="text"
//           value={feedback}
//           onChange={handleInputChange}
//           placeholder="Enter your feedback"
//           style={{
//             padding: "10px",
//             fontSize: "16px",
//             marginBottom: "10px",
//             width: "300px",
//             borderRadius: "5px",
//             border: "1px solid #ccc",
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             color: "#fff",
//             backgroundColor: "#007BFF",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Submit Feedback
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FeedbackForm;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) return;
    try {
      await axios.post("/api/v1/feedback", { message: feedback });
      setFeedback("");
    } catch (error) {
      toast.error("Error submitting feedback");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={feedback}
          onChange={handleInputChange}
          placeholder="Enter your feedback"
          style={{
            padding: "10px",
            fontSize: "16px",
            marginBottom: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;

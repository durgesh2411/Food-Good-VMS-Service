// import { Link } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useTranslation } from "react-i18next";
// import { backendUrl } from "../../lib/constant";

// function Home() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const { t } = useTranslation();
//   const handleVolunteerClick = () => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to become a volunteer?"
//     );
//     if (isConfirmed) {
//       // User confirmed, make the request
//       axios
//         .patch(`/api/v1/users/becomeVolunteer`)
//         .then(() => {
//           // Handle success
//           toast.success("You are now a volunteer!");
//         })
//         .catch((error) => {
//           // Handle error
//           console.error("Error becoming a volunteer:", error.message);

//           const errorMessage = "There was an error. Please try again.";
//           toast.error(errorMessage);
//         });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle the feedback submission logic here
//     if (!name || !email || !phone || !title || !description) {
//       toast.error("All fields are required");
//       return;
//     }
//     const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     const phoneregex = /^\d{10}$/;
//     if (!emailregex.test(email)) {
//       toast.error("Invalid email address");
//       return;
//     }
//     if (!phoneregex.test(phone)) {
//       toast.error("Invalid phone number");
//       return;
//     }

//     const feedbackData = new FormData();
//     feedbackData.append("name", name);
//     feedbackData.append("email", email);
//     feedbackData.append("phone", phone);
//     feedbackData.append("title", title);
//     feedbackData.append("description", description);

//     fetch(
//       "https://script.google.com/macros/s/AKfycby6MR446p5w2GZkMNq8aHx2IrMAHZiVTLK35VImNzooQCN3frjpmIfByee4cWFcf6Bj-A/exec",
//       {
//         method: "POST",
//         mode: "no-cors",
//         body: feedbackData,
//       }
//     ).then(
//       () => {
//         ``;

//         toast.success("Feedback submitted successfully!");
//         setName("");
//         setEmail("");
//         setPhone("");
//         setTitle("");
//         setDescription("");
//       },
//       (error) => {
//         console.error("Error submitting feedback:", error);
//         toast.error("Error submitting feedback");
//       }
//     );
//   };

//   return (
//     <div className="flex flex-col min-h-[100dvh]">
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
//           <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
//             <div className="flex flex-col justify-center space-y-4 text-primary-foreground">
//               <div className="space-y-2">
//                 <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center">
//                   {t("home.hero.title")}
//                 </h1>
//                 <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
//                   {t("home.hero.description")}
//                 </p>
//               </div>
//               <Link
//                 to={"/donate"}
//                 className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//               >
//                 {t("home.hero.button")}
//               </Link>
//             </div>
//             <img
//               src="/main_image.jpg"
//               width="550"
//               height="550"
//               alt="Children eating a meal"
//               className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
//             />
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32" id="impact">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                   {t("home.hero.mid.title")}
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   {t("home.hero.mid.description.line1")}
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
//               <div className="grid gap-1 text-center">
//                 <h3 className="text-3xl font-bold text-primary">100,000+</h3>
//                 <p className="text-muted-foreground">
//                   {t("home.hero.mid.description.line2")}
//                 </p>
//               </div>
//               <div className="grid gap-1 text-center">
//                 <h3 className="text-3xl font-bold text-primary">5,000+</h3>
//                 <p className="text-muted-foreground">
//                   {t("home.hero.mid.description.line3")}
//                 </p>
//               </div>
//               <div className="grid gap-1 text-center">
//                 <h3 className="text-3xl font-bold text-primary">95%</h3>
//                 <p className="text-muted-foreground">
//                   {t("home.hero.mid.description.line4")}
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
//               <img
//                 src="/food_eat.jpg"
//                 width="550"
//                 height="310"
//                 alt="Children eating a meal"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
//               />
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-bold">
//                     {t("home.hero.mid.second.line1")}
//                   </h3>
//                   <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                     {t("home.hero.mid.second.line2")}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section
//           className="w-full py-12 md:py-24 lg:py-32 bg-muted"
//           id="donate"
//         >
//           <div className="container px-4 md:px-6 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                 {t("home.hero.mid.feedback.title")}
//               </h2>
//               <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 {t("home.hero.mid.feedback.line1")}
//               </p>
//             </div>
//             <div className="mx-auto w-full max-w-sm space-y-2">
//               <form className="flex flex-col gap-4">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="max-w-lg flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="max-w-lg flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <input
//                   type="tel"
//                   placeholder="Phone Number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   required
//                   className="max-w-lg flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                   className="max-w-lg flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <textarea
//                   placeholder="Description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                   className="max-w-lg flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                 ></textarea>
//                 <button
//                   type="submit"
//                   className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md"
//                   onClick={handleSubmit}
//                 >
//                   {t("home.hero.mid.feedback.button")}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32" id="volunteer">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                   {t("home.hero.bottom.title")}
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   {t("home.hero.bottom.description")}
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
//               <img
//                 src="/volunteer_image.jpg"
//                 width="550"
//                 height="310"
//                 alt="Volunteers serving meals"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
//               />
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-bold">
//                     {t("home.hero.volunteer.title")}
//                   </h3>
//                   <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                     {t("home.hero.volunteer.description")}
//                   </p>
//                   <button
//                     onClick={handleVolunteerClick}
//                     className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//                   >
//                     {t("home.hero.volunteer.button")}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Home;

import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { backendUrl } from "../../lib/constant";
import StarVolunteerVoting from "../StarVoting/StarVolunteerVotingHomePreview";

function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { t } = useTranslation();

  const handleVolunteerClick = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to become a volunteer?"
    );
    if (isConfirmed) {
      axios
        .patch(`${backendUrl}/users/becomeVolunteer`)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error becoming a volunteer:", error.message);
          toast.error("There was an error. Please try again.");
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !title || !description) {
      toast.error("All fields are required");
      return;
    }
    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneregex = /^\d{10}$/;
    if (!emailregex.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!phoneregex.test(phone)) {
      toast.error("Invalid phone number");
      return;
    }

    try {
      await axios.post(`${backendUrl}/feedback`, {
        message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nTitle: ${title}\nDescription: ${description}`,
      }, { withCredentials: true });
      setName("");
      setEmail("");
      setPhone("");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-[#2b3359] via-[#1e293b] to-[#0f172a]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center text-white order-2 lg:order-1">
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                    {t("home.hero.title")}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-none lg:max-w-[600px]">
                    {t("home.hero.description")}
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to={"/donate"}
                    className="inline-flex h-11 sm:h-12 md:h-14 items-center justify-center rounded-md bg-gradient-to-r from-[#f2b705] to-[#fbbf24] px-6 sm:px-8 md:px-12 text-sm sm:text-base md:text-lg font-semibold text-[#2b3359] shadow transition-all hover:from-[#fbbf24] hover:to-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t("home.hero.button")}
                  </Link>
                  <Link
                    to={"/apply-neet"}
                    className="inline-flex h-11 sm:h-12 md:h-14 items-center justify-center rounded-md bg-[#2b3359] px-6 sm:px-8 md:px-12 text-sm sm:text-base md:text-lg font-semibold text-white shadow transition-all hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] disabled:pointer-events-none disabled:opacity-50 border-2 border-[#f2b705]"
                  >
                    Apply for Free NEET Coaching
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[850px] aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/main_image.jpg"
                    width="900"
                    height="700"
                    alt="Medical students studying for NEET examination"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32" id="impact">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
                  {t("home.hero.mid.title")}
                </h2>
                <p className="max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0">
                  {t("home.hero.mid.description.line1")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">500+</h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4 sm:px-0">
                  {t("home.hero.mid.description.line2")}
                </p>
              </div>
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">150+</h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4 sm:px-0">
                  {t("home.hero.mid.description.line3")}
                </p>
              </div>
              <div className="text-center space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">200+</h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4 sm:px-0">
                  {t("home.hero.mid.description.line4")}
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 items-center">
              <div className="flex items-center justify-center order-2 lg:order-1">
                <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px] aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/food_eat.jpg"
                    width="700"
                    height="525"
                    alt="Students from underprivileged backgrounds attending NEET coaching classes"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter leading-tight">
                  {t("home.hero.mid.second.line1")}
                </h3>
                <p className="max-w-none lg:max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  {t("home.hero.mid.second.line2")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Star Volunteer Voting Section */}
        <StarVolunteerVoting />

        {/* Student Application Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-50 via-white to-[#f2b705]/10" id="apply">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-[#2b3359]">
                  Apply for Free NEET Coaching
                </h2>
                <p className="max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0">
                  Join thousands of students who have achieved their NEET dreams with our comprehensive free coaching program designed specifically for economically weaker sections and tribal communities.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 items-center">
              <div className="flex items-center justify-center order-2 lg:order-1">
                <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px] aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-xl">
                  <img
                    src="/volunteer_image.jpg"
                    width="700"
                    height="525"
                    alt="NEET aspirants in coaching class at Lift for Upliftment"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-6 sm:space-y-8 order-1 lg:order-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-[#2b3359]">
                    <h3 className="text-lg sm:text-xl font-bold text-[#2b3359] mb-2">Expert Faculty</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Learn from experienced teachers with proven NEET success records</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-[#f2b705]">
                    <h3 className="text-lg sm:text-xl font-bold text-[#f2b705] mb-2">100% Free</h3>
                    <p className="text-gray-600 text-sm sm:text-base">No fees, no hidden costs - education should be accessible to all</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-[#fbbf24]">
                    <h3 className="text-lg sm:text-xl font-bold text-[#fbbf24] mb-2">Proven Results</h3>
                    <p className="text-gray-600 text-sm sm:text-base">3,456+ successful NEET qualifiers since 2015</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-[#1e293b]">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1e293b] mb-2">Support System</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Complete guidance from application to medical college admission</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Eligibility Criteria</h3>
                  <ul className="space-y-2 sm:space-y-3 text-gray-600">
                    <li className="flex items-center text-sm sm:text-base">
                      <span className="text-[#f2b705] mr-2 sm:mr-3">✔</span>
                      12th passed/appearing with PCB
                    </li>
                    <li className="flex items-center text-sm sm:text-base">
                      <span className="text-[#f2b705] mr-2 sm:mr-3">✔</span>
                      Family income below ₹3 lakhs per annum
                    </li>
                    <li className="flex items-center text-sm sm:text-base">
                      <span className="text-[#f2b705] mr-2 sm:mr-3">✔</span>
                      Belong to SC/ST/OBC/EWS category
                    </li>
                    <li className="flex items-center text-sm sm:text-base">
                      <span className="text-[#f2b705] mr-2 sm:mr-3">✔</span>
                      Strong motivation to become a doctor
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link
                    to={"/apply-neet"}
                    className="inline-flex h-12 sm:h-14 md:h-16 items-center justify-center rounded-lg bg-gradient-to-r from-[#2b3359] via-[#1e293b] to-[#f2b705] px-8 sm:px-12 text-base sm:text-lg md:text-xl font-semibold text-white shadow-lg transition-all hover:from-[#1e293b] hover:via-[#f2b705] hover:to-[#fbbf24] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Apply Now - Limited Seats!
                  </Link>
                  <p className="mt-3 text-xs sm:text-sm text-gray-500">
                    Application deadline: Rolling admissions throughout the year
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 sm:mt-16 text-center">
              <div className="bg-gradient-to-r from-[#2b3359]/10 via-[#f2b705]/10 to-[#fbbf24]/10 p-6 sm:p-8 rounded-lg sm:rounded-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-[#2b3359] mb-4">Success Stories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-[#2b3359] mb-2">12,847+</div>
                    <div className="text-gray-600 text-sm sm:text-base">Students Enrolled</div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-[#f2b705] mb-2">3,456+</div>
                    <div className="text-gray-600 text-sm sm:text-base">NEET Qualified</div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-2">1,234+</div>
                    <div className="text-gray-600 text-sm sm:text-base">In Medical Colleges</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact Section with Real LFU Statistics */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-[#2b3359] via-[#1e293b] to-[#0f172a]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-white">
                  Our Impact Since 2015
                </h2>
                <p className="max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] text-white/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0">
                  Creating Better Humans - The glorious result of LFU bearing testimonials of our passion, dedication and hardworking
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f2b705] mb-2">220+</div>
                <div className="text-white/90 text-sm sm:text-base md:text-lg">Students became Doctors</div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">Dreams fulfilled</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fbbf24] mb-2">101</div>
                <div className="text-white/90 text-sm sm:text-base md:text-lg">MBBS Admissions</div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">In medical colleges</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f2b705] mb-2">75</div>
                <div className="text-white/90 text-sm sm:text-base md:text-lg">BAMS Students</div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">Ayurveda doctors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fbbf24] mb-2">20</div>
                <div className="text-white/90 text-sm sm:text-base md:text-lg">Core Tribal Students</div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">First in history</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-[#f2b705] mb-2">17</div>
                <div className="text-white/90 text-sm sm:text-base">BDS Admissions</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-2">21</div>
                <div className="text-white/90 text-sm sm:text-base">BHMS Students</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-[#f2b705] mb-2">38</div>
                <div className="text-white/90 text-sm sm:text-base">Paramedical Courses</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl border border-white/20 max-w-4xl mx-auto">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4">Vision 2035</h3>
                <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed px-4 sm:px-0">
                  LFU has set an ambitious target to produce 100+ MBBS doctors from the Melghat and Gadchiroli regions by 2035, 
                  empowering these communities with skilled healthcare professionals who can provide culturally sensitive care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Branches Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-[#2b3359]">
                  Our Approach - Two Branches, One Mission
                </h2>
                <p className="max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0">
                  Providing comprehensive NEET preparation through strategically located centers
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg border-l-4 border-[#2b3359]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                  <div className="w-12 h-12 bg-[#2b3359] rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 sm:mb-0 sm:mr-4">1</div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2b3359]">Pune Branch</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Main Branch - Since 2014</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Since 2014, LFU has been running a free coaching class in Pune, providing offline teaching for students 
                    from all over Maharashtra. Our main branch offers comprehensive facilities and experienced faculty.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#2b3359] mb-2 text-sm sm:text-base">Location:</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Balvikas Shikshan Sanstha, Sasson Quarters, Opp SBI Treasury branch, Somwar peth, Pune 411001
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#2b3359]/10 text-[#2b3359] rounded-full text-xs sm:text-sm">Offline Teaching</span>
                    <span className="px-3 py-1 bg-[#f2b705]/10 text-[#f2b705] rounded-full text-xs sm:text-sm">All Maharashtra</span>
                    <span className="px-3 py-1 bg-[#fbbf24]/10 text-[#fbbf24] rounded-full text-xs sm:text-sm">Since 2014</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-lg border-l-4 border-[#f2b705]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                  <div className="w-12 h-12 bg-[#f2b705] rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 sm:mb-0 sm:mr-4">2</div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#f2b705]">Ulgulaan Branch</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Residential Coaching</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    LFU's Ulgulaan branch, located in Osmanabad, provides residential coaching for tribal students from 
                    remote areas like Gadchiroli and Melghat, offering complete support and accommodation.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#f2b705] mb-2 text-sm sm:text-base">Location:</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      "Swapnapurti Campus" Sanja Road, Shams Colony, Osmanabad (Dharashiv) 413501
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#f2b705]/10 text-[#f2b705] rounded-full text-xs sm:text-sm">Residential</span>
                    <span className="px-3 py-1 bg-[#2b3359]/10 text-[#2b3359] rounded-full text-xs sm:text-sm">Tribal Students</span>
                    <span className="px-3 py-1 bg-[#fbbf24]/10 text-[#fbbf24] rounded-full text-xs sm:text-sm">Remote Areas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Sarvodaya Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#f2b705]/10 via-white to-[#fbbf24]/10">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none text-[#2b3359]">
                  Mission Sarvodaya
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 md:text-lg leading-relaxed">
                    The 20 days residential Foundation Course by the "Lift For Upliftment" aims to empower class 10th tribal 
                    students from Melghat and Gadchiroli regions by providing comprehensive education.
                  </p>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-[#2b3359] mb-4">Program Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#f2b705] mr-3 mt-1">•</span>
                        <span className="text-gray-700">Basic Mathematics & Science Foundation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#f2b705] mr-3 mt-1">•</span>
                        <span className="text-gray-700">English Language Development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#f2b705] mr-3 mt-1">•</span>
                        <span className="text-gray-700">Self-Study Methods & Career Guidance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#f2b705] mr-3 mt-1">•</span>
                        <span className="text-gray-700">Health Education & Life Skills</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#2b3359]/5 p-4 rounded-lg">
                    <p className="text-[#2b3359] font-medium">
                      Successfully conducting since 2023 in collaboration with PO office Dharni and PO office Aheri 
                      of Tribal Dept, Maharashtra Govt.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[650px] aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                  <img
                    src="/donation_work_1.jpg"
                    width="700"
                    height="525"
                    alt="Mission Sarvodaya - Foundation course for tribal students"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CSR Partners Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 md:mb-16">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-[#2b3359]">
                  Our CSR Partners
                </h2>
                <p className="max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0">
                  Together we are contributing back to society & helping hidden & unprivileged talents achieve their dreams
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#2b3359]">TATA</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#f2b705]">AARTI</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#2b3359]">NARAYANA</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#f2b705]">SAHYADRI</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-sm sm:text-base md:text-xl font-bold text-[#2b3359] text-center">CF FOUNDATION</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-xs sm:text-sm md:text-xl font-bold text-[#f2b705] text-center">AMINES & PLASTICIZERS</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-xs sm:text-sm md:text-xl font-bold text-[#2b3359] text-center">GOVT. OF MAHARASHTRA</div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24 sm:h-32">
                <div className="text-lg sm:text-xl md:text-xl font-bold text-[#f2b705]">TEAM ONE</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#2b3359] to-[#f2b705] p-6 sm:p-8 rounded-lg sm:rounded-xl text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Join Our Mission</h3>
                <p className="mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Through "Lift For Upliftment" We Are Doing Our Bits Of Contributing Back To The Society & 
                  Helping Hidden & Unprivileged Talents To Achieve Dreams.
                </p>
                <Link
                  to={"/volunteer"}
                  className="inline-flex h-10 sm:h-12 items-center justify-center rounded-md bg-white px-6 sm:px-8 text-sm sm:text-base font-semibold text-[#2b3359] shadow transition-all hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Empowerment Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-[#2b3359]/5">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none text-[#2b3359]">
                  Social Empowerment
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl leading-relaxed">
                  Nurturing Future Leaders through comprehensive development programs
                </p>
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#2b3359] rounded-lg flex items-center justify-center text-white text-2xl mb-6">📢</div>
                <h3 className="text-xl font-bold text-[#2b3359] mb-4">Social Awareness Camps</h3>
                <p className="text-gray-600 leading-relaxed">
                  LFU organizes social awareness camps to inspire students to contribute to society and develop 
                  a sense of social responsibility.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#f2b705] rounded-lg flex items-center justify-center text-white text-2xl mb-6">💬</div>
                <h3 className="text-xl font-bold text-[#f2b705] mb-4">Soft Skills Development</h3>
                <p className="text-gray-600 leading-relaxed">
                  LFU focuses on building students' confidence, empathy, and communication skills through 
                  various programs and workshops.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-[#fbbf24] rounded-lg flex items-center justify-center text-white text-2xl mb-6">🎓</div>
                <h3 className="text-xl font-bold text-[#fbbf24] mb-4">Post-NEET Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  LFU provides comprehensive post-NEET support, including counselling, admission assistance, 
                  financial aid, and mentorship during graduation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
          id="donate"
        >
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                  {t("home.hero.mid.feedback.title")}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl leading-relaxed">
                  {t("home.hero.mid.feedback.line1")}
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[650px] aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/donation_main.jpg"
                    width="700"
                    height="525"
                    alt="Students sharing feedback about NEET coaching program"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-full max-w-lg mx-auto space-y-6">
                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder={t("forms.name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4"
                    />
                    <input
                      type="email"
                      placeholder={t("forms.email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4"
                    />
                    <input
                      type="tel"
                      placeholder={t("forms.phone")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4"
                    />
                    <input
                      type="text"
                      placeholder={t("forms.title")}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4"
                    />
                    <textarea
                      placeholder={t("forms.description")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full flex-1 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 min-h-[140px] px-4 py-3"
                    ></textarea>
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      {t("home.hero.mid.feedback.button")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Section */}
        <section className="w-full py-12 md:py-24 lg:py-32" id="volunteer">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                  {t("home.hero.bottom.title")}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl leading-relaxed">
                  {t("home.hero.bottom.description")}
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[650px] aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/volunteer_image.jpg"
                    width="700"
                    height="525"
                    alt="Medical professionals volunteering to teach NEET coaching"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between h-full min-h-[400px]">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none text-justify">
                    {t("home.hero.volunteer.title")}
                  </h3>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed text-justify">
                    {t("home.hero.volunteer.description")}
                  </p>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleVolunteerClick}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t("home.hero.volunteer.button")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

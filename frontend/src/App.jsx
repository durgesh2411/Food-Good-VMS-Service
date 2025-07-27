// import React, { useState, useEffect } from "react";

// import {
//   RouterProvider,
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
// } from "react-router-dom";
// import Donation from "./components/Donation/Donation";
// import "./App.css";

// import { SignIn } from "./components/SignIn/SignIn";
// import Home from "./components/Home/Home";
// import { SignUp } from "./components/SignUp/SignUp";
// import Layout from "./Layout";
// import Event from "./components/Event/Event";
// import EventDetails from "./components/Event/EventDetails";
// import CreateEvent from "./components/Event/CreateEvent";
// import { LeaderBoard } from "./components/LeaderBoard/leader-board";
// import { Error } from "./components/Error/Error";
// import Loader from "./components/Loader/Loader";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Dashboard from "./components/Dashboard/Dashboard";
// import Post from "./components/Posts/Post";
// import Announcement from "./components/Announcement/AllAnnoucements";
// import CreateAnnouncement from "./components/Announcement/CreateAnnouncement";
// import PostAdmin from "./components/Posts/PostAdmin";
// import PostCardAdmin from "./components/Posts/PostCardAdmin";
// import PostCard from "./components/Posts/PostCard";

// function App() {
//   const [data, setData] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios.interceptors.request.use(
//       (config) => {
//         setLoading(true);
//         return config;
//       },
//       (error) => {
//         setLoading(false);
//         return Promise.reject(error);
//       }
//     );

//     axios.interceptors.response.use(
//       (response) => {
//         setLoading(false);
//         return response;
//       },
//       (error) => {
//         setLoading(false);
//         return Promise.reject(error);
//       }
//     );
//   }, []);

//   const route = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<Layout />}>
//         <Route path="" element={<Home />} />
//         <Route path="/login" element={<SignIn setData={setData} />} />
//         <Route path="/register" element={<SignUp />} />
//         <Route path="/events" element={<Event />} />
//         <Route path="/donate" element={<Donation />} />
//         <Route path="/leaderboard" element={<LeaderBoard />} />
//         <Route path="/posts" element={<Post />} />
//         <Route path="/posts/create" element={<PostAdmin />} />
//         <Route path="/announcements" element={<Announcement />} />
//         <Route path="/events/:eventId" element={<EventDetails />} />
//         <Route path="/events/create" element={<CreateEvent />} />
//         <Route path="/announcements/create" element={<CreateAnnouncement />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//         <Route path="*" element={<Error />} />
//       </Route>
//     )
//   );
//   return (
//     <>
//       <Loader show={loading} />
//       <RouterProvider router={route} />
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Donation from "./components/Donation/Donation";
import "./App.css";

import { SignIn } from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";
import { SignUp } from "./components/SignUp/SignUp";
import Layout from "./Layout";
import Event from "./components/Event/Event";
import EventDetails from "./components/Event/EventDetails";
import CreateEvent from "./components/Event/CreateEvent";
import { LeaderBoard } from "./components/LeaderBoard/leader-board";
import { Error } from "./components/Error/Error";
import Loader from "./components/Loader/Loader";
import axios from "axios";
import Dashboard from "./components/Dashboard/Dashboard";
import Post from "./components/Posts/Post";
import CreatePost from "./components/Posts/CreatePost";
import VolunteerMyPosts from "./components/Posts/VolunteerMyPosts";
import Announcement from "./components/Announcement/AllAnnoucements";
import CreateAnnouncement from "./components/Announcement/CreateAnnouncement";
import PostAdmin from "./components/Posts/PostAdmin";
import PostCardAdmin from "./components/Posts/PostCardAdmin";
import PostCard from "./components/Posts/PostCard";
import StarVotingPage from "./components/StarVoting/StarVotingPage";
import ChatbotWidget from "./components/ChatbotWidget";
import { toast } from "react-toastify";

// --- Ensure axios sends cookies with every request ---
axios.defaults.withCredentials = true;

function App() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthResult = urlParams.get('oauth');
    const userParam = urlParams.get('user');
    const errorMessage = urlParams.get('message');

    if (oauthResult === 'success' && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log('✅ OAuth success, user data:', userData);
        
        // Save user data to localStorage and state
        localStorage.setItem("user", JSON.stringify(userData));
        setData(userData);
        
        // Show success message
        toast.success(`Welcome back, ${userData.fullName}! Login successful.`);
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
      } catch (error) {
        console.error('❌ Error parsing OAuth user data:', error);
        toast.error('Login successful but failed to parse user data');
      }
    } else if (oauthResult === 'error') {
      console.error('❌ OAuth error:', errorMessage);
      toast.error(errorMessage || 'Google Sign-In failed');
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Disable global loading for better navigation experience
  // Each page component will handle its own loading state
  useEffect(() => {
    // Only show global loading for critical operations like authentication
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        // Only show global loading for login/logout operations
        if (config.url?.includes('/login') || config.url?.includes('/logout') || config.url?.includes('/register')) {
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        // Only hide loading for the same operations
        if (response.config.url?.includes('/login') || response.config.url?.includes('/logout') || response.config.url?.includes('/register')) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const route = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/login" element={<SignIn setData={setData} />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/events" element={<Event />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/my-posts" element={<VolunteerMyPosts />} />
        <Route path="/posts/admin" element={<PostAdmin />} />
        <Route path="/vote-stars" element={<StarVotingPage />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/announcements/create" element={<CreateAnnouncement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Route>
    )
  );

  return (
    <>
      <Loader show={loading} />
      <RouterProvider router={route} />
      <ChatbotWidget />
    </>
  );
}

export default App;

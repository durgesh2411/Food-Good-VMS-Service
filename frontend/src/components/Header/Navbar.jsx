import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { backendUrl } from "../../lib/constant";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data to determine if they are admin
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Attempting to fetch current user...");
        const response = await axios.get(`${backendUrl}/users/current-user`, {
          withCredentials: true,
        });
        if (response.data.success) {
          console.log("User authenticated:", response.data.data);
          setUser(response.data.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("User not logged in or error fetching user data:", error.response?.status);
        setIsLoggedIn(false);
        setUser(null);
        // Clear any stale local storage if authentication fails
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    };

    fetchUser();
  }, []);

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        name: "Home",
        to: "/",
      },
      {
        name: "Events",
        to: "/events",
      },
      {
        name: "Donate Us",
        to: "/donate",
      },
      {
        name: "Dashboard",
        to: "/dashboard",
      },
      {
        name: "Announcements",
        to: "/announcements",
      },
      {
        name: "Posts",
        to: user?.isAdmin ? "/posts/admin" : "/posts",
      },
      {
        name: "Leaderboard",
        to: "/leaderboard",
      },
    ];

    // Add "Vote Stars" for regular users only
    if (user && user.role === "user") {
      baseItems.splice(-1, 0, {
        name: "Vote Stars",
        to: "/vote-stars",
      });
    }

    return baseItems;
  };
  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // Call logout endpoint
      await axios.post(`${backendUrl}/users/logout`, {}, { withCredentials: true });
      console.log("Logout API call successful");
      
      // Clear all local storage items
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      
      // Clear state immediately
      setIsLoggedIn(false);
      setUser(null);
      
      // Use React Router navigation instead of window.location
      navigate("/login");
      
    } catch (error) {
      console.error("Logout error:", error);
      console.log("Clearing local state even after logout error");
      
      // Even if the logout request fails, clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      setUser(null);
      
      // Use React Router navigation instead of window.location
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (show) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full bg-[#2b3359] text-white sticky top-0 shadow-lg z-40 ${
        isScrolled
          ? "bg-opacity-40 bg-[#2b3359] backdrop-blur-md shadow-sm transition-all ease-in-out"
          : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <span>
            <Link to="/">
              <img
                src="/logo.png"
                width="80"
                height="66"
                alt="Logo"
                className="h-[4rem]"
              />
            </Link>
          </span>
        </div>
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8">
            {getMenuItems().map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:text-[#f2b705]
                  ${
                    isActive
                      ? "font-semibold text-[#f2b705]"
                      : "font-semibold text-white"
                  }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            <div className=" lg:block flex items-center -m-3 rounded-md p-3 text-sm font-semibold hover:text-[#f2b705]">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </ul>
        </div>
        <div className="hidden lg:block">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {user && (
                <span className="text-sm text-white">
                  Welcome, {user.fullName || user.email}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
              >
                Log In
              </button>
            </Link>
          )}
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-[#2b3359] shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2"></div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {getMenuItems().map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          `-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:text-[#f2b705]
                        ${
                          isActive
                            ? "font-semibold text-[#f2b705]"
                            : "font-semibold text-white"
                        }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                    <div className="mt-4 w-full">
                      <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </nav>
                </div>
                {isLoggedIn ? (
                  <div className="mt-4">
                    {user && (
                      <div className="mb-3 text-center text-sm text-white">
                        Welcome, {user.fullName || user.email}
                      </div>
                    )}
                    <button
                      type="button"
                      className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:text-black transition-all ease-in-out duration-300"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link to="/login">
                    <button
                      type="button"
                      className="mt-4 w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:text-black transition-all ease-in-out duration-300"
                    >
                      Log In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

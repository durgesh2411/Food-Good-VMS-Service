import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { backendUrl } from "../../lib/constant";
import { useAuth } from "../../contexts/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const { i18n, t } = useTranslation();

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        name: t("nav.home"),
        to: "/",
      },
      {
        name: t("nav.events"),
        to: "/events",
      },
      {
        name: t("nav.donate"),
        to: "/donate",
      },
      {
        name: t("nav.dashboard"),
        to: "/dashboard",
      },
      {
        name: t("nav.announcements"),
        to: "/announcements",
      },
      {
        name: t("nav.posts"),
        to: user?.isAdmin ? "/posts/admin" : "/posts",
      },
      {
        name: t("nav.hallOfFame"),
        to: "/hall-of-fame",
      },
      {
        name: t("nav.leaderboard"),
        to: "/leaderboard",
      },
    ];

    return baseItems;
  };
  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // Close mobile menu if open
      setIsMenuOpen(false);

      // Use the authentication context to handle logout
      await logout();

      console.log("Logout successful - redirecting to login");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Navigate to login even if logout fails
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

    const handleResize = () => {
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={`w-full bg-[#2b3359] text-white sticky top-0 shadow-lg z-40 ${
        isScrolled
          ? "bg-opacity-40 bg-[#2b3359] backdrop-blur-md shadow-sm transition-all ease-in-out"
          : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-4 py-2 lg:px-6 xl:px-8">
        {/* Logo Section */}
        <div className="inline-flex items-center space-x-2 px-1 sm:px-2 py-1 flex-shrink-0">
          <span className="flex items-center">
            <Link to="/" className="block">
              <img
                src="/logo.png"
                width="85"
                height="70"
                alt="Logo"
                className="h-[2.5rem] sm:h-[3rem] lg:h-[3.5rem] w-auto object-contain rounded-lg"
              />
            </Link>
          </span>
        </div>

        {/* Main Navigation Group - Show on tablet landscape and desktop */}
        <div className="hidden lg:flex xl:flex flex-1 justify-center">
          <ul className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
            {getMenuItems().map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-1 lg:px-2 py-2 text-xs lg:text-sm font-semibold hover:text-[#f2b705] whitespace-nowrap transition-colors duration-200
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
          </ul>
        </div>

        {/* User Actions Group - Show on tablet landscape and desktop */}
        <div className="hidden lg:flex items-center space-x-2 lg:space-x-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-black px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black whitespace-nowrap"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="rounded-md bg-black px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black whitespace-nowrap"
              >
                Log In
              </button>
            </Link>
          )}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-md bg-black px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        {/* Mobile Menu Button - Show on mobile and tablet portrait */}
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 top-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeMenu}
            ></div>

            {/* Mobile Menu */}
            <div className="relative">
              <div className="absolute inset-x-0 top-0 transform p-2 sm:p-4">
                <div className="divide-y-2 divide-gray-50 rounded-lg bg-[#2b3359] shadow-lg ring-1 ring-black ring-opacity-5 max-h-screen overflow-y-auto">
                  <div className="px-4 sm:px-5 pb-6 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-2">
                        <img
                          src="/logo.png"
                          width="60"
                          height="50"
                          alt="Logo"
                          className="h-[2.5rem] w-auto object-contain rounded-lg"
                        />
                      </div>
                      <div className="-mr-2">
                        <button
                          type="button"
                          onClick={closeMenu}
                          className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          <span className="sr-only">Close menu</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <nav className="grid gap-y-2 sm:gap-y-4">
                        {getMenuItems().map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                              `-m-3 flex items-center rounded-md p-3 text-sm sm:text-base font-semibold hover:text-[#f2b705] transition-colors duration-200
                            ${
                              isActive
                                ? "font-semibold text-[#f2b705] bg-gray-700"
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
                            className="w-full rounded-md bg-black px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all ease-in-out duration-300 hover:text-black"
                          >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                      </nav>
                    </div>
                    {isAuthenticated ? (
                      <div className="mt-4">
                        {user && (
                          <div className="mb-3 text-center text-sm sm:text-base text-white p-2 bg-gray-700 rounded-md">
                            Welcome, {user.fullName || user.email}
                          </div>
                        )}
                        <button
                          type="button"
                          className="w-full rounded-md bg-black px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:text-black transition-all ease-in-out duration-300"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={closeMenu}>
                        <button
                          type="button"
                          className="mt-4 w-full rounded-md bg-black px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#f2b705] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:text-black transition-all ease-in-out duration-300"
                        >
                          Log In
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

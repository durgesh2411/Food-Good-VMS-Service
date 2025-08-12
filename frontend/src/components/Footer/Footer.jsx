import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <section className="relative overflow-hidden py-12 bg-gray-50">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-6 inline-flex items-center">
                <img src="/logo.png" width="80" height="66" alt="Lift for Upliftment Logo" />
                <span className="ml-4 text-xl font-bold text-primary">Lift for Upliftment</span>
              </div>
              <div>
                <p className="mb-4 text-base font-medium text-gray-700 leading-relaxed">
                  Empowering aspiring doctors from underprivileged backgrounds through free, high-quality NEET coaching. Breaking financial barriers to create the next generation of medical professionals.
                </p>
                <p className="text-sm text-gray-600">
                  &copy; 2025 Lift for Upliftment. All rights reserved.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-6 text-xs font-semibold uppercase text-gray-500">
                Programs
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/apply-neet"
                  >
                    NEET Coaching
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/events"
                  >
                    Events
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/hall-of-fame"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/leaderboard"
                  >
                    Mentors
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-6 text-xs font-semibold uppercase text-gray-500">
                Get Involved
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/volunteer"
                  >
                    Become a Mentor
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/donate"
                  >
                    Support Us
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/posts"
                  >
                    Share Your Story
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/feedback"
                  >
                    Give Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-6 text-xs font-semibold uppercase text-gray-500">
                About Us
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/about"
                  >
                    Our Mission
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/announcements"
                  >
                    Announcements
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
                    href="tel:+91-9876543210"
                  >
                    +91-9876543210
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
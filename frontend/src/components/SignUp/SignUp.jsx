import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../../lib/constant";

export function SignUp() {
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [role, setRole] = useState("user");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  // Handle avatar file selection and preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = () => {
    // Check if backend OAuth is configured
    const backendOAuthUrl = `${backendUrl}/auth/google`;
    
    // For now, show info message until OAuth is fully configured
    toast.info("Google Sign Up is available! Setting up requires Google Cloud credentials. See GOOGLE_OAUTH_SETUP.md for instructions.");
    
    // Uncomment when OAuth credentials are configured:
    // window.location.href = backendOAuthUrl;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation first
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      number === "" ||
      !avatar
    ) {
      toast.error("All fields are required, including avatar image");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(number)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('number', number);
    formData.append('avatar', avatar);
    formData.append('role', role);

    console.log("Sending request with payload:", {
      fullName,
      email,
      password,
      number,
      avatar: avatar ? {
        name: avatar.name,
        size: avatar.size,
        type: avatar.type
      } : 'No file selected',
      role,
    });

    console.log("Avatar file details:", avatar);

    axios
      .post(`${backendUrl}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Registration success:", response.data);
        setfullName("");
        setEmail("");
        setPassword("");
        setAvatar("");
        setAvatarPreview("");
        setNumber("");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);

        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.response?.status === 500) {
          toast.error("Server error during registration. Please check if avatar file is valid and try again.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      });
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              Sign up
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Full Name{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Full Name"
                      id="name"
                      value={fullName}
                      onChange={(e) => setfullName(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone-number"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Phone Number{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="tel"
                      placeholder="Phone Number"
                      id="phone-number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Password{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="avatar"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Upload Avatar{" "}
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      className="hidden"
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md bg-gray-200 px-3.5 py-2.5 font-semibold leading-7 text-gray-900 hover:bg-gray-300"
                    >
                      Choose File
                    </label>
                    {avatarPreview && (
                      <div className="ml-4 flex items-center space-x-2">
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                        />
                        <span className="text-sm text-gray-600">
                          {avatar?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label>Select your Role: </label>
                  <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                    }}
                  >
                    <option value="user">User</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  >
                    Create Account <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
              >
                <span className="mr-2 inline-block">
                  <svg
                    className="h-6 w-6 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </span>
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="https://plus.unsplash.com/premium_photo-1682092585257-58d1c813d9b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TkdPfGVufDB8fDB8fHww"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

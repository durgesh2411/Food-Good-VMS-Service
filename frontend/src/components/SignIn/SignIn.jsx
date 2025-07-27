import { useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { backendUrl } from "../../lib/constant";
import { useAuth } from "../../contexts/AuthContext";

axios.defaults.withCredentials = true;

export function SignIn({ setData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    // Redirect to backend OAuth endpoint
    const backendOAuthUrl = `${backendUrl}/auth/google`;
    window.location.href = backendOAuthUrl;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
axios
  .post(`${backendUrl}/users/login`, formData, {
    withCredentials: true,  // This is crucial for cookies
  })
  .then(async (response) => {
    console.log(response.data);
    const data = response.data;
    const userData = data ? data.data.user : null;
    const accessToken = data ? data.data.accessToken : null;

    // Use the authentication context to handle login
    await login(userData, accessToken);

    setData(userData);
    setEmail("");
    setPassword("");

    // Get the intended destination from location state, or default to home
    const from = location.state?.from?.pathname || '/';
    navigate(from);
  })
      .catch((error) => {
        // setError(error.response.data.message);
        console.log(error);
        if (error.response) {
          // Assuming 401 status for incorrect password
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message || "An error occurred");
        }
      });

    // Add your sign-in logic here
    if (email === "" || password === "") {
      toast.error("All fields are required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }
  };

  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className="h-full w-full">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="https://media.istockphoto.com/id/524903696/photo/poor-indian-children-asking-for-food-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=DqMSvVaXQxISjdvfNizw6F9ZkaCBMy42Yk6agRcJUE8="
            alt=""
          />
        </div>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              {t("auth.login.title")}
            </h2>
            <p className="mt-2 text-base text-gray-600">
              {t("auth.login.noAccount")}{" "}
              <Link
                className="font-medium text-black transition-all duration-200 hover:underline"
                to="/register"
              >
                {t("auth.login.signUp")}
              </Link>
            </p>
            <form onSubmit={handleSignIn} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    {t("auth.login.email")}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder={t("auth.login.email")}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      {t("auth.login.password")}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder={t("auth.login.password")}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    ></input>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    onClick={handleSignIn}
                  >
                    {t("auth.login.button")} <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
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
                {t("auth.login.googleButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

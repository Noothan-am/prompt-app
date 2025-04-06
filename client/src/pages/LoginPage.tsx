import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left column - Background */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
        {/* Decorative squares */}
        <div className="absolute top-24 left-24 w-20 h-20 bg-red-500 opacity-70"></div>
        <div className="absolute bottom-48 left-48 w-32 h-32 bg-purple-600 rounded-lg opacity-50"></div>
        <div className="absolute bottom-24 left-24 w-24 h-24 bg-blue-500 rounded-lg opacity-60"></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-pink-500 rounded-sm opacity-60"></div>
      </div>

      {/* Right column - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <div className="h-8 w-8 rounded bg-red-500 text-white flex items-center justify-center mr-2">
              <span className="font-bold">+</span>
            </div>
            <span className="text-gray-800 font-medium">tempo</span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
              WELCOME
            </h1>
            <h1 className="text-4xl font-bold text-gray-900 mb-8 uppercase tracking-wide">
              BACK.
            </h1>
            <p className="text-gray-600">Log in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-gray-900 hover:text-gray-700"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500"></span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Log In with Google
              </button>
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                Log In with Facebook
              </button>
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <FaApple className="h-5 w-5 mr-2" />
                Log In with Apple
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-gray-900 hover:text-gray-700 underline"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-16 text-center text-xs text-gray-500">
            ©Tempo, Inc 2023
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

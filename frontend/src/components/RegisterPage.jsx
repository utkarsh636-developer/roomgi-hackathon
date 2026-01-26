import React from 'react';

const RegisterPage = ({ onShowLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left Side */}
        <div className="relative hidden md:block">
          <img
            src="/images/login-page-image.avif"
            alt="Register background"
            className="w-[400px] h-full hidden rounded-l-2xl md:block object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Create Account</span>
          <span className="font-light text-gray-400 mb-8">
            Start your journey with us
          </span>
          <div className="py-4">
            <span className="mb-2 text-md">Username</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="username"
              id="username"
              placeholder="Choose a username"
            />
          </div>
          <div className="py-4">
            <span className="mb-2 text-md">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="py-4">
            <span className="mb-2 text-md">Password</span>
            <input
              type="password"
              name="pass"
              id="pass"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            onClick={onShowLogin} // Temporarily navigates to login on click
            className="w-full bg-indigo-600 text-white p-2 rounded-lg mb-6 hover:bg-indigo-700"
          >
            Register
          </button>
          <div className="text-center text-gray-400">
            Already have an account?
            <span
              onClick={onShowLogin}
              className="font-bold text-indigo-600 cursor-pointer"
            >
              {' '}
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

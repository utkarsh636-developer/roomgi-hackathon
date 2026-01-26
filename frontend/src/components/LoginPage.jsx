import React from 'react';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left Side */}
        <div className="relative hidden md:block">
          <img
            src="/images/login-page-image.avif"
            alt="Login background"
            className="w-[400px] h-full hidden rounded-l-2xl md:block object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold font-montserrat">Welcome back</span>
          <span className="font-normal text-gray-500 mb-8 font-montserrat">
            Please enter your details
          </span>
          <div className="py-4">
            <span className="mb-2 text-md font-montserrat">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="py-4">
            <span className="mb-2 text-md font-montserrat">Password</span>
            <input
              type="password"
              name="pass"
              id="pass"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              {/* <input type="checkbox" name="ch" id="ch" className="mr-2" />
              <span className="text-md font-montserrat">Remember for 30 days</span> */}
            </div>
            {/* <span className="font-bold textsim-md font-montserrat cursor-pointer">Forgot password</span> */}
          </div>
          <button
            onClick={onLogin}
            className="w-full bg-indigo-600 text-white p-2 rounded-lg mb-6 hover:bg-indigo-700 hover:text-white"
          >
            Sign in
          </button>
          <div className="text-center text-gray-500 font-montserrat">
            Dont have an account?
            <span className="font-bold text-indigo-600 cursor-pointer"> Register for free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

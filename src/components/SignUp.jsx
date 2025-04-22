import React from 'react';

const SignUp = () => (
  <>
    <section className="flex items-center justify-center min-h-[88vh] bg-gradient-to-r from-yellow-100 to-orange-200">
      <div className="bg-white shadow-lg rounded-lg px-8 py-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign up for your account</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Sign up
          </button>
          <div className="flex justify-between items-center mt-3">
            <span className="text-gray-500 text-sm">Already have an account?</span>
            <a href="/login" className="text-sm text-blue-600 hover:underline">Log in</a>
          </div>
        </form>
      </div>
    </section>
  </>
);

export default SignUp;
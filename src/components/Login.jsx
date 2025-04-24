import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {

  const Navigate = useNavigate();
  return (
    <section className="flex items-center justify-center min-h-[88vh] bg-gradient-to-r from-yellow-100 to-orange-200">
      <div className="bg-white shadow-lg rounded-lg px-8 py-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Log in to Task Manager</h2>
        <form className="space-y-5">
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
            onClick={()=>{
              Navigate('/home')
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Log in
          </button>
          <div className="flex justify-between items-center mt-3">
            <Link to="/forgotPassword" className="text-blue-600 text-sm hover:underline">Forgot password?</Link>
            <Link to="/signup" className="text-sm text-gray-500 hover:underline">Sign up instead</Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Login
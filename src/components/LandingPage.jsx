import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

function LandingPage() {
  const Navigate = useNavigate();
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <section className="bg-white w-full py-16 pt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Capture, organize, and <br /> tackle your to-dos from anywhere.
            </h1>
            <p className="text-lg text-gray-500">
              Escape the clutter and chaos—unleash your productivity with <br />
              <span className="font-bold text-2xl">Task Manager.</span>
            </p>
            <div className="flex items-center gap-4">
              <button
              onClick={()=>{
                Navigate('/signup')
              }}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition">
                Sign up—it's free!
              </button>
              <a
                href="#"
                className="text-blue-700 font-semibold underline text-base"
              >
                Watch video
              </a>
            </div>
          </div>
          {/* Hero image */}
          <div className="flex-1 flex justify-end items-center relative">
            <img
              src="https://ext.same-assets.com/709998530/1956195944.webp"
              alt="Trello app preview"
              className="max-w-xs w-full drop-shadow-2xl z-10"
            />
            {/* Accent shapes */}
            <div className="absolute left-2 bottom-10 w-24 h-24 bg-yellow-400 rounded-lg rotate-12 opacity-60"></div>
            <div className="absolute left-12 bottom-0 w-24 h-24 bg-purple-500 rounded-lg rotate-45 opacity-50"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default LandingPage;

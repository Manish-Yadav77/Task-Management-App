import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-orange-100 text-yellow-800 py-6 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-yellow-700">Task Manager</h2>
          <p className="text-sm text-yellow-600">
            Organize your tasks efficiently with our Kanban board.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-yellow-900 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-yellow-900 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-900 transition">
            Contact
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-4 md:mt-0">
          <p className="text-sm text-yellow-600">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

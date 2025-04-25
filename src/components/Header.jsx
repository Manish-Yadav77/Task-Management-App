import React, { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBoard } from "../context/BoardContext";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { boards } = useBoard();
  const location = useLocation();
  const navigate = useNavigate();

  const url = ['/','/login','/signup'];
  const hideHome = url.includes(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className="bg-gradient-to-r from-yellow-100 to-orange-200 h-20 w-full flex justify-between items-center shadow-md px-4 md:px-10 rounded-b-2xl relative z-50"
      onMouseLeave={() => setShowDropdown(false)}
    >
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-4 relative">
        <img
          src="https://media1.tenor.com/m/yPWPtzJVgM0AAAAd/trello.gif"
          alt="Logo"
          className="h-12 w-12 rounded-full object-cover"
        />

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        {screenWidth >= 768 && (
          <ul className="flex gap-4 items-center">
            <li
              className="relative hover:text-yellow-700 cursor-pointer font-medium text-base flex items-center gap-1"
              onMouseEnter={() => setShowDropdown(true)}
            >
              Workspace <ChevronDown className="w-4 h-4" />
              {showDropdown && (
                <ul
                  className="absolute top-10 left-0 w-48 bg-white shadow-lg rounded-lg p-2 space-y-1 border z-50"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {boards.map((board) => (
                    <li
                      key={board.id}
                      className="px-3 py-2 hover:bg-yellow-50 rounded-md cursor-pointer text-sm font-medium"
                    >
                      <Link to={`/board/${board.id}`}>{board.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            

            <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">Recent</li>
            <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">Templates</li>
            <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">Create</li>
          </ul>
        )}
      </div>

      {/* Right Nav - Desktop */}
      {screenWidth >= 768 && (
        <ul className={`flex gap-6 ${hideHome? 'hidden' : ''}`}>
          <Link to='/home'>
          <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">Home</li>
          </Link>

          <Link to='/about'>
          <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">About</li>
          </Link>

          <Link to='/' onClick={handleLogout}>
          <li className="hover:text-yellow-700 cursor-pointer font-medium text-base">Logout</li>
          </Link>
        </ul>
      )}

      

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-t border-yellow-200 shadow-lg p-4 md:hidden z-40">
          <ul className="flex flex-col gap-3">
            <li className="font-medium text-base hover:text-yellow-700">
              <Link to="/home">Home</Link>
            </li>
            <li className="font-medium text-base hover:text-yellow-700">About</li>
            <li className="font-medium text-base hover:text-yellow-700">Contact</li>
            <li
              className="font-medium text-base hover:text-yellow-700 relative"
              onMouseEnter={() => setShowDropdown(true)}
            >
              Workspace
              {showDropdown && (
                <ul className="mt-2 bg-white border rounded-lg shadow p-2 space-y-1 z-50">
                  {boards.map((board) => (
                    <li
                      key={board.id}
                      className="px-3 py-2 hover:bg-yellow-50 rounded-md cursor-pointer text-sm font-medium"
                    >
                      <Link to={`/board/${board.id}`}>{board.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="font-medium text-base hover:text-yellow-700">Recent</li>
            <li className="font-medium text-base hover:text-yellow-700">Templates</li>
            <li className="font-medium text-base hover:text-yellow-700">Create</li>
            <div className="flex flex-col gap-2 mt-4">
              <button className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition hover:cursor-pointer"
              onClick={()=>{
                navigate('/login')
              }}>
                Login
              </button>
              <button className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition hover:cursor-pointer"
              onClick={()=>{
                navigate('/signup')
              }}>
                Sign Up
              </button>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
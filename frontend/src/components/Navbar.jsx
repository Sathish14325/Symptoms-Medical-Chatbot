import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <nav className="backdrop-blur-md bg-gray-900/60 ring-1 ring-white/10 text-white shadow-md top-0 z-50 w-full p-2.5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">
          <Link to="/" className="hover:text-blue-400 transition duration-300">
            🧬 MediBot
          </Link>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {user && (
            <>
              {["/chatbot", "/symptom-checker", "/image-analysis"].map(
                (path, i) => {
                  const labels = [
                    "🤖 Chatbot",
                    "🛠️ Symptom Checker",
                    "🧠 Image Analysis",
                  ];
                  return (
                    <Link
                      key={i}
                      to={path}
                      className="relative group hover:text-blue-400 transition duration-300"
                    >
                      <span className="pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 group-hover:after:w-full">
                        {labels[i]}
                      </span>
                    </Link>
                  );
                }
              )}
            </>
          )}
        </div>

        {/* Profile / Auth Section */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={`http://localhost:5000/uploads/${user.photo}`}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-white hover:ring-blue-400 transition duration-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 backdrop-blur-md bg-gray-800/80 ring-1 ring-white/10 text-white shadow-lg rounded-lg py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
                  >
                    🧑 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white/10 ring-1 ring-white/20 text-white px-4 py-2 rounded hover:bg-white/20 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white/10 ring-1 ring-white/20 text-white px-4 py-2 rounded hover:bg-white/20 transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-3 backdrop-blur-md bg-gray-800/70 text-white">
          <Link
            to="/chatbot"
            className="group hover:text-blue-400 transition duration-300"
          >
            <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 group-hover:after:w-full">
              🤖 Chatbot
            </span>
          </Link>
          <Link
            to="/symptom-checker"
            className="group hover:text-blue-400 transition duration-300"
          >
            <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 group-hover:after:w-full">
              🛠️ Symptom Checker
            </span>
          </Link>
          <Link
            to="/image-analysis"
            className="group hover:text-blue-400 transition duration-300"
          >
            <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 group-hover:after:w-full">
              🧠 Image Analysis
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

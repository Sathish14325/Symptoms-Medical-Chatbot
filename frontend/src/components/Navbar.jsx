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
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">
          <Link to={"/"}>🧬 MediBot</Link>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {user && (
            <>
              <Link to="/chatbot" className="hover:text-blue-200">
                🤖 Chatbot
              </Link>
              <Link to="/symptom-checker" className="hover:text-blue-200">
                🛠️ Symptom Checker
              </Link>
              <Link to="/image-analysis" className="hover:text-blue-200">
                🤖 Image Analysis
              </Link>
              <Link to="/services" className="hover:text-blue-100">
                🤖 Services
              </Link>
            </>
          )}
        </div>

        {/* Profile / Auth Button */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={`http://localhost:5000/uploads/${user.photo}`}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-white hover:ring-blue-300 transition duration-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-lg py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    🧑 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
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
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-2 bg-blue-500">
          <Link to="/chatbot" className="hover:text-blue-100">
            🤖 Chatbot
          </Link>
          <Link to="/symptom-checker" className="hover:text-blue-100">
            🛠️ Symptom Checker
          </Link>
          <Link to="/image-analysis" className="hover:text-blue-100">
            🤖 Image Analysis
          </Link>
          <Link to="/services" className="hover:text-blue-100">
            🤖 Services
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import axios from "axios";

const FindDoctor = () => {
  const BASE_URL = process.env.BACKEND_URL;
  const [specialist, setSpecialist] = useState("");
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDoctors([]);

    try {
      const response = await axios.post(`${BASE_URL}/api/find-doctor`, {
        specialist,
        location,
      });

      setDoctors(response.data.doctors);
    } catch (err) {
      setError("Failed to fetch doctors. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 rounded-xl shadow-lg text-white transition">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Find a Doctor
      </h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          placeholder="Specialist (e.g., Cardiologist)"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="text"
          placeholder="Location (e.g., Chennai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      <div className="mt-6">
        {doctors.length > 0 ? (
          <ul className="space-y-4">
            {doctors.map((doc, idx) => (
              <li
                key={idx}
                className="bg-gray-800 border border-gray-700 p-4 rounded hover:bg-gray-700 transition"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${doc.lat},${doc.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                </a>
                <p className="text-gray-300">{doc.category}</p>
                <p className="text-sm text-gray-400">{doc.address}</p>
                <p className="text-xs text-gray-500">
                  Lat: {doc.lat}, Lng: {doc.lon}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-gray-500 text-center mt-4">
              No results found yet.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default FindDoctor;

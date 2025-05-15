import React, { useState } from "react";
import axios from "axios";

const FindDoctor = () => {
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
      const response = await axios.post(
        "http://localhost:5000/api/find-doctor",
        {
          specialist,
          location,
        }
      );

      setDoctors(response.data.doctors);
    } catch (err) {
      setError("Failed to fetch doctors. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Find a Doctor</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          placeholder="Specialist (e.g., Cardiologist)"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location (e.g., Chennai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        {doctors.length > 0 ? (
          <ul className="space-y-4">
            {doctors.map((doc, idx) => (
              // <li
              //   key={idx}
              //   className="border border-gray-200 p-4 rounded shadow-sm"
              // >
              //   <h3 className="text-lg font-semibold">{doc.name}</h3>
              //   <p className="text-gray-600">{doc.category}</p>
              //   <p className="text-sm text-gray-500">{doc.address}</p>
              //   <p className="text-xs text-gray-400">
              //     Lat: {doc.lat}, Lng: {doc.lon}
              //   </p>
              // </li>
              <li
                key={idx}
                className="border border-gray-200 p-4 rounded shadow-sm hover:bg-gray-50 transition"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${doc.lat},${doc.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                </a>
                <p className="text-gray-600">{doc.category}</p>
                <p className="text-sm text-gray-500">{doc.address}</p>
                <p className="text-xs text-gray-400">
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

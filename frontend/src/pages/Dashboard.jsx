import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [symptomHistory, setSymptomHistory] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedImageEntry, setSelectedImageEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  //console.log(setSymptomHistory);
  const openSymptomModal = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const openImageModal = (entry) => {
    setSelectedImageEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setSelectedImageEntry(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const symptomRes = await axios.get(
          "http://localhost:5000/api/healthPredict/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const imageRes = await axios.get("http://localhost:5000/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(imageRes.data);
        setSymptomHistory(symptomRes.data);
        setImageHistory(imageRes.data);
      } catch (err) {
        console.error("Failed to fetch histories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <>
      {/* Profile Info */}
      <div className="max-w-6xl mx-auto mt-12 px-4 py-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-lg animate-fade-in">
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:5000/uploads/${user.photo}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md mb-4"
          />
          <h2 className="text-3xl font-extrabold text-blue-800 mb-2">
            👋 Hey, {user.name}!
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Here’s your dashboard with all your health tools' history:
          </p>
        </div>

        <div className="grid gap-4 text-gray-800 text-base sm:grid-cols-2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong>📧 Email:</strong>
            <p>{user.email}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong>🎂 Age:</strong>
            <p>{user.age}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong>📱 Phone:</strong>
            <p>{user.phone}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <strong>📍 Location:</strong>
            <p>
              {user.city}, {user.state}
            </p>
          </div>
        </div>
      </div>

      {/* Dual History Section */}
      <div className="mt-10 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Symptom Checker History */}
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-4">
            🩺 Symptom Checker History
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : symptomHistory.length === 0 ? (
            <p className="text-gray-600">No symptom checks yet.</p>
          ) : (
            <div className="space-y-4">
              {symptomHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400"
                >
                  <p className="text-sm text-gray-500 mb-1">
                    🕒 {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Disease:</strong> {entry.disease}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {entry.symptoms.join(", ")}
                  </p>
                  <button
                    onClick={() => openSymptomModal(entry)}
                    className="mt-2 text-indigo-600 hover:underline text-sm"
                  >
                    View More →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Analysis History */}
        <div>
          <h3 className="text-2xl font-bold text-purple-700 mb-4">
            🖼️ Image Analysis History
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : imageHistory.length === 0 ? (
            <p className="text-gray-600">No image analysis yet.</p>
          ) : (
            <div className="space-y-4">
              {imageHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-400"
                >
                  <p className="text-sm text-gray-500 mb-1">
                    📅 {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Query:</strong> {entry.query}
                  </p>
                  <button
                    onClick={() => openImageModal(entry)}
                    className="mt-2 text-indigo-600 hover:underline text-sm"
                  >
                    View Result →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg animate-fade-in-up relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-3 text-indigo-700">
              {selectedEntry ? "🩺 Prediction Details" : "🖼️ Image Analysis"}
            </h2>
            <div className="space-y-2 text-sm text-gray-700 overflow-y-auto max-h-96">
              {selectedEntry && (
                <>
                  <p>
                    <strong>Disease:</strong> {selectedEntry.disease}
                  </p>
                  <p>
                    <strong>Symptoms:</strong>{" "}
                    {selectedEntry.symptoms.join(", ")}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEntry.description}
                  </p>
                  <p>
                    <strong>Precautions:</strong>{" "}
                    {selectedEntry.precautions?.join(", ")}
                  </p>
                  <p>
                    <strong>Medications:</strong>{" "}
                    {selectedEntry.medications?.join(", ")}
                  </p>
                  <p>
                    <strong>Diet:</strong> {selectedEntry.diet?.join(", ")}
                  </p>
                  <p>
                    <strong>Workout:</strong>{" "}
                    {selectedEntry.workout?.join(", ")}
                  </p>
                </>
              )}
              {selectedImageEntry && (
                <>
                  <p>
                    <strong>Query:</strong> {selectedImageEntry.query}
                  </p>
                  <p>
                    <strong>Response:</strong>
                  </p>
                  <pre className="whitespace-pre-wrap break-words text-gray-800 bg-gray-100 p-2 rounded text-xs">
                    {JSON.stringify(selectedImageEntry.answer, null, 2)}
                  </pre>
                  {/* <img
                    src={`http://localhost:5000/uploads/images/${selectedImageEntry.image}`}
                    alt="Analyzed"
                    className="mt-2 max-h-60 rounded shadow"
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

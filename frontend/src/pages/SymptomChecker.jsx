import React, { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";
import Navbar from "../components/Navbar";
import { Info, HeartPulse } from "lucide-react"; // optional icon package

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setError("");
    setResult(null);

    const symptomsArray = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (symptomsArray.length === 0) {
      setError("Please enter at least one symptom.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/healthPredict/predict",
        { symptoms: symptomsArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Intro Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              <Info className="w-6 h-6" /> About the Symptom Checker
            </h2>
            <p className="mt-2 text-gray-700">
              This AI-powered tool helps predict possible diseases based on the
              symptoms you provide. Enter symptoms like{" "}
              <span className="italic">"fever, cough, chest pain"</span> and get
              a likely diagnosis.
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-600">
              <li>🧠 AI-based disease prediction</li>
              <li>💊 Suggested medications</li>
              <li>🥗 Recommended diet & workouts</li>
              <li>⚠️ Precautions to follow</li>
            </ul>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
              <HeartPulse className="inline w-7 h-7 mr-2" /> Symptom Checker
            </h1>

            <input
              type="text"
              placeholder="Enter symptoms (e.g., headache, nausea)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handlePredict}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Predict Disease
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                🧾 Prediction Results
              </h2>
              <ResultCard data={result} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SymptomChecker;

import React, { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";
import { Info, HeartPulse } from "lucide-react";

function SymptomChecker() {
  const BASE_URL = process.env.BACKEND_URL;
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
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/healthPredict/predict`,
        { symptoms: symptomsArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Intro Section */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#334155]">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <Info className="w-6 h-6" /> About the Symptom Checker
            </h2>
            <p className="mt-2 text-gray-300">
              This AI-powered tool helps predict possible diseases based on the
              symptoms you provide. Enter symptoms like{" "}
              <span className="italic text-purple-300">
                "fever, cough, chest pain"
              </span>{" "}
              and get a likely diagnosis.
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-400">
              <li>🧠 AI-based disease prediction</li>
              <li>💊 Suggested medications</li>
              <li>🥗 Recommended diet & workouts</li>
              <li>⚠️ Precautions to follow</li>
            </ul>
          </div>

          {/* Input Section */}
          <div className="bg-[#1f2937] rounded-xl shadow-xl p-6 border border-[#334155]">
            <h1 className="text-3xl font-bold text-center text-purple-400 mb-4">
              <HeartPulse className="inline w-7 h-7 mr-2" /> Symptom Checker
            </h1>

            <input
              type="text"
              placeholder="Enter symptoms (e.g., headache, nausea)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-3 border border-[#475569] rounded-lg bg-[#0f172a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handlePredict}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Predict Disease
            </button>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#334155]">
              <h2 className="text-xl font-semibold text-green-400 mb-2">
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

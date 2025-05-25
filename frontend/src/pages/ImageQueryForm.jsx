import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ImageQueryForm() {
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !query) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("query", query);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8001/upload_and_query",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${BASE_URL}/api/history`,
        {
          query,
          answer: response.data.maverick,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult({ error: "Failed to process the request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-[#111827] rounded-3xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <div className="flex-1 p-8 md:p-12 space-y-6 bg-[#111827]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-500 mb-2 select-none">
            📷 DiagnoVision
          </h1>
          <p className="text-gray-400 mb-6 text-base md:text-lg">
            Upload a medical image and ask a question to get instant AI-powered
            insights.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Medical Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full rounded-lg bg-[#1e293b] border border-purple-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {file && (
              <div>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full max-h-60 object-contain rounded-xl border border-purple-600 shadow-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Ask Your Question
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., What does this rash mean?"
                className="w-full rounded-lg bg-[#1e293b] border border-purple-500 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Get Diagnosis"}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="flex-1 p-8 md:p-12 bg-[#1e1b2f] overflow-auto max-h-[90vh]">
          {result ? (
            result.error ? (
              <p className="text-red-500 text-lg text-center font-semibold">
                {result.error}
              </p>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-purple-400 mb-4">
                  🧠 AI Diagnosis Result
                </h2>
                <div className="prose prose-invert max-w-none text-gray-100">
                  <ReactMarkdown>{result.maverick}</ReactMarkdown>
                </div>
              </>
            )
          ) : (
            <div className="text-gray-500 text-center mt-20 select-none">
              Upload an image & ask your question to see the AI's result.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageQueryForm;

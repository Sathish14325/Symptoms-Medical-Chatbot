import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ImageQueryForm() {
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
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8001/upload_and_query",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data); // shows on screen
      console.log(response.data);
      // 👉  NEW: store in Mongo via Express
      await axios.post(
        "http://localhost:5000/api/history",
        {
          query,
          answer: response.data.maverick, // just text, no image
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📷 DiagnoVision
        </h1>
        {/* <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to know?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form> */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 👇 Image Preview Block */}
          {file && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded Preview"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to know?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            {result.error ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  🧠 Response
                </h2>
                <div className="text-gray-800 bg-gray-100 rounded-md p-4 prose max-w-none">
                  <ReactMarkdown>{result.maverick}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageQueryForm;

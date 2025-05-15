import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiabetesForm from "../components/DiabetesForm";
import Navbar from "../components/Navbar";

export default function DiabetesPredictionPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // {
  //   "Pregnancies": 6,
  //   "Glucose": 148,
  //   "BloodPressure": 72,
  //   "SkinThickness": 35,
  //   "Insulin": 0,
  //   "BMI": 33.6,
  //   "DiabetesPedigreeFunction": 0.627,
  //   "Age": 50
  // }

  const handlePrediction = async (formData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/predict-diabetes/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction failed");

      setResult(data);
      setShowPopup(true);
      setError("");
    } catch (err) {
      setError(err.message);
      setResult(null);
      setShowPopup(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10 transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-800 drop-shadow-sm">
          🩺 Diabetes Risk Predictor
        </h1>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Fill the form below to analyze your risk for diabetes. Predictions are
          made using an AI-powered model.
        </p>

        <DiabetesForm onSubmit={handlePrediction} />

        {error && (
          <div className="mt-8 p-5 bg-red-100 border-l-4 border-red-500 rounded-lg animate-pulse">
            <h2 className="text-lg font-semibold text-red-700">Error!</h2>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* 🔲 Custom Popup Modal */}
      {showPopup && result && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowPopup(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md animate-fade-in-up relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
                🎯 Prediction Result
              </h2>

              <p className="text-gray-700 text-center mb-2">
                Based on the analysis, you are likely to be:{" "}
                <span
                  className={`font-bold ${
                    result.diabetes ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {result.diabetes
                    ? "Diabetic (Positive)"
                    : "Non-Diabetic (Negative)"}
                </span>
              </p>

              <p className="text-center text-sm text-gray-600 mb-4">
                Confidence: <strong>{result.confidence}%</strong>
              </p>

              <p className="text-sm text-center text-gray-500 mb-6">
                It is highly recommended to consult a healthcare professional
                for further assessment.
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
              >
                Book Doctor Appointment
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

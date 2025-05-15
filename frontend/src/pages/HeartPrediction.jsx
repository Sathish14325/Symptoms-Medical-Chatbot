import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HeartPrediction = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  // {
  //   "age": 58,
  //   "sex": 0,
  //   "cp": 0,
  //   "trestbps": 100,
  //   "chol": 248,
  //   "fbs": 0,
  //   "restecg": 0,
  //   "thalach": 122,
  //   "exang": 0,
  //   "oldpeak": 1,
  //   "slope": 1,
  //   "ca": 0,
  //   "thal": 2
  // }

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/predict-heart/predict",
        {
          ...formData,
          age: parseInt(formData.age),
          sex: parseInt(formData.sex),
          cp: parseInt(formData.cp),
          trestbps: parseInt(formData.trestbps),
          chol: parseInt(formData.chol),
          fbs: parseInt(formData.fbs),
          restecg: parseInt(formData.restecg),
          thalach: parseInt(formData.thalach),
          exang: parseInt(formData.exang),
          oldpeak: parseFloat(formData.oldpeak),
          slope: parseInt(formData.slope),
          ca: parseInt(formData.ca),
          thal: parseInt(formData.thal),
        }
      );
      setPrediction(res.data.prediction);
      setShowPopup(true);
    } catch (err) {
      console.error("Prediction error:", err.message);
      setPrediction("error");
      setShowPopup(true);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            Heart Disease Prediction
          </h2>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 capitalize">
                  {field}
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            ))}

            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict Heart Disease"}
              </button>
            </div>
          </form>
        </div>

        {/* 🔲 Custom Popup Modal */}
        {showPopup && (
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
                  💓 Heart Health Report
                </h2>

                {prediction === "error" ? (
                  <p className="text-center text-red-600 font-semibold">
                    Something went wrong while predicting. Please try again!
                  </p>
                ) : (
                  <>
                    <p className="text-gray-700 text-center mb-2">
                      You are likely to be:{" "}
                      <span
                        className={`font-bold ${
                          prediction === 1 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {prediction === 1
                          ? "Positive (At Risk)"
                          : "Negative (Not at Risk)"}
                      </span>
                    </p>

                    <p className="text-sm text-center text-gray-500 mb-6">
                      {prediction === 1
                        ? "Please consult a cardiologist as soon as possible to get a full diagnosis."
                        : "Your heart seems fine, but regular checkups are always a good idea!"}
                    </p>

                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
                    >
                      Book Doctor Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HeartPrediction;

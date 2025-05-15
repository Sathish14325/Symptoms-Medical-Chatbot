// src/pages/KidneyPrediction.js
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const KidneyPrediction = () => {
  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    rbc: "normal",
    pc: "normal",
    pcc: "notpresent",
    ba: "notpresent",
    bgr: "",
    bu: "",
    sc: "",
    sod: "",
    pot: "",
    hemo: "",
    pcv: "",
    wc: "",
    rc: "",
    htn: "no",
    dm: "no",
    cad: "no",
    appet: "good",
    pe: "no",
    ane: "no",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:1000/api/predict-kidney",
        formData
      );
      setPrediction(response.data.prediction);
      setLoading(false);
    } catch (error) {
      setError("Error during prediction");
      setLoading(false);
    }
  };

  const inputs = [
    { label: "Age", name: "age", type: "number" },
    { label: "Blood Pressure", name: "bp", type: "number" },
    { label: "Specific Gravity", name: "sg", type: "number" },
    { label: "Albumin", name: "al", type: "number" },
    { label: "Sugar", name: "su", type: "number" },
    { label: "Blood Glucose Random", name: "bgr", type: "number" },
    { label: "Blood Urea", name: "bu", type: "number" },
    { label: "Serum Creatinine", name: "sc", type: "number" },
    { label: "Sodium", name: "sod", type: "number" },
    { label: "Potassium", name: "pot", type: "number" },
    { label: "Hemoglobin", name: "hemo", type: "number" },
    { label: "Packed Cell Volume", name: "pcv", type: "number" },
    { label: "White Blood Cell Count", name: "wc", type: "number" },
    { label: "Red Blood Cell Count", name: "rc", type: "number" },
  ];

  return (
    <>
      <div className="flex justify-center items-center my-5 bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Kidney Disease Prediction
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inputs.map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block font-medium mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required={["age", "bp", "sg", "bgr"].includes(name)}
                  />
                </div>
              ))}

              {/* Dropdowns below */}

              <div>
                <label className="block font-medium mb-1">
                  Red Blood Cells
                </label>
                <select
                  name="rbc"
                  value={formData.rbc}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Pus Cells</label>
                <select
                  name="pc"
                  value={formData.pc}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Pus Cell Clumps
                </label>
                <select
                  name="pcc"
                  value={formData.pcc}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="notpresent">Not Present</option>
                  <option value="present">Present</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Bacteria</label>
                <select
                  name="ba"
                  value={formData.ba}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="notpresent">Not Present</option>
                  <option value="present">Present</option>
                </select>
              </div>

              {[
                { name: "htn", label: "Hypertension" },
                { name: "dm", label: "Diabetes Mellitus" },
                { name: "cad", label: "Coronary Artery Disease" },
                { name: "appet", label: "Appetite", options: ["good", "poor"] },
                { name: "pe", label: "Pedal Edema" },
                { name: "ane", label: "Anemia" },
              ].map(({ name, label, options }) => (
                <div key={name}>
                  <label className="block font-medium mb-1">{label}</label>
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {(options || ["no", "yes"]).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict Kidney Disease"}
            </button>
          </form>

          {prediction && (
            <div className="mt-6 text-center">
              <p className="text-lg font-medium">Prediction Result:</p>
              <h2
                className={`font-bold text-2xl mt-2 ${
                  prediction === "ckd" ? "text-red-500" : "text-green-500"
                }`}
              >
                {prediction === "ckd"
                  ? "Chronic Kidney Disease (CKD)"
                  : "No CKD Detected"}
              </h2>
            </div>
          )}

          {error && (
            <div className="mt-6 text-center text-red-500">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KidneyPrediction;

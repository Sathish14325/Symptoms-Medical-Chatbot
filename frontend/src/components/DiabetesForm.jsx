import { useState } from "react";

const initialState = {
  Pregnancies: "",
  Glucose: "",
  BloodPressure: "",
  SkinThickness: "",
  Insulin: "",
  BMI: "",
  DiabetesPedigreeFunction: "",
  Age: "",
};

export default function DiabetesForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(initialState).map((field) => (
        <div key={field}>
          <label className="block font-semibold text-gray-700 mb-1">
            {field}
          </label>
          <input
            type="number"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Predict Diabetes
      </button>
    </form>
  );
}

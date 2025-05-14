import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    photo: null,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={form.name}
              className={inputClass}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              className={inputClass}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className={inputClass}
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="age"
              placeholder="Age"
              onChange={handleChange}
              value={form.age}
              className={inputClass}
              required
            />
            <input
              name="weight"
              placeholder="Weight (kg)"
              onChange={handleChange}
              value={form.weight}
              className={inputClass}
              required
            />
            <input
              name="height"
              placeholder="Height (cm)"
              onChange={handleChange}
              value={form.height}
              className={inputClass}
              required
            />
            <select
              name="gender"
              onChange={handleChange}
              value={form.gender}
              className={inputClass}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={form.phone}
              className={inputClass}
              required
            />
            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              value={form.address}
              className={inputClass}
            />
            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              value={form.pincode}
              className={inputClass}
            />
            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              value={form.city}
              className={inputClass}
            />
            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              value={form.state}
              className={inputClass}
            />
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="bg-white text-black file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded cursor-pointer"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Register"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;

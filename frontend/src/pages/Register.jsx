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
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!emailRegex.test(form.email))
        newErrors.email = "Invalid email format";
      if (!form.password.trim()) newErrors.password = "Password is required";
      else if (form.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    if (step === 2) {
      if (!form.age.trim()) newErrors.age = "Age is required";
      else if (isNaN(form.age) || +form.age <= 0) newErrors.age = "Invalid age";
      if (!form.weight.trim()) newErrors.weight = "Weight is required";
      else if (isNaN(form.weight) || +form.weight <= 0)
        newErrors.weight = "Invalid weight";
      if (!form.height.trim()) newErrors.height = "Height is required";
      else if (isNaN(form.height) || +form.height <= 0)
        newErrors.height = "Invalid height";
      if (!form.gender.trim()) newErrors.gender = "Gender is required";
    }

    if (step === 3) {
      if (!form.phone.trim()) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(form.phone))
        newErrors.phone = "Phone must be 10 digits";
      // Address, pincode, city, state, photo can be optional here, but you can add more checks if needed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    setErrors({});
  };

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
    if (!validateStep()) return;

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
      toast.success("Registered successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={form.name}
                className={inputClass}
                required
              />
              {renderError("name")}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
                className={inputClass}
                required
              />
              {renderError("email")}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className={inputClass}
                required
              />
              {renderError("password")}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="age"
                placeholder="Age"
                onChange={handleChange}
                value={form.age}
                className={inputClass}
                required
              />
              {renderError("age")}
            </div>
            <div>
              <input
                name="weight"
                placeholder="Weight (kg)"
                onChange={handleChange}
                value={form.weight}
                className={inputClass}
                required
              />
              {renderError("weight")}
            </div>
            <div>
              <input
                name="height"
                placeholder="Height (cm)"
                onChange={handleChange}
                value={form.height}
                className={inputClass}
                required
              />
              {renderError("height")}
            </div>
            <div>
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
              {renderError("gender")}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                value={form.phone}
                className={inputClass}
                required
              />
              {renderError("phone")}
            </div>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="backdrop-blur-md bg-white/10 ring-1 ring-white/10 shadow-2xl rounded-2xl p-8 max-w-4xl w-full text-white animate-fade-in-down">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

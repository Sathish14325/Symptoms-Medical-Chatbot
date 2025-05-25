import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const BASE_URL = process.env.BACKEND_URL;
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
  const [photoPreview, setPhotoPreview] = useState(null);

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
      if (!form.address.trim()) newErrors.address = "Address is required";
      if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(form.pincode))
        newErrors.pincode = "Pincode must be 6 digits";
      if (!form.city.trim()) newErrors.city = "City is required";
      if (!form.state.trim()) newErrors.state = "State is required";
      if (!form.photo) newErrors.photo = "Photo is required";
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
      const file = files[0];
      setForm({ ...form, photo: file });
      if (file) setPhotoPreview(URL.createObjectURL(file));
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
      const res = await axios.post(`${BASE_URL}/api/auth/register`, data);
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

  const inputStyle =
    "w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-800 text-slate-50";

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-400 text-sm mt-1">{errors[field]}</p>
    ) : null;

  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderStep = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {step === 1 && (
          <>
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                value={form.name}
                className={inputStyle}
              />
              {renderError("name")}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={form.email}
                className={inputStyle}
              />
              {renderError("email")}
            </div>
            <div className="md:col-span-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className={inputStyle}
              />
              {renderError("password")}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <input
                name="age"
                placeholder="Age"
                onChange={handleChange}
                value={form.age}
                className={inputStyle}
              />
              {renderError("age")}
            </div>
            <div>
              <input
                name="weight"
                placeholder="Weight (kg)"
                onChange={handleChange}
                value={form.weight}
                className={inputStyle}
              />
              {renderError("weight")}
            </div>
            <div>
              <input
                name="height"
                placeholder="Height (cm)"
                onChange={handleChange}
                value={form.height}
                className={inputStyle}
              />
              {renderError("height")}
            </div>
            <div>
              <select
                name="gender"
                onChange={handleChange}
                value={form.gender}
                className={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {renderError("gender")}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                value={form.phone}
                className={inputStyle}
              />
              {renderError("phone")}
            </div>
            <div className="md:col-span-2">
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                value={form.address}
                className={inputStyle}
              />
              {renderError("address")}
            </div>
            <div>
              <input
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
                value={form.pincode}
                className={inputStyle}
              />
              {renderError("pincode")}
            </div>
            <div>
              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                value={form.city}
                className={inputStyle}
              />
              {renderError("city")}
            </div>
            <div>
              <input
                name="state"
                placeholder="State"
                onChange={handleChange}
                value={form.state}
                className={inputStyle}
              />
              {renderError("state")}
            </div>
            <div className="md:col-span-2">
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="file-input file-input-bordered w-full text-slate-900"
              />
              {renderError("photo")}
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-slate-50 p-4">
      <div className="bg-slate-800 shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-slate-50 mb-6">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-slate-300 mb-4">
          Step {step} of 3
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between items-center mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
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

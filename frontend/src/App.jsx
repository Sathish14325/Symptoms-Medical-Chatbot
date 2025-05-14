import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatBotPage from "./pages/ChatBotPage";
import ToolsPage from "./pages/ToolsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SymptomChecker from "./pages/SymptomChecker";
import ImageQueryForm from "./pages/ImageQueryForm";
import ImageQueryHistory from "./pages/ImageQueryHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/image-analysis" element={<ImageQueryForm />} />
          <Route path="/image-analysis-his" element={<ImageQueryHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

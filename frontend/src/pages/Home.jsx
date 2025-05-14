import React from "react";
import { Link } from "react-router-dom";
import { Bot, Stethoscope, Image } from "lucide-react";

const features = [
  {
    title: "AI Chatbot",
    desc: "Chat with our AI doctor for quick guidance and support.",
    icon: <Bot className="w-8 h-8 text-blue-600" />,
    link: "/chatbot",
  },
  {
    title: "Symptom Checker",
    desc: "Enter your symptoms and get a possible diagnosis instantly.",
    icon: <Stethoscope className="w-8 h-8 text-green-600" />,
    link: "/symptom-checker",
  },
  {
    title: "Image Symptom Analysis",
    desc: "Upload an image of affected area and get intelligent analysis.",
    icon: <Image className="w-8 h-8 text-pink-600" />,
    link: "/image-analysis",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 mb-4">
          Your Smart Medical Assistant
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          Powered by AI to help you understand your health better.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index}>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer">
                <div className="flex items-center mb-4">{feature.icon}</div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {feature.title}
                </h2>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <Link to="/register">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

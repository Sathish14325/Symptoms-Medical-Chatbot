import React from "react";
import { Sparkles } from "lucide-react"; // Optional icon, you can change it
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const ServiceCard = ({ name, desc, bgColor, textColor, path }) => {
  return (
    <div
      className="rounded-2xl p-6 shadow-xl transition transform hover:-translate-y-2 hover:shadow-2xl duration-300 border border-white/20 backdrop-blur-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Sparkles size={24} style={{ color: textColor }} />
        <h3 className="text-xl font-bold" style={{ color: textColor }}>
          {name}
        </h3>
      </div>
      <p className="text-gray-800 text-sm">{desc}</p>
      <Link to={path} className="flex justify-end m-2">
        <FaArrowRight />
      </Link>
    </div>
  );
};

export default ServiceCard;

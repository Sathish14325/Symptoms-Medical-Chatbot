import React from "react";
import { services } from "../assets/data/services";
import ServiceCard from "../components/ServiceCard";

const ServicesPage = () => {
  return (
    <div className="min-h-screen py-14 px-6 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Explore Our <span className="text-purple-600">Health Services</span>
        </h2>
        <p className="text-gray-600 mb-10 text-md">
          Accurate predictions and personalized health insights for early
          detection and prevention.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              desc={service.desc}
              bgColor={service.bgColor}
              textColor={service.textColor}
              path={service.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

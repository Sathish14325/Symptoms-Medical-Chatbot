import React from "react";
import { ShieldAlert, Pill, Utensils, Dumbbell, FileText } from "lucide-react"; // Icons for better visuals

const ResultCard = ({ data }) => {
  const Section = ({ title, items, icon: Icon }) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {title}
      </h3>
      <ul className="list-disc list-inside mt-2 text-gray-700 ml-2">
        {items?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="mt-8 p-6 border border-indigo-200 rounded-xl bg-white shadow-md">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          🧾 Disease: <span className="text-black">{data.disease}</span>
        </h2>
        <p className="text-gray-800 mt-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          {data.description}
        </p>
      </div>

      <Section
        title="Precautions"
        items={data.precautions}
        icon={ShieldAlert}
      />
      <Section title="Medications" items={data.medications} icon={Pill} />
      <Section title="Diet Recommendations" items={data.diet} icon={Utensils} />
      <Section
        title="Workout Suggestions"
        items={data.workout}
        icon={Dumbbell}
      />
    </div>
  );
};

export default ResultCard;

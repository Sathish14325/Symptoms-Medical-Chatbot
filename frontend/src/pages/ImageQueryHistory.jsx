import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageQueryHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/image-query/history/${userId}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Query History</h2>
      {history.map((item, idx) => (
        <div key={idx} className="border p-4 mb-2 rounded">
          <img
            src={`data:image/jpeg;base64,${item.imageBase64}`}
            alt="Query"
            className="w-32 h-32 object-cover"
          />
          <p>
            <strong>Query:</strong> {item.query}
          </p>
          <p>
            <strong>Result:</strong> {item.result}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ImageQueryHistory;

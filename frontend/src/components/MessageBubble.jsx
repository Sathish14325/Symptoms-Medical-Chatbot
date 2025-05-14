import React from "react";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";

const MessageBubble = ({ sender, text, isLoading, isButton }) => {
  const isBot = sender === "bot";
  const navigate = useNavigate();

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  if (isButton) {
    return (
      <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
        <div className="flex flex-col items-start gap-2 max-w-[80%]">
          <div className="rounded-2xl px-4 py-2 bg-blue-100 text-gray-800 shadow">
            {text}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            onClick={() => navigate("/find-docters")}
          >
            Find Doctor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`flex items-start gap-2 max-w-[80%]`}>
        {isBot && <div className="text-xl">🤖</div>}
        <div
          className={`relative rounded-2xl px-4 py-2 shadow ${
            isBot ? "bg-blue-100 text-gray-800" : "bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          ) : (
            <>
              {text}
              {/* Speaker icon for bot reply */}
              {isBot && (
                <button
                  className="absolute top-1 right-1 text-gray-500 hover:text-blue-500"
                  onClick={() => speakText(text)}
                  aria-label="Read aloud"
                >
                  <Volume2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

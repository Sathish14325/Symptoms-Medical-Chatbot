import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "../components/MessageBubble";
import axios from "axios";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = Date.now().toString();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

const ChatbotPage = () => {
  const sessionId = useRef(getSessionId());
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const [sessionList, setSessionList] = useState([]);
  const [activeSession, setActiveSession] = useState(sessionId.current);

  const keywords = ["doctor", "consult", "specialist", "professional"];

  const containsKeyword = (text) =>
    keywords.some((kw) => text.toLowerCase().includes(kw));

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chatbot/ask",
        {
          question,
          sessionId: sessionId.current,
        }
      );

      const botMessage = { sender: "bot", text: response.data.answer };
      const updatedMessages = [...messages, userMessage, botMessage];

      if (containsKeyword(question)) {
        updatedMessages.push({
          sender: "bot",
          isButton: true,
          text: "It seems like you’re looking for a doctor. Want to find one?",
        });
      }

      setMessages(updatedMessages);

      setTimeout(() => {
        speak(response.data.answer);
      }, 2000);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong while getting a response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (id) => {
    setActiveSession(id);
    sessionId.current = id;
    localStorage.setItem("sessionId", id);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/chatbot/history/${id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages for session", err);
    }
  };

  const renameSession = async (sessionId, newTitle) => {
    try {
      const res = await axios.put(`/api/chatbot/sessions/${sessionId}`, {
        newTitle: newTitle.trim(),
      });
      console.log("Session renamed:", res.data);
      fetchSessions(); // Refresh the list
    } catch (error) {
      console.error(
        "Failed to rename session",
        error.response?.data || error.message
      );
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/chatbot/sessions/${id}`);
      if (id === activeSession) {
        const newId = Date.now().toString();
        localStorage.setItem("sessionId", newId);
        sessionId.current = newId;
        setActiveSession(newId);
        setMessages([]);
      }
      fetchSessions();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const toggleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition not supported.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chatbot/sessions");
      setSessionList(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chatbot/history/${sessionId.current}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setListening(false);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition not supported.");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl border-r border-blue-200 p-4 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-4">🗂 Sessions</h2>

        {sessionList.map((session) => (
          <div key={session.sessionId} className="flex items-center gap-2">
            <button
              onClick={() => handleSessionClick(session.sessionId)}
              className={`flex-1 text-left px-4 py-2 rounded-xl transition ${
                session.sessionId === activeSession
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-blue-700"
              }`}
            >
              {session.title || new Date(session.createdAt).toLocaleString()}
            </button>
            <button
              onClick={() => {
                const newTitle = prompt("Enter new session title:");
                if (newTitle) {
                  renameSession(session.sessionId, newTitle);
                }
              }}
              className="text-sm text-blue-500 hover:text-blue-700"
              title="Rename"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteSession(session.sessionId)}
              className="text-sm text-red-500 hover:text-red-700"
              title="Delete"
            >
              🗑
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            const newId = Date.now().toString();
            localStorage.setItem("sessionId", newId);
            sessionId.current = newId;
            setActiveSession(newId);
            setMessages([]);
            fetchSessions();
          }}
          className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          ➕ New Session
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
            🤖 MediAI Care Assistant
          </h1>
          <p className="text-lg text-blue-900">
            Ask your medical questions and get instant, AI-powered responses.
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl mx-auto h-[75vh] flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white text-xl font-bold p-5 rounded-t-3xl">
            Chat with MediAI Care
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble
                  sender={msg.sender}
                  text={msg.text}
                  isLoading={msg.isLoading}
                  isButton={msg.isButton}
                />
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MessageBubble sender="bot" text="Typing..." isLoading />
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-blue-50 border-t border-blue-100 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-blue-300 rounded-xl px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Ask a medical question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={toggleVoiceInput}
              className={`border px-3 py-2 rounded-xl transition ${
                listening
                  ? "bg-red-100 border-red-400 text-red-600"
                  : "bg-white border-blue-300 text-blue-600"
              } hover:bg-blue-100`}
              title={listening ? "Stop Listening" : "Start Voice Input"}
            >
              <Mic size={20} />
            </button>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

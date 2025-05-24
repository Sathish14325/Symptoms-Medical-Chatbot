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
  const [showSidebar, setShowSidebar] = useState(false);

  const debounceRef = useRef(null);

  const keywords = ["doctor", "consult", "specialist", "professional"];
  const containsKeyword = (text) =>
    keywords.some((kw) => text.toLowerCase().includes(kw));

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
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
      setTimeout(() => speak(response.data.answer), 2000);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
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
      console.error("Failed to load messages", err);
    }
  };

  const renameSession = async (sessionId, newTitle) => {
    try {
      await axios.put(
        `http://localhost:5000/api/chatbot/sessions/${sessionId}`,
        {
          newTitle: newTitle.trim(),
        }
      );
      fetchSessions();
    } catch (error) {
      console.error("Rename failed", error.response?.data || error.message);
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Delete this session?")) return;

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
      console.error("Delete failed", err);
    }
  };

  const toggleVoiceInput = () => {
    if (debounceRef.current) return;

    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
    }, 1000);

    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    try {
      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setListening(!listening);
    } catch (err) {
      console.error("Voice input error:", err);
      alert("Unable to start voice input.");
      setListening(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chatbot/sessions");
      setSessionList(res.data);
    } catch (err) {
      console.error("Fetch sessions failed", err);
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
        console.error("Fetch history failed", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscript = "";

      recognition.onstart = () => {
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        finalTranscript = transcript;

        // Optional: Display live transcript
        if (!event.results[0].isFinal) {
          setQuestion(transcript);
        } else {
          setQuestion(finalTranscript);
          handleSend();
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        console.log("Voice recognition ended");
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Web Speech API not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-gray-900 border-r border-gray-700 p-4 space-y-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile sidebar header */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold">🗂 Sessions</h2>
          <button
            className="text-red-400 text-2xl"
            onClick={() => setShowSidebar(false)}
          >
            ✕
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-2">
          {sessionList.map((session) => (
            <div key={session.sessionId} className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleSessionClick(session.sessionId);
                  setShowSidebar(false);
                }}
                className={`flex-1 text-left px-4 py-2 rounded-xl text-sm transition ${
                  session.sessionId === activeSession
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                {session.title || new Date(session.createdAt).toLocaleString()}
              </button>
              <button
                onClick={() => {
                  const newTitle = prompt("Enter new session title:");
                  if (newTitle) renameSession(session.sessionId, newTitle);
                }}
                className="text-sm text-yellow-400 hover:text-yellow-500"
                title="Rename"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteSession(session.sessionId)}
                className="text-sm text-red-400 hover:text-red-600"
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const newId = Date.now().toString();
            localStorage.setItem("sessionId", newId);
            sessionId.current = newId;
            setActiveSession(newId);
            setMessages([]);
            fetchSessions();
            setShowSidebar(false);
          }}
          className="w-full text-left mt-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          ➕ New Session
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-700">
          <button onClick={() => setShowSidebar(!showSidebar)}>☰</button>
          <h1 className="text-xl font-bold">MediAI Care</h1>
        </div>

        {/* Heading */}
        <div className="max-w-4xl mx-auto mt-4 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            🤖 MediAI Care Assistant
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Ask your medical questions and get instant, AI-powered responses.
          </p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 mt-4 px-4 pb-4 overflow-hidden">
          <div className="max-w-4xl h-full mx-auto flex flex-col bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 p-4 text-center font-bold text-lg md:text-xl rounded-t-3xl">
              Chat with MediAI Care
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
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

            {/* Input Area */}
            <div className="bg-gray-900 border-t border-gray-700 px-4 py-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask a medical question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <div className="flex gap-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`px-3 py-2 rounded-xl border transition ${
                    listening
                      ? "bg-red-100 border-red-400 text-red-600"
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                  title={listening ? "Stop Listening" : "Start Voice Input"}
                >
                  <Mic size={20} />
                </button>
                <button
                  onClick={handleSend}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// return (
//   <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col md:flex-row">
//     {/* Sidebar */}
//     <div
//       className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-gray-900 border-r border-gray-700 p-4 space-y-4 overflow-y-auto transition-transform duration-300 ${
//         showSidebar ? "translate-x-0" : "-translate-x-full"
//       } md:translate-x-0`}
//     >
//       <div className="flex justify-between items-center md:hidden mb-4">
//         <h2 className="text-xl font-bold text-white">🗂 Sessions</h2>
//         <button
//           className="text-red-400 text-2xl"
//           onClick={() => setShowSidebar(false)}
//         >
//           ✕
//         </button>
//       </div>

//       {sessionList.map((session) => (
//         <div key={session.sessionId} className="flex items-center gap-2">
//           <button
//             onClick={() => {
//               handleSessionClick(session.sessionId);
//               setShowSidebar(false);
//             }}
//             className={`flex-1 text-left px-4 py-2 rounded-xl transition text-sm ${
//               session.sessionId === activeSession
//                 ? "bg-blue-600 text-white"
//                 : "hover:bg-gray-700 text-gray-300"
//             }`}
//           >
//             {session.title || new Date(session.createdAt).toLocaleString()}
//           </button>
//           <button
//             onClick={() => {
//               const newTitle = prompt("Enter new session title:");
//               if (newTitle) renameSession(session.sessionId, newTitle);
//             }}
//             className="text-sm text-yellow-400 hover:text-yellow-500"
//             title="Rename"
//           >
//             ✏️
//           </button>
//           <button
//             onClick={() => deleteSession(session.sessionId)}
//             className="text-sm text-red-400 hover:text-red-600"
//             title="Delete"
//           >
//             🗑
//           </button>
//         </div>
//       ))}

//       <button
//         onClick={() => {
//           const newId = Date.now().toString();
//           localStorage.setItem("sessionId", newId);
//           sessionId.current = newId;
//           setActiveSession(newId);
//           setMessages([]);
//           fetchSessions();
//           setShowSidebar(false);
//         }}
//         className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
//       >
//         ➕ New Session
//       </button>
//     </div>

//     {/* Chat Area */}
//     <div className="flex-1 px-4 py-6 flex flex-col">
//       <div className="flex justify-between items-center mb-4 md:hidden">
//         <button
//           className="text-white text-2xl"
//           onClick={() => setShowSidebar(!showSidebar)}
//         >
//           ☰
//         </button>
//         <h1 className="text-xl font-bold text-white">MediAI Care</h1>
//       </div>

//       <div className="max-w-3xl mx-auto mb-6 text-center">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
//           🤖 MediAI Care Assistant
//         </h1>
//         <p className="text-base md:text-lg text-gray-300">
//           Ask your medical questions and get instant, AI-powered responses.
//         </p>
//       </div>

//       <div className="bg-gray-800 shadow-2xl rounded-3xl w-full max-w-3xl mx-auto flex-1 flex flex-col overflow-hidden">
//         <div className="bg-blue-600 text-white text-lg md:text-xl font-bold p-4 md:p-5 rounded-t-3xl text-center">
//           Chat with MediAI Care
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <MessageBubble
//                 sender={msg.sender}
//                 text={msg.text}
//                 isLoading={msg.isLoading}
//                 isButton={msg.isButton}
//               />
//             </motion.div>
//           ))}
//           {loading && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//               <MessageBubble sender="bot" text="Typing..." isLoading />
//             </motion.div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         <div className="p-4 bg-gray-900 border-t border-gray-700 flex flex-col sm:flex-row gap-2">
//           <input
//             type="text"
//             className="w-full sm:flex-1 border border-gray-600 rounded-xl px-4 py-2 bg-gray-800 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="Ask a medical question..."
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={toggleVoiceInput}
//               className={`border px-3 py-2 rounded-xl transition ${
//                 listening
//                   ? "bg-red-100 border-red-400 text-red-600"
//                   : "bg-gray-800 border-gray-600 text-white"
//               } hover:bg-gray-700`}
//               title={listening ? "Stop Listening" : "Start Voice Input"}
//             >
//               <Mic size={20} />
//             </button>
//             <button
//               className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
//               onClick={handleSend}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

export default ChatbotPage;

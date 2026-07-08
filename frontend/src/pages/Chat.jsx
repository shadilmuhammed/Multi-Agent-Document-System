import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import toast from "react-hot-toast";


function Chat() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [documentName, setDocumentName] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get(`/chat/${documentId}`);

      const history = response.data.map((chat) => ({
        question: chat.question,
        answer: chat.answer,
        created_at: chat.created_at,
         sources: chat.sources || [],
      }));
      const docs = await api.get("/documents");

const currentDoc = docs.data.find(
    (d) => d.id === Number(documentId)
);

if (currentDoc) {
  setPdfUrl(
    currentDoc.url ||
    `http://localhost:8000/uploads/${currentDoc.filename}`
  );

  setDocumentName(currentDoc.filename);
}

      setMessages(history);
    } catch (error) {
      console.log(error);
    }
  };

  const askQuestion = async () => {
  if (!question.trim()) return;

  setLoading(true);

  try {
    const response = await api.post("/search", {
      document_id: Number(documentId),
      query: question,
    });

    const newMessage = {
      question,
      answer: response.data.answer,
      created_at: new Date().toISOString(),
      sources: response.data.sources || [],
    };

    setMessages((prev) => [...prev, newMessage]);

    setQuestion("");

  } catch (error) {
    console.log(error);
   toast.error("Failed to get AI response.");
  } finally {
    setLoading(false);
  }
};

 const copyAnswer = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
};
  const exportChat = () => {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(18);
  pdf.text("AI Chat Export", 20, y);

  y += 15;

  messages.forEach((msg) => {
    pdf.setFontSize(12);

    const question = pdf.splitTextToSize(
      `You: ${msg.question}`,
      170
    );

    pdf.text(question, 20, y);

    y += question.length * 7;

    const answer = pdf.splitTextToSize(
      `AI: ${msg.answer}`,
      170
    );

    pdf.text(answer, 20, y);

    y += answer.length * 7 + 10;

    if (y > 260) {
      pdf.addPage();
      y = 20;
    }
  });

  pdf.save("AI_Chat.pdf");
};

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

       
       {/* LEFT SIDE - PDF Preview */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden">

  <div className="border-b px-6 py-4">
    <h2
      className="text-2xl font-bold truncate"
      title={documentName}
    >
      📄 {documentName || "PDF Preview"}
    </h2>
  </div>

  {pdfUrl ? (
    <iframe
      src={pdfUrl}
      title="PDF Preview"
      className="w-full h-[760px]"
    />
  ) : (
    <div className="flex items-center justify-center h-[760px] text-gray-500">
      PDF Preview Not Available
    </div>
  )}

</div>
        {/* RIGHT SIDE - AI Chat */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-8 py-6">

          <div>

            <h1 className="text-4xl font-bold text-blue-600">
              🤖 AI Assistant
            </h1>

            <p className="text-gray-500 mt-1">
              Chat with your uploaded document
            </p>

          </div>

         <div className="flex gap-3">

  <button
    onClick={exportChat}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
  >
    📄 Export
  </button>

  <button
    onClick={() => navigate("/dashboard")}
    className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg"
  >
    ← Dashboard
  </button>

</div>

        </div>

        {/* Messages */}

        <div className="h-[550px] overflow-y-auto bg-gray-50 p-6 space-y-8">

          {messages.length === 0 && (

            <div className="text-center mt-32">

              <div className="text-6xl">
                🤖
              </div>

              <h2 className="text-2xl font-bold mt-5">
                Ask me anything about this PDF
              </h2>

              <p className="text-gray-500 mt-2">
                Example:
              </p>

              <div className="mt-5 space-y-2 text-gray-600">

                <p>• Summarize the document</p>

                <p>• What skills are mentioned?</p>

                <p>• Extract qualifications</p>

                <p>• List technologies</p>

              </div>

            </div>

          )}

          {messages.map((msg, index) => (

            <div key={index}>

              {/* USER */}

              <div className="flex justify-end">

                <div className="flex items-end gap-3">

                  <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-[70%] shadow-lg">

                    <p>{msg.question}</p>

                  </div>

                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    U
                  </div>

                </div>

              </div>

              {/* AI */}

              <div className="flex mt-6">

                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  AI
                </div>

                <div className="ml-4 bg-gray-100 rounded-3xl shadow px-6 py-5 max-w-4xl">

                  <div className="whitespace-pre-wrap text-gray-800 leading-8">
                    {msg.answer}
                  </div>
                       {msg.sources?.length > 0 && (
  <details className="mt-5">

    <summary className="cursor-pointer text-blue-600 font-semibold">
      📚 View Sources ({msg.sources.length})
    </summary>

    <div className="mt-4">
      {msg.sources.map((source, index) => (
        <div
          key={index}
          className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 mb-3"
        >
          <p className="text-sm whitespace-pre-wrap">
            {source}
          </p>
        </div>
      ))}
    </div>

  </details>
)}
                  <div className="flex justify-between items-center mt-5">

                    <small className="text-gray-400">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </small>

                    <button
  onClick={() => copyAnswer(msg.answer)}
  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
>
  📄 Copy
</button>

                  </div>

                </div>

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex">

              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                AI
              </div>

              <div className="ml-4 bg-white rounded-3xl shadow px-6 py-5">

                <div className="flex gap-2">

                  <span className="animate-bounce">•</span>

                  <span className="animate-bounce delay-100">•</span>

                  <span className="animate-bounce delay-200">•</span>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef}></div>
                  </div>

        {/* Input Area */}

        <div className="border-t bg-white p-6">

          <div className="flex gap-4">

            <textarea
              rows="2"
              placeholder="Ask anything about your document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
              className="flex-1 resize-none border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={askQuestion}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 rounded-xl font-semibold transition"
            >
              {loading ? (
                "Thinking..."
              ) : (
                <>
                  ➜
                  <br />
                  Send
                </>
              )}
            </button>

          </div>

                    <div className="mt-3 text-sm text-gray-500">
            Press <span className="font-semibold">Enter</span> to send •
            <span className="ml-1">Shift + Enter</span> for a new line
          </div>

        </div> {/* Input Area */}

      </div> {/* AI Chat */}

    </div> {/* Grid */}

  </div> {/* Container */}

</div> 

);
}

export default Chat;
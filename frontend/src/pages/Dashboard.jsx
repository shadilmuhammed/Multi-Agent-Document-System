import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
 const loadDocuments = async () => {
  try {
    const response = await api.get("/documents");
    setDocuments(response.data);
  } catch (error) {
    console.log(error);
  }
};
const loadStats = async () => {
    const response = await api.get("/stats");
    setStats(response.data);
};
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");

  navigate("/");
};

useEffect(() => {
  loadDocuments();
  loadStats();
}, []);

const uploadFile = async () => {
  if (!file) {
    toast.error("Please choose a PDF.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

toast.success(response.data.message);

    setFile(null);
    setSelectedFileName("");

    loadDocuments();
loadStats();

  } catch (error) {
    console.log(error);
   toast.error("Upload failed.");
  }
};

const deleteDocument = async (id) => {
  try {
    await api.delete(`/documents/${id}`);

    toast.success("Document deleted successfully.");

    loadDocuments();
loadStats();
  } catch (error) {
    console.log(error);
   toast.error("Delete failed.");
  }
};

// Search Filter
const filteredDocuments = documents.filter((doc) =>
  doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
);

 return (
  <div className="min-h-screen bg-gray-100">

    {/* Navbar */}
    <Navbar onLogout={logout} />

    <div className="flex">

      {/* Sidebar */}
      <Sidebar
  documents={filteredDocuments}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  onDelete={deleteDocument}
  onChat={(id) => navigate(`/chat/${id}`)}
/>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Upload Card */}
       <div className="bg-white rounded-xl shadow p-8">

    <h2 className="text-2xl font-bold">
        Upload PDF
    </h2>

    <p className="text-gray-500 mt-2">
        Upload a document to chat with AI.
    </p>

    <div
  className="mt-6 border-2 border-dashed border-blue-400 rounded-xl p-10 text-center hover:bg-blue-50 transition"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (
      droppedFile &&
      droppedFile.type === "application/pdf"
    ) {
      setFile(droppedFile);
      setSelectedFileName(droppedFile.name);
    } else {
      alert("Please drop a PDF file.");
    }
  }}
>

  <div className="text-5xl mb-4">
    📄
  </div>

  <p className="text-lg font-semibold">
    Drag & Drop PDF Here
  </p>

  <p className="text-gray-500 mt-2">
    or choose a file below
  </p>

  <input
    type="file"
    accept=".pdf"
    className="mt-6"
    onChange={(e) => {
      const selected = e.target.files[0];

      setFile(selected);

      if (selected) {
        setSelectedFileName(selected.name);
      }
    }}
  />

  {selectedFileName && (
    <p className="mt-4 text-blue-600 font-medium">
      Selected: {selectedFileName}
    </p>
  )}

  <button
    onClick={uploadFile}
    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
  >
    Upload PDF
  </button>

</div>

</div>
{/* Dashboard Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

  {/* Documents */}
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-600 p-6">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500 text-sm uppercase tracking-wide">
        Documents
      </p>

      <h2 className="text-5xl font-bold text-blue-600 mt-2">
        {stats?.documents ?? 0}
      </h2>

      <p className="text-gray-500 mt-2">
        PDFs uploaded
      </p>

    </div>

    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
      📄
    </div>

  </div>

  <div className="mt-6">

    <div className="flex justify-between text-sm text-gray-500 mb-2">
      <span>Storage</span>
      <span>{stats?.documents ?? 0} Files</span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{
          width: `${Math.min((stats?.documents ?? 0) * 10, 100)}%`,
        }}
      ></div>
    </div>

  </div>

</div>

  {/* AI Model */}
 <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 p-6">
    <h3 className="font-semibold flex items-center gap-2 text-gray-700">
       AI Model
    </h3>

    <p className="text-3xl font-bold mt-4 text-blue-600">
      Llama 3.2
    </p>

    <p className="text-gray-500 mt-2">
      Local AI Assistant
    </p>
  </div>

  {/* Vector DB */}
  <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 p-6">
    <h3 className="font-semibold flex items-center gap-2 text-gray-700">
      🗂️ Vector DB
    </h3>

    <p className="text-3xl font-bold mt-4 text-blue-600">
      ChromaDB
    </p>

    <p className="text-gray-500 mt-2">
      Semantic Search Engine
    </p>
  </div>
        {/* Recent Documents */}
<div className="bg-white rounded-xl shadow-lg mt-8 p-6">

  <h2 className="text-2xl font-bold mb-5">
    📂 Recent Documents
  </h2>

  {documents.length === 0 ? (

    <p className="text-gray-500">
      No documents uploaded yet.
    </p>

  ) : (

    documents.slice(0, 5).map((doc) => (

      <div
        key={doc.id}
        className="flex justify-between items-center border-b py-4"
      >

        <div>

          <p className="font-semibold">
            📄 {doc.filename}
          </p>

          <p className="text-sm text-gray-500">
            Ready for AI Chat
          </p>

        </div>

        <button
          onClick={() => navigate(`/chat/${doc.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Chat →
        </button>

      </div>

    ))

  )}

</div>
</div>
      </div>

    </div>

  </div>
);
}

export default Dashboard;
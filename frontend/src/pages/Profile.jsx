import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userResponse = await api.get("/auth/me");
      const docsResponse = await api.get("/documents");

      setUser(userResponse.data);
      setDocuments(docsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }

    try {
      const response = await api.put("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      alert(response.data.message);

      setOldPassword("");
      setNewPassword("");

    } catch (error) {
      alert(error.response?.data?.detail || "Password change failed.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-600">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {user.name}
          </h1>

          <p className="text-gray-500">
            {user.email}
          </p>

        </div>

        <hr className="my-8" />

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-blue-50 rounded-xl p-5 text-center">

            <h3 className="text-gray-600">
              Documents
            </h3>

            <p className="text-4xl font-bold text-blue-600 mt-2">
              {documents.length}
            </p>

          </div>

          <div className="bg-green-50 rounded-xl p-5 text-center">

            <h3 className="text-gray-600">
              AI Model
            </h3>

            <p className="text-xl font-bold text-green-600 mt-4">
              Llama 3.2
            </p>

          </div>

        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-5">
          🔒 Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={changePassword}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Update Password
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Profile;
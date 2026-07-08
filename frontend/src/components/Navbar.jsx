import { useNavigate } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">

      <h1
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-bold cursor-pointer"
      >
        🤖 Multi Agent AI Document System
      </h1>

      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold"
        >
          👤 Profile
        </button>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          🚪 Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
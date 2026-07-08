import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
  toast.error("Please enter email and password.");
  return;
}

    setLoading(true);

    try {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.access_token);

  const me = await api.get("/auth/me");

  localStorage.setItem("name", me.data.name);

  toast.success("Login successful!");

  navigate("/dashboard");

} catch (error) {
  console.log(error);

  toast.error(
    error.response?.data?.detail || "Invalid email or password."
  );

} finally {
  setLoading(false);
}
}; // <-- This closes the login function

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center items-center">

      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-blue-600">
            🤖 AI Document System
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue
          </p>

        </div>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
            <div className="mt-6 text-center">
  <span className="text-gray-500">
    Don't have an account?
  </span>

  <button
    onClick={() => navigate("/register")}
    className="ml-2 text-blue-600 hover:underline"
  >
    Register
  </button>
</div>
        </form>

      </div>

    </div>
  );
}

export default Login;
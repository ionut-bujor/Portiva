import React, { useState } from "react";
import { mockUser, mockPortfolios } from "../mockData";
import { FaFolderOpen, FaSearch, FaUser } from "react-icons/fa";

const Homepage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Login failed");
      }

      const data = await response.json();
      // For now, just store the token in localStorage and show a success message.
      localStorage.setItem("authToken", data.token);
      setSuccessMessage("Logged in successfully!");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen w-screen bg-gray-50 font-sans">
        {/* Header */}

        <header className="bg-gray-50 shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-bold text-2xl text-gray-900">Portiva</h1>

          <div className="flex gap-4">
            {/* Explore Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
              <FaFolderOpen />
              Explore
            </button>

            {/* My Portfolio Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
              <FaUser />
              My Portfolio
            </button>

            {/* Login Button */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition"
                onClick={() => setShowLogin(true)}
            >
              <FaSearch />
              Login
            </button>
          </div>

          <div className="text-gray-800 font-medium">
            {mockUser.loggedIn ? `Hello, ${mockUser.name}` : "Hello, Guest"}
          </div>
        </header>

        {/* Hero / Search */}
        <div className="w-full p-8 flex justify-center bg-gray-50">
          <input
              type="text"
              placeholder="Search portfolios..."
              className="w-full max-w-2xl p-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
          />
        </div>

        {/* Explore Section */}
        <main className="flex flex-wrap justify-center gap-8 p-8">
          {mockPortfolios.map((portfolio) => (
              <div
                  key={portfolio.id}
                  className="flex-1 min-w-[250px] max-w-[350px] bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{portfolio.name}</h2>
                <p className="text-gray-500 text-sm mb-4">User: {portfolio.username}</p>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-full text-sm hover:bg-indigo-600 transition">
                  View Portfolio
                </button>
              </div>
          ))}
        </main>

        {/* Login Popup */}
        {showLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Login</h2>
                  <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => {
                        setShowLogin(false);
                        setError(null);
                        setSuccessMessage(null);
                      }}
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                        required
                    />
                  </div>

                  {error && (
                      <p className="text-sm text-red-600">{error}</p>
                  )}
                  {successMessage && (
                      <p className="text-sm text-green-600">{successMessage}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                      disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <span>Don't have an account?</span>
                  <button
                      className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
                      onClick={() => {
                        // For now we just close login; later we can open a register popup.
                        setShowLogin(false);
                        // placeholder for future register flow
                      }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Homepage;

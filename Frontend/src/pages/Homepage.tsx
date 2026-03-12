import React, { useEffect, useState } from "react";
import { mockPortfolios } from "../mockData";
import { FaFolderOpen, FaSearch, FaUser } from "react-icons/fa";

const Homepage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  const [regUsername, setRegUsername] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regSecondName, setRegSecondName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  const [authUsername, setAuthUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("authUsername");
    if (storedUsername) {
      setAuthUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsername");
    setAuthUsername(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);
    setLoginLoading(true);

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
      localStorage.setItem("authToken", data.token);
      if (data.username) {
        localStorage.setItem("authUsername", data.username);
        setAuthUsername(data.username);
      }
      setLoginSuccessMessage("Logged in successfully!");
      setPassword("");
    } catch (err: any) {
      setLoginError(err.message || "Something went wrong");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);
    setRegLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regUsername,
          firstName: regFirstName,
          secondName: regSecondName,
          email: regEmail,
          password: regPassword,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      if (data.username) {
        localStorage.setItem("authUsername", data.username);
        setAuthUsername(data.username);
      }
      setRegSuccessMessage("Account created! You are now logged in.");

      // Optional: close the modal shortly after success
      setTimeout(() => {
        setShowRegister(false);
      }, 800);
    } catch (err: any) {
      setRegError(err.message || "Something went wrong");
    } finally {
      setRegLoading(false);
    }
  };

  return (
      <div className="min-h-screen w-screen bg-gray-50 font-sans">
        {/* Header */}

        <header className="bg-gray-50 shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-bold text-2xl text-gray-900">Portiva</h1>

          <div className="flex gap-4 items-center">
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

            {/* Login Button (hidden when logged in) */}
            {!authUsername && (
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition"
                    onClick={() => setShowLogin(true)}
                >
                  <FaSearch />
                  Login
                </button>
            )}

            {/* Logout Button (shown when logged in) */}
            {authUsername && (
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
                    onClick={handleLogout}
                >
                  Log out
                </button>
            )}
          </div>

          <div className="text-gray-800 font-medium">
            {authUsername ? `Hello, ${authUsername}` : "Hello, Guest"}
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
                        setLoginError(null);
                        setLoginSuccessMessage(null);
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

                  {loginError && (
                      <p className="text-sm text-red-600">{loginError}</p>
                  )}
                  {loginSuccessMessage && (
                      <p className="text-sm text-green-600">{loginSuccessMessage}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                      disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <span>Don't have an account?</span>
                  <button
                      className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
                      onClick={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                      }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Register Popup */}
        {showRegister && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Register</h2>
                  <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => {
                        setShowRegister(false);
                        setRegError(null);
                        setRegSuccessMessage(null);
                      }}
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-3" onSubmit={handleRegister}>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First name
                      </label>
                      <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                          required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last name
                      </label>
                      <input
                          type="text"
                          value={regSecondName}
                          onChange={(e) => setRegSecondName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                          required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
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
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                        required
                    />
                  </div>

                  {regError && (
                      <p className="text-sm text-red-600">{regError}</p>
                  )}
                  {regSuccessMessage && (
                      <p className="text-sm text-green-600">{regSuccessMessage}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                      disabled={regLoading}
                  >
                    {regLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <span>Already have an account?</span>
                  <button
                      className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
                      onClick={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                      }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Homepage;

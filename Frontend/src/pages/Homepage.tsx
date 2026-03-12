import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPortfolios } from "../mockData";
import { FaFolderOpen, FaSearch, FaUser } from "react-icons/fa";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen w-screen bg-gray-950 text-gray-100 font-sans">
        {/* Header */}

        <header className="bg-gray-950/90 backdrop-blur border-b border-gray-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-semibold text-2xl tracking-tight">Portiva</h1>

          <div className="flex gap-4 items-center">
            {/* Explore Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-100 text-sm font-medium hover:bg-gray-800 transition">
              <FaFolderOpen />
              Explore
            </button>

            {/* My Portfolio Button */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-100 text-sm font-medium hover:bg-gray-800 transition"
                onClick={() => {
                  if (authUsername) {
                    navigate("/dashboard");
                  } else {
                    setShowLogin(true);
                  }
                }}
            >
              <FaUser />
              My Portfolio
            </button>

            {/* Login Button (hidden when logged in) */}
            {!authUsername && (
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-100 text-sm font-medium hover:bg-gray-800 transition"
                    onClick={() => setShowLogin(true)}
                >
                  <FaSearch />
                  Login
                </button>
            )}

            {/* Logout Button (shown when logged in) */}
            {authUsername && (
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition"
                    onClick={handleLogout}
                >
                  Log out
                </button>
            )}
          </div>

          <div className="text-sm text-gray-400">
            {authUsername ? `Hello, ${authUsername}` : "Hello, Guest"}
          </div>
        </header>

        {/* Hero / Search */}
        <div className="w-full p-8 flex justify-center bg-gray-950">
          <input
              type="text"
              placeholder="Search portfolios..."
              className="w-full max-w-2xl p-3 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Explore Section */}
        <main className="flex flex-wrap justify-center gap-8 p-8">
          {mockPortfolios.map((portfolio) => (
              <div
                  key={portfolio.id}
                  className="flex-1 min-w-[250px] max-w-[350px] bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-indigo-500 transition"
              >
                <h2 className="text-lg font-semibold text-gray-50 mb-1.5">{portfolio.name}</h2>
                <p className="text-gray-400 text-xs mb-4">by {portfolio.username}</p>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-full text-xs hover:bg-indigo-400 transition">
                  View Portfolio
                </button>
              </div>
          ))}
        </main>

        {/* Login Popup */}
        {showLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-50">Login</h2>
                  <button
                      className="text-gray-500 hover:text-gray-300"
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
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        required
                    />
                  </div>

                  {loginError && (
                      <p className="text-xs text-red-400">{loginError}</p>
                  )}
                  {loginSuccessMessage && (
                      <p className="text-xs text-emerald-400">{loginSuccessMessage}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-400 transition disabled:opacity-60"
                      disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-400">
                  <span>Don't have an account?</span>
                  <button
                      className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium"
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
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-50">Register</h2>
                  <button
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
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        First name
                      </label>
                      <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Last name
                      </label>
                      <input
                          type="text"
                          value={regSecondName}
                          onChange={(e) => setRegSecondName(e.target.value)}
                          className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        required
                    />
                  </div>

                  {regError && (
                      <p className="text-xs text-red-400">{regError}</p>
                  )}
                  {regSuccessMessage && (
                      <p className="text-xs text-emerald-400">{regSuccessMessage}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-400 transition disabled:opacity-60"
                      disabled={regLoading}
                  >
                    {regLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-400">
                  <span>Already have an account?</span>
                  <button
                      className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium"
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

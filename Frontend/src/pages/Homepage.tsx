import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPortfolios } from "../mockData";

const API_BASE = "http://localhost:8080/api";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [search, setSearch] = useState("");

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
    const stored = localStorage.getItem("authUsername");
    if (stored) setAuthUsername(stored);
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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text() || "Login failed");
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      if (data.username) {
        localStorage.setItem("authUsername", data.username);
        setAuthUsername(data.username);
      }
      setLoginSuccessMessage("Welcome back.");
      setPassword("");
      setTimeout(() => { setShowLogin(false); navigate("/dashboard"); }, 800);
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
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          firstName: regFirstName,
          secondName: regSecondName,
          email: regEmail,
          password: regPassword,
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Registration failed");
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      if (data.username) {
        localStorage.setItem("authUsername", data.username);
        setAuthUsername(data.username);
      }
      setRegSuccessMessage("Account created.");
      setTimeout(() => { setShowRegister(false); navigate("/dashboard"); }, 800);
    } catch (err: any) {
      setRegError(err.message || "Something went wrong");
    } finally {
      setRegLoading(false);
    }
  };

  const filtered = mockPortfolios.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.grain} />

      {/* Nav */}
      <nav style={s.nav}>
        <span style={s.brand}>portiva</span>
        <div style={s.navRight}>
          {authUsername ? (
            <>
              <span style={s.navGreeting}>hi, {authUsername}</span>
              <button style={s.navBtn} onClick={() => navigate("/dashboard")}>
                my portfolio
              </button>
              <button style={{ ...s.navBtn, ...s.navBtnDanger }} onClick={handleLogout}>
                log out
              </button>
            </>
          ) : (
            <>
              <button style={s.navBtn} onClick={() => setShowLogin(true)}>
                log in
              </button>
              <button style={{ ...s.navBtn, ...s.navBtnPrimary }} onClick={() => setShowRegister(true)}>
                get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header style={s.hero}>
        <p style={s.heroEyebrow}>discover creators</p>
        <h1 style={s.heroTitle}>Beautiful portfolios,<br />built by real people.</h1>
        <p style={s.heroSub}>
          Browse work from developers, designers, and builders.
        </p>
        <div style={s.searchWrap}>
          <input
            type="text"
            placeholder="Search by name or username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
      </header>

      <div style={s.divider} />

      {/* Portfolio grid */}
      <main style={s.main}>
        <p style={s.gridLabel}>{filtered.length} portfolios</p>
        <div style={s.grid}>
          {filtered.map((portfolio) => (
            <button
              key={portfolio.id}
              style={s.card}
              onClick={() => navigate(`/u/${portfolio.username}`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
              }}
            >
              <div style={s.cardAvatar}>
                {portfolio.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={s.cardBody}>
                <h2 style={s.cardName}>{portfolio.name}</h2>
                <p style={s.cardUsername}>@{portfolio.username}</p>
              </div>
              <span style={s.cardArrow}>↗</span>
            </button>
          ))}
        </div>
      </main>

      <footer style={s.footer}>
        <span style={s.footerText}>made with portiva</span>
      </footer>

      {/* Login modal */}
      {showLogin && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>welcome back</h2>
              <button style={s.closeBtn} onClick={() => setShowLogin(false)}>✕</button>
            </div>
            <form style={s.form} onSubmit={handleLogin}>
              <div style={s.field}>
                <label style={s.label}>email</label>
                <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>password</label>
                <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {loginError && <p style={s.errorMsg}>{loginError}</p>}
              {loginSuccessMessage && <p style={s.successMsg}>{loginSuccessMessage}</p>}
              <button style={s.submitBtn} type="submit" disabled={loginLoading}>
                {loginLoading ? "logging in…" : "log in"}
              </button>
            </form>
            <p style={s.switchText}>
              no account?{" "}
              <button style={s.switchBtn} onClick={() => { setShowLogin(false); setShowRegister(true); }}>
                register
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register modal */}
      {showRegister && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowRegister(false); }}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>create account</h2>
              <button style={s.closeBtn} onClick={() => setShowRegister(false)}>✕</button>
            </div>
            <form style={s.form} onSubmit={handleRegister}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>first name</label>
                  <input style={s.input} type="text" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required />
                </div>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>last name</label>
                  <input style={s.input} type="text" value={regSecondName} onChange={(e) => setRegSecondName(e.target.value)} required />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>username</label>
                <input style={s.input} type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>email</label>
                <input style={s.input} type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>password</label>
                <input style={s.input} type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
              </div>
              {regError && <p style={s.errorMsg}>{regError}</p>}
              {regSuccessMessage && <p style={s.successMsg}>{regSuccessMessage}</p>}
              <button style={s.submitBtn} type="submit" disabled={regLoading}>
                {regLoading ? "creating account…" : "create account"}
              </button>
            </form>
            <p style={s.switchText}>
              have an account?{" "}
              <button style={s.switchBtn} onClick={() => { setShowRegister(false); setShowLogin(true); }}>
                log in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    background: "#faf8f5",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
    backgroundSize: "128px",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    padding: "1.5rem 3rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ece5dc",
    boxSizing: "border-box",
  },
  brand: {
    fontSize: "0.8rem",
    color: "#b0a090",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  navGreeting: {
    fontSize: "0.75rem",
    color: "#a09080",
    fontStyle: "italic",
    marginRight: "0.25rem",
  },
  navBtn: {
    background: "none",
    border: "1px solid #ddd5c8",
    borderRadius: "20px",
    padding: "0.4rem 1rem",
    fontSize: "0.72rem",
    color: "#6a5a4a",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
  },
  navBtnPrimary: {
    background: "#2a2420",
    borderColor: "#2a2420",
    color: "#faf8f5",
  },
  navBtnDanger: {
    borderColor: "#e8c5c5",
    color: "#a05050",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    maxWidth: "720px",
    margin: "0 auto",
    padding: "6rem 2rem 4rem",
    textAlign: "center",
  },
  heroEyebrow: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 1.25rem",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 5vw, 3.25rem)",
    fontWeight: 400,
    color: "#2a2420",
    margin: "0 0 1.25rem",
    letterSpacing: "-1px",
    lineHeight: 1.15,
  },
  heroSub: {
    fontSize: "0.9rem",
    color: "#8a7a6a",
    margin: "0 0 2.5rem",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  searchWrap: {
    maxWidth: "480px",
    margin: "0 auto",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1.25rem",
    borderRadius: "40px",
    border: "1px solid #ddd5c8",
    background: "#ffffff",
    fontSize: "0.85rem",
    color: "#2a2420",
    fontFamily: "system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  divider: {
    position: "relative",
    zIndex: 1,
    height: "1px",
    background: "#ece5dc",
    margin: "0",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 3rem 6rem",
    boxSizing: "border-box",
  },
  gridLabel: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #ece5dc",
    borderRadius: "12px",
    padding: "1.25rem",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    width: "100%",
    boxSizing: "border-box",
  },
  cardAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#e8e0d5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    color: "#7a6a5a",
    letterSpacing: "1px",
    flexShrink: 0,
    fontFamily: "system-ui, sans-serif",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: "0.9rem",
    fontWeight: 400,
    color: "#2a2420",
    margin: "0 0 0.2rem",
    letterSpacing: "-0.2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardUsername: {
    fontSize: "0.72rem",
    color: "#a09080",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.02em",
  },
  cardArrow: {
    fontSize: "0.85rem",
    color: "#c0b0a0",
    flexShrink: 0,
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "1.5rem",
    borderTop: "1px solid #ece5dc",
  },
  footerText: {
    fontSize: "0.65rem",
    color: "#c0b0a0",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(42,36,32,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
  },
  modal: {
    background: "#faf8f5",
    border: "1px solid #ece5dc",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.1rem",
    fontWeight: 400,
    color: "#2a2420",
    margin: 0,
    letterSpacing: "-0.2px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.8rem",
    color: "#a09080",
    padding: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.65rem",
    color: "#a09080",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  input: {
    padding: "0.6rem 0.85rem",
    border: "1px solid #ddd5c8",
    borderRadius: "8px",
    background: "#ffffff",
    fontSize: "0.85rem",
    color: "#2a2420",
    fontFamily: "system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
    width: "100%",
  },
  errorMsg: {
    fontSize: "0.75rem",
    color: "#a05050",
    fontStyle: "italic",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  successMsg: {
    fontSize: "0.75rem",
    color: "#507a50",
    fontStyle: "italic",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  submitBtn: {
    padding: "0.7rem",
    background: "#2a2420",
    color: "#faf8f5",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
    marginTop: "0.25rem",
  },
  switchText: {
    textAlign: "center" as const,
    fontSize: "0.72rem",
    color: "#a09080",
    marginTop: "1.25rem",
    fontFamily: "system-ui, sans-serif",
  },
  switchBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.72rem",
    color: "#6a5a4a",
    textDecoration: "underline",
    fontFamily: "system-ui, sans-serif",
    padding: 0,
  },
};

export default Homepage;

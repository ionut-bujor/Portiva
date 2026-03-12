import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

interface Project {
  projectId: number;
  projectName: string;
  description: string;
  technologiesUsed: string;
}

interface DashboardData {
  username: string;
  firstName: string;
  secondName: string;
  email: string;
  imageUrl: string;
  bio: string;
  headline: string;
  website: string;
  projects?: Project[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("authUsername");
  const token = localStorage.getItem("authToken");

  const [profileData, setProfileData] = useState<DashboardData | null>(null);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/"); return; }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) { navigate("/"); return; }
        if (!res.ok) throw new Error("Failed to load profile");
        const data: DashboardData = await res.json();
        setProfileData(data);
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        setWebsite(data.website || "");
      } catch (err) {
        setErrorMessage("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, headline, website }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save profile");
      }
      const updated: DashboardData = await res.json();
      setProfileData(updated);
      setSavedMessage("Profile saved.");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `http://localhost:5173/u/${profileData?.username}`;

  return (
    <div style={s.page}>
      <div style={s.grain} />

      {/* Nav */}
      <nav style={s.nav}>
        <span style={s.brand}>portiva</span>
        <div style={s.navRight}>
          <button style={s.navBtn} onClick={() => navigate("/portfolio")}>
            view portfolio ↗
          </button>
          <button style={{ ...s.navBtn, ...s.navBtnSecondary }} onClick={() => navigate("/")}>
            ← explore
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={s.main}>
        {loading ? (
          <p style={s.loadingText}>Loading…</p>
        ) : (
          <>
            {/* Welcome */}
            <div style={s.welcomeBlock}>
              <p style={s.eyebrow}>dashboard</p>
              <h1 style={s.pageTitle}>
                {profileData?.firstName ? `hello, ${profileData.firstName}.` : `hello, ${username}.`}
              </h1>
            </div>

            {/* Public link */}
            <section style={s.card}>
              <h2 style={s.cardTitle}>your public link</h2>
              <p style={s.cardSub}>share this so anyone can view your portfolio.</p>
              <div style={s.linkRow}>
                <div style={s.linkDisplay}>{publicUrl}</div>
                <button
                  style={{ ...s.btn, ...(copied ? s.btnSuccess : {}) }}
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "copied!" : "copy"}
                </button>
              </div>
            </section>

            {/* Profile form */}
            <section style={s.card}>
              <h2 style={s.cardTitle}>profile</h2>
              <p style={s.cardSub}>this information appears on your public portfolio page.</p>

              <form style={s.form} onSubmit={handleSaveProfile}>
                <div style={s.formGrid}>
                  <div style={s.field}>
                    <label style={s.label}>display name</label>
                    <input
                      style={{ ...s.input, ...s.inputDisabled }}
                      type="text"
                      value={profileData?.username ?? ""}
                      disabled
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>headline</label>
                    <input
                      style={s.input}
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Frontend engineer, designer, builder"
                    />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>bio</label>
                  <textarea
                    style={{ ...s.input, ...s.textarea }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell visitors who you are and what you build."
                  />
                </div>

                <div style={s.field}>
                  <label style={s.label}>website or main link</label>
                  <input
                    style={s.input}
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                  />
                </div>

                {savedMessage && <p style={s.successMsg}>{savedMessage}</p>}
                {errorMessage && <p style={s.errorMsg}>{errorMessage}</p>}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={s.submitBtn} type="submit" disabled={saving}>
                    {saving ? "saving…" : "save profile"}
                  </button>
                </div>
              </form>
            </section>

            {/* Projects */}
            <section style={s.card}>
              <h2 style={s.cardTitle}>projects</h2>
              <p style={s.cardSub}>add projects that appear on your public portfolio.</p>
              <button style={s.btn}>add new project</button>
            </section>
          </>
        )}
      </main>

      <footer style={s.footer}>
        <span style={s.footerText}>made with portiva</span>
      </footer>
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
    gap: "0.75rem",
    alignItems: "center",
  },
  navBtn: {
    background: "#2a2420",
    border: "1px solid #2a2420",
    borderRadius: "20px",
    padding: "0.4rem 1rem",
    fontSize: "0.72rem",
    color: "#faf8f5",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
  },
  navBtnSecondary: {
    background: "none",
    borderColor: "#ddd5c8",
    color: "#6a5a4a",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "760px",
    margin: "0 auto",
    padding: "4rem 2rem 6rem",
    boxSizing: "border-box",
  },
  loadingText: {
    color: "#b0a090",
    fontStyle: "italic",
    fontSize: "0.9rem",
  },
  welcomeBlock: {
    marginBottom: "3rem",
  },
  eyebrow: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 0.75rem",
  },
  pageTitle: {
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
    fontWeight: 400,
    color: "#2a2420",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #ece5dc",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "1.25rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 400,
    color: "#2a2420",
    margin: "0 0 0.3rem",
    letterSpacing: "-0.2px",
  },
  cardSub: {
    fontSize: "0.78rem",
    color: "#a09080",
    margin: "0 0 1.25rem",
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.5,
  },
  linkRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  linkDisplay: {
    flex: 1,
    padding: "0.6rem 0.85rem",
    border: "1px solid #ece5dc",
    borderRadius: "8px",
    background: "#faf8f5",
    fontSize: "0.78rem",
    color: "#8a7a6a",
    fontFamily: "system-ui, sans-serif",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
  inputDisabled: {
    background: "#faf8f5",
    color: "#b0a090",
    cursor: "not-allowed",
  },
  textarea: {
    minHeight: "96px",
    resize: "vertical" as const,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.6,
  },
  btn: {
    padding: "0.5rem 1.1rem",
    background: "none",
    border: "1px solid #ddd5c8",
    borderRadius: "20px",
    fontSize: "0.72rem",
    color: "#6a5a4a",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
    flexShrink: 0,
  },
  btnSuccess: {
    borderColor: "#a8c5a0",
    color: "#507a50",
  },
  submitBtn: {
    padding: "0.6rem 1.5rem",
    background: "#2a2420",
    border: "none",
    borderRadius: "20px",
    fontSize: "0.75rem",
    color: "#faf8f5",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
  },
  successMsg: {
    fontSize: "0.75rem",
    color: "#507a50",
    fontStyle: "italic",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  errorMsg: {
    fontSize: "0.75rem",
    color: "#a05050",
    fontStyle: "italic",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
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
};

export default Dashboard;
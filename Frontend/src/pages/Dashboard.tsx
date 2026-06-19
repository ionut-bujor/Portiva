import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

interface Project {
  projectId: number;
  projectName: string;
  description: string;
  longDescription: string;
  technologiesUsed: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
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
}

const emptyForm = {
  projectName: "",
  description: "",
  longDescription: "",
  technologiesUsed: "",
  imageUrl: "",
  githubUrl: "",
  demoUrl: "",
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const fetchAll = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (profileRes.status === 401 || profileRes.status === 403) { navigate("/"); return; }
        if (!profileRes.ok) throw new Error("Failed to load profile");
        const data: DashboardData = await profileRes.json();
        setProfileData(data);
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        setWebsite(data.website || "");
        if (projectsRes.ok) {
          const proj: Project[] = await projectsRes.json();
          setProjects(proj);
        }
      } catch {
        setErrorMessage("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bio, headline, website }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to save profile");
      const updated: DashboardData = await res.json();
      setProfileData(updated);
      setSavedMessage("Profile saved.");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (p: Project) => {
    setEditingId(p.projectId);
    setForm({
      projectName: p.projectName,
      description: p.description,
      longDescription: p.longDescription || "",
      technologiesUsed: p.technologiesUsed,
      imageUrl: p.imageUrl || "",
      githubUrl: p.githubUrl || "",
      demoUrl: p.demoUrl || "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim()) { setFormError("Project name is required."); return; }
    setFormSaving(true);
    setFormError(null);
    try {
      const url = editingId ? `${API_BASE}/projects/${editingId}` : `${API_BASE}/projects`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to save project");
      const saved: Project = await res.json();
      if (editingId) {
        setProjects(prev => prev.map(p => p.projectId === editingId ? saved : p));
      } else {
        setProjects(prev => [...prev, saved]);
      }
      closeForm();
    } catch (err: any) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    setDeletingId(projectId);
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(prev => prev.filter(p => p.projectId !== projectId));
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const publicUrl = `http://localhost:5173/u/${profileData?.username}`;

  return (
    <div style={s.page}>
      <div style={s.grain} />

      <nav style={s.nav}>
        <span style={s.brand}>portiva</span>
        <div style={s.navRight}>
          <button style={s.navBtn} onClick={() => navigate(`/u/${profileData?.username}`)}>
            view portfolio ↗
          </button>
          <button style={{ ...s.navBtn, ...s.navBtnSecondary }} onClick={() => navigate("/")}>
            ← explore
          </button>
        </div>
      </nav>

      <main style={s.main}>
        {loading ? (
          <p style={s.loadingText}>Loading…</p>
        ) : (
          <>
            <div style={s.welcomeBlock}>
              <p style={s.eyebrow}>dashboard</p>
              <h1 style={s.pageTitle}>
                {profileData?.firstName ? `hello, ${profileData.firstName}.` : "hello."}
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
                    <label style={s.label}>username</label>
                    <input style={{ ...s.input, ...s.inputDisabled }} type="text" value={profileData?.username ?? ""} disabled />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>headline</label>
                    <input style={s.input} type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Full-stack engineer, builder, tinkerer" />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>bio</label>
                  <textarea style={{ ...s.input, ...s.textarea }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell visitors who you are and what you build." />
                </div>
                <div style={s.field}>
                  <label style={s.label}>website or main link</label>
                  <input style={s.input} type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" />
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
              <div style={s.cardHeader}>
                <div>
                  <h2 style={s.cardTitle}>projects</h2>
                  <p style={s.cardSub}>add projects that appear on your public portfolio.</p>
                </div>
                {!showForm && (
                  <button style={s.submitBtn} onClick={openNewForm}>+ add project</button>
                )}
              </div>

              {showForm && (
                <div style={s.projectForm}>
                  <p style={s.formHeading}>{editingId ? "edit project" : "new project"}</p>
                  <form onSubmit={handleFormSubmit} style={s.form}>

                    <div style={s.field}>
                      <label style={s.label}>project name</label>
                      <input
                        style={s.input}
                        type="text"
                        value={form.projectName}
                        onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))}
                        placeholder="My Awesome Project"
                        autoFocus
                      />
                    </div>

                    <div style={s.field}>
                      <label style={s.label}>short description</label>
                      <textarea
                        style={{ ...s.input, ...s.textareaShort }}
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="One or two sentences — shown on the project card."
                      />
                    </div>

                    <div style={s.field}>
                      <label style={s.label}>full write-up</label>
                      <textarea
                        style={{ ...s.input, ...s.textarea }}
                        value={form.longDescription}
                        onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))}
                        placeholder="The full story — what problem you solved, how you built it, what you learned. Shown on the project page."
                      />
                    </div>

                    <div style={s.field}>
                      <label style={s.label}>technologies used</label>
                      <input
                        style={s.input}
                        type="text"
                        value={form.technologiesUsed}
                        onChange={e => setForm(f => ({ ...f, technologiesUsed: e.target.value }))}
                        placeholder="React, TypeScript, PostgreSQL"
                      />
                    </div>

                    <div style={s.formGrid}>
                      <div style={s.field}>
                        <label style={s.label}>cover image URL</label>
                        <input
                          style={s.input}
                          type="url"
                          value={form.imageUrl}
                          onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                          placeholder="https://i.imgur.com/..."
                        />
                      </div>
                      <div style={s.field}>
                        <label style={s.label}>github URL</label>
                        <input
                          style={s.input}
                          type="url"
                          value={form.githubUrl}
                          onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div style={s.field}>
                      <label style={s.label}>live demo URL</label>
                      <input
                        style={s.input}
                        type="url"
                        value={form.demoUrl}
                        onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>

                    {/* Image preview */}
                    {form.imageUrl && (
                      <div style={s.field}>
                        <label style={s.label}>preview</label>
                        <img
                          src={form.imageUrl}
                          alt="cover preview"
                          style={s.imagePreview}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}

                    {formError && <p style={s.errorMsg}>{formError}</p>}
                    <div style={s.formActions}>
                      <button type="button" style={s.btn} onClick={closeForm}>cancel</button>
                      <button type="submit" style={s.submitBtn} disabled={formSaving}>
                        {formSaving ? "saving…" : editingId ? "save changes" : "add project"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {projects.length === 0 && !showForm ? (
                <p style={s.emptyState}>no projects yet. add one above.</p>
              ) : (
                <div style={s.projectList}>
                  {projects.map(p => (
                    <div key={p.projectId} style={s.projectRow}>
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt={p.projectName} style={s.projectThumb} />
                      )}
                      <div style={s.projectInfo}>
                        <span style={s.projectName}>{p.projectName}</span>
                        {p.technologiesUsed && (
                          <span style={s.projectTech}>{p.technologiesUsed}</span>
                        )}
                      </div>
                      <div style={s.projectActions}>
                        <button style={s.btn} onClick={() => openEditForm(p)}>edit</button>
                        <button
                          style={{ ...s.btn, ...s.btnDanger }}
                          onClick={() => handleDelete(p.projectId)}
                          disabled={deletingId === p.projectId}
                        >
                          {deletingId === p.projectId ? "…" : "delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
  navRight: { display: "flex", gap: "0.75rem", alignItems: "center" },
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
  navBtnSecondary: { background: "none", borderColor: "#ddd5c8", color: "#6a5a4a" },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "760px",
    margin: "0 auto",
    padding: "4rem 2rem 6rem",
    boxSizing: "border-box",
  },
  loadingText: { color: "#b0a090", fontStyle: "italic", fontSize: "0.9rem" },
  welcomeBlock: { marginBottom: "3rem" },
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
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.25rem",
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
  linkRow: { display: "flex", alignItems: "center", gap: "0.75rem" },
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
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
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
  inputDisabled: { background: "#faf8f5", color: "#b0a090", cursor: "not-allowed" },
  textarea: {
    minHeight: "120px",
    resize: "vertical" as const,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.6,
  },
  textareaShort: {
    minHeight: "72px",
    resize: "vertical" as const,
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.6,
  },
  imagePreview: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ece5dc",
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
  btnSuccess: { borderColor: "#a8c5a0", color: "#507a50" },
  btnDanger: { borderColor: "#d4b0b0", color: "#a05050" },
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
  successMsg: { fontSize: "0.75rem", color: "#507a50", fontStyle: "italic", margin: 0, fontFamily: "system-ui, sans-serif" },
  errorMsg: { fontSize: "0.75rem", color: "#a05050", fontStyle: "italic", margin: 0, fontFamily: "system-ui, sans-serif" },
  projectForm: {
    background: "#faf8f5",
    border: "1px solid #ece5dc",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
  },
  formHeading: {
    fontSize: "0.72rem",
    color: "#a09080",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 1rem",
  },
  formActions: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" },
  projectList: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  projectRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    border: "1px solid #ece5dc",
    borderRadius: "10px",
    background: "#faf8f5",
  },
  projectThumb: {
    width: "48px",
    height: "36px",
    objectFit: "cover",
    borderRadius: "6px",
    flexShrink: 0,
    border: "1px solid #ece5dc",
  },
  projectInfo: { display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1, minWidth: 0 },
  projectName: {
    fontSize: "0.88rem",
    color: "#2a2420",
    fontFamily: "'Georgia', serif",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  projectTech: {
    fontSize: "0.7rem",
    color: "#a09080",
    fontFamily: "system-ui, sans-serif",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  projectActions: { display: "flex", gap: "0.4rem", flexShrink: 0 },
  emptyState: {
    fontSize: "0.8rem",
    color: "#b0a090",
    fontStyle: "italic",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
    padding: "1.5rem 0 0.5rem",
  },
  footer: { position: "relative", zIndex: 1, textAlign: "center", padding: "1.5rem", borderTop: "1px solid #ece5dc" },
  footerText: {
    fontSize: "0.65rem",
    color: "#c0b0a0",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
};

export default Dashboard;

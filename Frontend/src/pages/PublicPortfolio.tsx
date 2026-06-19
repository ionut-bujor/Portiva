import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

interface Project {
  projectId: number;
  projectName: string;
  description: string;
  technologiesUsed: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
}

interface ProfileData {
  username: string;
  firstName: string;
  secondName: string;
  bio: string;
  headline: string;
  website: string;
  imageUrl: string;
  projects: Project[];
}

const cardBarColors = [
  "#c9b99a", "#a8b5a0", "#b5a8b0",
  "#a0adb5", "#c4b5a0", "#b0c4b1",
];

const PublicPortfolio: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/portfolio/${username}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) { setProfile(data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [username]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "2rem", color: "#c9b99a" }}>·</span>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#a09080", fontStyle: "italic" }}>This portfolio doesn't exist.</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#b0a090" }} onClick={() => navigate("/")}>
          ← go home
        </button>
      </div>
    );
  }

  const fullName = `${profile.firstName ?? ""} ${profile.secondName ?? ""}`.trim();
  const initials = `${profile.firstName?.[0] ?? ""}${profile.secondName?.[0] ?? ""}`.toUpperCase();
  const projects = profile.projects ?? [];

  return (
    <div style={s.page}>
      <div style={s.grain} />

      <nav style={s.nav}>
        <span style={s.navBrand}>portiva</span>
        <button
          style={{ background: "none", border: "1px solid #ddd5c8", borderRadius: "20px", padding: "0.4rem 1rem", fontSize: "0.72rem", color: "#6a5a4a", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
          onClick={() => navigate("/")}
        >
          ← explore
        </button>
      </nav>

      <div style={s.layout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.avatarWrap}>
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={fullName} style={s.avatarImg} />
            ) : (
              <div style={s.avatarInitials}>{initials || "?"}</div>
            )}
          </div>

          <h1 style={s.name}>{fullName || profile.username}</h1>
          {profile.headline && <p style={s.headline}>{profile.headline}</p>}
          {profile.bio && <p style={s.bio}>{profile.bio}</p>}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" style={s.websiteLink}>
              {profile.website.replace(/^https?:\/\//, "")} ↗
            </a>
          )}

          <div style={s.statBlock}>
            <span style={s.statNum}>{projects.length}</span>
            <span style={s.statLabel}>projects</span>
          </div>
        </aside>

        {/* Projects */}
        <main style={s.content}>
          {projects.length === 0 ? (
            <div style={s.emptyWrap}>
              <p style={s.emptyText}>No projects yet.</p>
            </div>
          ) : (
            <div style={s.grid}>
              {projects.map((project) => {
                const slug = project.projectName.toLowerCase().replace(/\s+/g, "-");
                const techs = project.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean);
                const barColor = cardBarColors[project.projectId % cardBarColors.length];

                return (
                  <div key={project.projectId} style={s.card}>
                    {/* Cover image or colour bar */}
                    {project.imageUrl ? (
                      <div style={s.cardImageWrap}>
                        <img
                          src={project.imageUrl}
                          alt={project.projectName}
                          style={s.cardImage}
                        />
                      </div>
                    ) : (
                      <div style={{ ...s.cardBar, background: barColor }} />
                    )}

                    <div style={s.cardBody}>
                      <h3 style={s.cardTitle}>{project.projectName}</h3>
                      <p style={s.cardDesc}>{project.description}</p>

                      <div style={s.techRow}>
                        {techs.slice(0, 3).map((t) => (
                          <span key={t} style={s.techPill}>{t}</span>
                        ))}
                        {techs.length > 3 && (
                          <span style={s.techPill}>+{techs.length - 3}</span>
                        )}
                      </div>

                      {/* Links row */}
                      <div style={s.cardLinks}>
                        <button
                          style={s.cardLinkBtn}
                          onClick={() => navigate(`/u/${username}/${slug}`)}
                        >
                          read more →
                        </button>
                        <div style={s.externalLinks}>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={s.iconLink}
                              onClick={(e) => e.stopPropagation()}
                              title="View on GitHub"
                            >
                              {/* GitHub icon */}
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={s.iconLink}
                              onClick={(e) => e.stopPropagation()}
                              title="Live demo"
                            >
                              {/* External link icon */}
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

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
  navBrand: {
    fontSize: "0.8rem",
    color: "#b0a090",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  layout: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    minHeight: "calc(100vh - 65px)",
    width: "100%",
    boxSizing: "border-box",
  },
  sidebar: {
    padding: "3rem 2.5rem",
    borderRight: "1px solid #ece5dc",
    position: "sticky",
    top: 0,
    height: "calc(100vh - 65px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxSizing: "border-box",
  },
  avatarWrap: { marginBottom: "0.75rem" },
  avatarImg: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e8e0d5",
  },
  avatarInitials: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#e8e0d5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    color: "#7a6a5a",
    letterSpacing: "1px",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: 400,
    color: "#2a2420",
    margin: 0,
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },
  headline: {
    fontSize: "0.85rem",
    color: "#8a7a6a",
    margin: 0,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  bio: {
    fontSize: "0.82rem",
    color: "#6a5a4a",
    margin: "0.25rem 0 0",
    lineHeight: 1.7,
  },
  websiteLink: {
    fontSize: "0.72rem",
    color: "#a09080",
    textDecoration: "none",
    letterSpacing: "0.04em",
    borderBottom: "1px solid #d5c9bc",
    paddingBottom: "1px",
    display: "inline-block",
    marginTop: "0.25rem",
  },
  statBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #ece5dc",
  },
  statNum: { fontSize: "1.5rem", fontWeight: 400, color: "#2a2420" },
  statLabel: {
    fontSize: "0.65rem",
    color: "#a09080",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  content: { padding: "3rem", boxSizing: "border-box" },
  emptyWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: "6rem",
  },
  emptyText: { color: "#b0a090", fontStyle: "italic", fontSize: "0.9rem", margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.25rem",
    width: "100%",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #ece5dc",
    borderRadius: "12px",
    overflow: "hidden",
    textAlign: "left",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardImageWrap: {
    width: "100%",
    height: "160px",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  cardBar: { height: "4px", width: "100%", flexShrink: 0 },
  cardBody: { padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 400,
    color: "#2a2420",
    margin: "0 0 0.4rem",
    letterSpacing: "-0.2px",
  },
  cardDesc: {
    fontSize: "0.78rem",
    color: "#8a7a6a",
    lineHeight: 1.6,
    margin: "0 0 1rem",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    fontFamily: "system-ui, sans-serif",
    flex: 1,
  },
  techRow: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1rem" },
  techPill: {
    fontSize: "0.62rem",
    color: "#8a7a6a",
    background: "#f5f0ea",
    border: "1px solid #ece5dc",
    borderRadius: "20px",
    padding: "2px 8px",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
  },
  cardLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: "0.75rem",
    borderTop: "1px solid #f0e8e0",
  },
  cardLinkBtn: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "0.72rem",
    color: "#8a7a6a",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
  },
  externalLinks: { display: "flex", gap: "0.5rem", alignItems: "center" },
  iconLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a09080",
    textDecoration: "none",
    padding: "4px",
    borderRadius: "4px",
    transition: "color 0.15s ease",
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

export default PublicPortfolio;

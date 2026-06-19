import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const ProjectPage: React.FC = () => {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from the public portfolio endpoint so no auth needed
    fetch(`${API_BASE}/portfolio/${username}`)
      .then((r) => {
        if (!r.ok) throw new Error("Portfolio not found");
        return r.json();
      })
      .then((data) => {
        const projects: Project[] = data.projects ?? [];
        const found = projects.find(
          (p) => p.projectName.toLowerCase().replace(/\s+/g, "-") === slug
        );
        if (!found) throw new Error("Project not found");
        setProject(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username, slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "2rem", color: "#c9b99a" }}>·</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#a09080", fontStyle: "italic" }}>{error ?? "Project not found"}</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#b0a090" }} onClick={() => navigate(-1)}>
          ← go back
        </button>
      </div>
    );
  }

  const techs = project.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean);
  const paragraphs = (project.longDescription || project.description).split("\n").filter(Boolean);

  return (
    <div style={s.page}>
      <div style={s.grain} />

      {/* Nav */}
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate(`/u/${username}`)}>
          ← {username}
        </button>
        <span style={s.navLabel}>project</span>
      </nav>

      {/* Hero image */}
      {project.imageUrl && (
        <div style={s.heroWrap}>
          <img src={project.imageUrl} alt={project.projectName} style={s.heroImg} />
          <div style={s.heroOverlay} />
        </div>
      )}

      <main style={s.main}>
        {/* Title block */}
        <div style={s.titleBlock}>
          <p style={s.label}>case study</p>
          <h1 style={s.title}>{project.projectName}</h1>
          <p style={s.tagline}>{project.description}</p>
        </div>

        {/* CTA links */}
        {(project.githubUrl || project.demoUrl) && (
          <div style={s.ctaRow}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" style={s.ctaBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "6px", flexShrink: 0 }}>
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                view on github
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" style={{ ...s.ctaBtn, ...s.ctaBtnPrimary }}>
                live demo ↗
              </a>
            )}
          </div>
        )}

        <div style={s.rule} />

        {/* Write-up */}
        <div style={s.section}>
          <p style={s.sectionLabel}>about</p>
          <div style={s.prose}>
            {paragraphs.map((para, i) => (
              <p key={i} style={s.para}>{para}</p>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div style={s.section}>
          <p style={s.sectionLabel}>built with</p>
          <div style={s.techGrid}>
            {techs.map((tech) => (
              <div key={tech} style={s.techCard}>{tech}</div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div style={s.backRow}>
          <button style={s.backLink} onClick={() => navigate(`/u/${username}`)}>
            ← back to {username}'s portfolio
          </button>
        </div>
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
    background: "#faf8f5",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflowX: "hidden",
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
    maxWidth: "720px",
    margin: "0 auto",
    padding: "2rem 2rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.75rem",
    color: "#a09080",
    fontFamily: "system-ui, sans-serif",
    padding: 0,
    letterSpacing: "0.02em",
  },
  navLabel: {
    fontSize: "0.65rem",
    color: "#c0b0a0",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  heroWrap: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "720px",
    margin: "2rem auto 0",
    borderRadius: "16px",
    overflow: "hidden",
    height: "360px",
    padding: "0 2rem",
    boxSizing: "border-box",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
    display: "block",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: "16px",
    background: "linear-gradient(to bottom, transparent 60%, rgba(250,248,245,0.4) 100%)",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "720px",
    margin: "0 auto",
    padding: "3rem 2rem 6rem",
  },
  titleBlock: { marginBottom: "2rem" },
  label: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 0.75rem",
  },
  title: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: 400,
    color: "#2a2420",
    margin: "0 0 0.75rem",
    letterSpacing: "-1px",
    lineHeight: 1.1,
  },
  tagline: {
    fontSize: "1.05rem",
    color: "#8a7a6a",
    margin: 0,
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  ctaRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "2.5rem",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.55rem 1.25rem",
    background: "none",
    border: "1px solid #ddd5c8",
    borderRadius: "20px",
    fontSize: "0.75rem",
    color: "#6a5a4a",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.03em",
    textDecoration: "none",
    transition: "border-color 0.15s ease",
  },
  ctaBtnPrimary: {
    background: "#2a2420",
    border: "1px solid #2a2420",
    color: "#faf8f5",
  },
  rule: {
    height: "1px",
    background: "#e8e0d5",
    margin: "0 0 2.5rem",
  },
  section: { marginBottom: "3rem" },
  sectionLabel: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 1.25rem",
  },
  prose: { display: "flex", flexDirection: "column", gap: "1rem" },
  para: {
    fontSize: "1.05rem",
    color: "#5a4a3a",
    lineHeight: 1.85,
    margin: 0,
  },
  techGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  techCard: {
    fontSize: "0.8rem",
    color: "#6a5a4a",
    background: "#ffffff",
    border: "1px solid #ece5dc",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  backRow: {
    paddingTop: "2rem",
    borderTop: "1px solid #ece5dc",
  },
  backLink: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "0.8rem",
    color: "#a09080",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.02em",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "2rem",
    borderTop: "1px solid #ece5dc",
  },
  footerText: {
    fontSize: "0.7rem",
    color: "#c0b0a0",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
};

export default ProjectPage;

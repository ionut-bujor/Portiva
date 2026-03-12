import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

interface Project {
  projectId: number;
  projectName: string;
  description: string;
  technologiesUsed: string;
}

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    fetch(`${API_BASE}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
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
  }, [slug, token, navigate]);

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <span style={{ fontSize: "2rem", color: "#c9b99a" }}>·</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={styles.loadingWrap}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#a09080", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "1rem" }}>
            {error ?? "Project not found"}
          </p>
          <button style={styles.backBtn} onClick={() => navigate("/portfolio")}>
            ← back to portfolio
          </button>
        </div>
      </div>
    );
  }

  const techs = project.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div style={styles.page}>
      <div style={styles.grain} />

      {/* Nav */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("/portfolio")}>
          ← portfolio
        </button>
        <span style={styles.navLabel}>project</span>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {/* Title */}
        <div style={styles.titleBlock}>
          <p style={styles.label}>case study</p>
          <h1 style={styles.title}>{project.projectName}</h1>
        </div>

        {/* Thin rule */}
        <div style={styles.rule} />

        {/* Description */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>about</p>
          <p style={styles.descText}>{project.description}</p>
        </div>

        {/* Tech stack */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>built with</p>
          <div style={styles.techGrid}>
            {techs.map((tech) => (
              <div key={tech} style={styles.techCard}>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <span style={styles.footerText}>made with portiva</span>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
    backgroundSize: "128px",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.5,
  },
  loadingWrap: {
    minHeight: "100vh",
    background: "#faf8f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nav: {
    position: "relative",
    zIndex: 1,
    maxWidth: "680px",
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
    letterSpacing: "0.05em",
    fontFamily: "'Georgia', serif",
    padding: 0,
  },
  navLabel: {
    fontSize: "0.65rem",
    color: "#c0b0a0",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "680px",
    margin: "0 auto",
    padding: "4rem 2rem 6rem",
  },
  titleBlock: {
    marginBottom: "2.5rem",
  },
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
    margin: 0,
    letterSpacing: "-1px",
    lineHeight: 1.1,
  },
  rule: {
    height: "1px",
    background: "#e8e0d5",
    margin: "2.5rem 0",
  },
  section: {
    marginBottom: "3rem",
  },
  sectionLabel: {
    fontSize: "0.65rem",
    color: "#b0a090",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
    margin: "0 0 1rem",
  },
  descText: {
    fontSize: "1.05rem",
    color: "#5a4a3a",
    lineHeight: 1.8,
    margin: 0,
    fontFamily: "'Georgia', serif",
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

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  projectId: number;
  projectName: string;
  description: string;
  technologiesUsed: string;
}

interface PortfolioModalProps {
  onClose: () => void;
  profile: {
    firstName: string;
    secondName: string;
    headline: string;
    bio: string;
    website: string;
    username: string;
    projects?: Project[];
  };
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ onClose, profile }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fullName = `${profile.firstName} ${profile.secondName}`.trim();
  const initials = `${profile.firstName?.[0] ?? ""}${profile.secondName?.[0] ?? ""}`.toUpperCase();
  const projects = profile.projects ?? [];

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: "linear-gradient(145deg, #0f0f13 0%, #13131a 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="p-8 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              {initials || "?"}
            </div>
            <div>
              <h2
                className="text-2xl font-semibold text-white"
                style={{ letterSpacing: "-0.5px" }}
              >
                {fullName || profile.username}
              </h2>
              {profile.headline && (
                <p className="text-sm mt-1" style={{ color: "#a78bfa" }}>
                  {profile.headline}
                </p>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs mt-1.5 inline-flex items-center gap-1 hover:text-white transition"
                  style={{ color: "#6b7280" }}
                >
                  <span>↗</span> {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          {profile.bio && (
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ color: "#9ca3af", maxWidth: "560px" }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Projects */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-5">
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#4b5563" }}
            >
              Projects
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
            >
              {projects.length}
            </span>
          </div>

          {projects.length === 0 ? (
            <p className="text-sm" style={{ color: "#4b5563" }}>
              No projects added yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((project) => {
                const techs = project.technologiesUsed
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                const slug = project.projectName.toLowerCase().replace(/\s+/g, "-");

                return (
                  <button
                    key={project.projectId}
                    onClick={() => { onClose(); navigate(`/${slug}`); }}
                    className="text-left p-4 rounded-2xl transition group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        {project.projectName}
                      </span>
                      <span className="text-gray-600 group-hover:text-indigo-400 transition text-xs ml-2 mt-0.5">
                        ↗
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{ color: "#6b7280" }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#9ca3af",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("authUsername");

  const [displayName, setDisplayName] = useState(username || "");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);

    // Placeholder for future backend call
    setTimeout(() => {
      setSaving(false);
      setSavedMessage("Profile saved (not yet persisted to backend).");
    }, 500);
  };

  return (
      <div className="min-h-screen w-screen bg-gray-950 text-gray-100 font-sans">
        <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-gray-950/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold">
              P
            </div>
            <div>
              <h1 className="font-semibold text-xl">My Portfolio</h1>
              <p className="text-xs text-gray-400">
                {username ? `Welcome back, ${username}` : "Your personal portfolio workspace"}
              </p>
            </div>
          </div>

          <button
              className="px-3 py-1.5 rounded-full border border-gray-700 text-sm text-gray-200 hover:bg-gray-800 transition"
              onClick={() => navigate("/")}
          >
            Back to explore
          </button>
        </header>

        <main className="p-6 md:p-10 grid gap-8 max-w-5xl mx-auto">
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-lg font-semibold mb-1">Profile</h2>
            <p className="text-sm text-gray-400 mb-5">
              This information appears on your public portfolio page.
            </p>

            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                    Display name
                  </label>
                  <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                    Headline
                  </label>
                  <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Frontend engineer, designer, builder"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                  Bio
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[96px]"
                    placeholder="Tell visitors who you are and what you build."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">
                  Website or main link
                </label>
                <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://"
                />
              </div>

              {savedMessage && (
                  <p className="text-xs text-emerald-400">{savedMessage}</p>
              )}

              <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-indigo-500 text-sm font-medium text-white hover:bg-indigo-400 transition disabled:opacity-60"
                    disabled={saving}
                >
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </form>
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-lg font-semibold mb-1">Projects</h2>
            <p className="text-sm text-gray-400 mb-5">
              Soon you&apos;ll be able to add projects that appear on your public portfolio.
            </p>
            <button className="px-4 py-2 rounded-full bg-gray-800 text-sm font-medium text-gray-200 hover:bg-gray-700 transition">
              Add new project
            </button>
          </section>
        </main>
      </div>
  );
};

export default Dashboard;


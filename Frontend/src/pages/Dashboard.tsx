import React from "react";

const Dashboard: React.FC = () => {
  const username = localStorage.getItem("authUsername");

  return (
      <div className="min-h-screen w-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-bold text-2xl text-gray-900">My Portfolio</h1>
          <div className="text-gray-800 font-medium">
            {username ? `Welcome back, ${username}` : "Welcome to your dashboard"}
          </div>
        </header>

        <main className="p-8 grid gap-8 max-w-5xl mx-auto">
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Profile</h2>
            <p className="text-gray-600 text-sm">
              This is where your profile details (name, bio, links) will appear.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Projects</h2>
            <p className="text-gray-600 text-sm mb-4">
              Here you&apos;ll manage the projects that show on your public portfolio.
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition">
              Add new project
            </button>
          </section>
        </main>
      </div>
  );
};

export default Dashboard;


import React from "react";
import { mockUser, mockPortfolios } from "../mockData";
import {FaFolderOpen, FaSearch, FaUser} from "react-icons/fa";

const Homepage: React.FC = () => {
  // @ts-ignore
  return (
      <div className="min-h-screen w-screen bg-gray-50 font-sans">
        {/* Header */}

        <header className="bg-gray-50 shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-bold text-2xl text-gray-900">Portiva</h1>

          <div className="flex gap-4">
            {/* Explore Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
              <FaFolderOpen />
              Explore
            </button>

            {/* My Portfolio Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
              <FaUser />
              My Portfolio
            </button>

            {/* Login Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition">
              <FaSearch />
              Login
            </button>
          </div>

          <div className="text-gray-800 font-medium">
            {mockUser.loggedIn ? `Hello, ${mockUser.name}` : "Hello, Guest"}
          </div>
        </header>

        {/* Hero / Search */}
        <div className="w-full p-8 flex justify-center bg-gray-50">
          <input
              type="text"
              placeholder="Search portfolios..."
              className="w-full max-w-2xl p-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
          />
        </div>

        {/* Explore Section */}
        <main className="flex flex-wrap justify-center gap-8 p-8">
          {mockPortfolios.map((portfolio) => (
              <div
                  key={portfolio.id}
                  className="flex-1 min-w-[250px] max-w-[350px] bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{portfolio.name}</h2>
                <p className="text-gray-500 text-sm mb-4">User: {portfolio.username}</p>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-full text-sm hover:bg-indigo-600 transition">
                  View Portfolio
                </button>
              </div>
          ))}
        </main>
      </div>
  );
};

export default Homepage;

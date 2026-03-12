import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import PublicPortfolio from "./pages/PublicPortfolio";
import ProjectPage from "./pages/ProjectPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/u/:username" element={<PublicPortfolio />} />
        <Route path="/u/:username/:slug" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import PortfolioPage from "./pages/PortfolioPage";

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:slug" element={<ProjectPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page.jsx";
import QuotesPage from "./pages/quotes-page.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quotes" element={<QuotesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

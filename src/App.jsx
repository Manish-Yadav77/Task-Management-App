// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import { BoardProvider } from "./context/BoardContext";
import ErrorBoundary from "./pages/ErrorBoundary";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App = () => {
  return (
    <ErrorBoundary>

    <BoardProvider>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<BoardsPage />} />
          <Route path="/board/:boardId" element={<BoardDetailPage />} />
        </Routes>
        <Footer/>
      </Router>
    </BoardProvider>
    </ErrorBoundary>
  );
};

export default App;

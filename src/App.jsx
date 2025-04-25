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
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <ErrorBoundary>
      <BoardProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <BoardsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/board/:boardId"
              element={
                <PrivateRoute>
                  <BoardDetailPage />
                </PrivateRoute>
              }
            />

            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </Router>
      </BoardProvider>
    </ErrorBoundary>
  );
};

export default App;

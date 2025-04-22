import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { KanbanProvider } from "./context/KanbanContext";
import KanbanBoard from "./components/KanbanBoard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SingleKanban from "./components/SingleKanban";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <KanbanProvider>
      <Router>
        <Header />
        <Routes>
          {/* Main Kanban Board */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<KanbanBoard />} />
          <Route path="/singlekanban/:id" element={<SingleKanban />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/Signup" element={<SignUp />}/>
        </Routes>
        <Footer />
      </Router>
    </KanbanProvider>
  );
}

export default App;
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import TestProxy from "./pages/TestProxy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Complaints from "./pages/Complaints";
import MarketPlace from "./pages/MarketPlace";
import Profile from "./pages/Profile";
import Concerns from "./pages/Concerns";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/h" element={<TestProxy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/concerns" element={<Concerns />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
import PublicDashboard from "./pages/PublicDashboard.jsx";
import ComplaintDetail from "./pages/ComplaintDetail.jsx";
import AuthorityDashboard from "./pages/AuthorityDashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import ManageStaff from "./pages/ManageStaff.jsx";

function App() {
  return (
    <div className="min-h-screen bg-fog">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/suivi" element={<TrackComplaint />} />
          <Route path="/public" element={<PublicDashboard />} />

          <Route
            path="/nouvelle-plainte"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-plaintes"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plaintes/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autorite"
            element={
              <ProtectedRoute roles={["agent", "authority", "admin"]}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytique"
            element={
              <ProtectedRoute roles={["agent", "authority", "admin"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/personnel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageStaff />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="text-center py-20 text-slate">Page introuvable</div>} />
        </Routes>
      </main>
      
    </div>
  );
}

export default App;

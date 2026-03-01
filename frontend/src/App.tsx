import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import "./App.css";
import AdminPage from "./components/admin";
import AddVehiclePage from "./components/admin/vehicles/new/AddVehiclePage";
import Footer from "./components/footer";
import Header from "./components/header";
import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/signup";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, user } = useAuth();
  const canAccessAdmin = isAuthenticated && user?.role === "admin";

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account-signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/vehicles/new"
            element={
              canAccessAdmin ? <AddVehiclePage /> : <Navigate to="/" replace />
            }
          />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;

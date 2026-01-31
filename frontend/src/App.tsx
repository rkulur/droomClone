import { Route, BrowserRouter as Router, Routes } from "react-router";
import "./App.css";
import Footer from "./components/footer";
import Header from "./components/header";
import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/signup";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account-signup" element={<Signup />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginScreen from "./pages/LoginScreen";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/[id]";
import RegisterScreen from "./pages/RegisterScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
      </Routes>

      {/* ✅ Đặt bên ngoài Routes */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;

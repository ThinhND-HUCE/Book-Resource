import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginScreen from "./pages/LoginScreen";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
<<<<<<< HEAD
import CourseDetail from "./pages/[id]";
import RegisterScreen from "./pages/RegisterScreen";
=======
import ProbabilityandStatistics from "./pages/ProbabilityandStatistics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> f32ef398ca03f0c4d9a267da1b6a6c0a803d9964

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
      </Routes>

      {/* ✅ Đặt bên ngoài Routes */}
=======
        <Route path="/ProbabilityandStatistics" element={<ProbabilityandStatistics />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
>>>>>>> f32ef398ca03f0c4d9a267da1b6a6c0a803d9964
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;

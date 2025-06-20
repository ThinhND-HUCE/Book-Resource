import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginScreen from "./pages/LoginScreen";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import RegisterScreen from "./pages/RegisterScreen";
import ProbabilityandStatistics from "./pages/University/ProbabilityandStatistics";
import CoursePage from "./pages/CoursePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/ProbabilityandStatistics" element={<ProbabilityandStatistics />} />
        <Route path="/courses/:gradeId" element={<CoursePage />} />
        
        {/* Thêm các route khác tại đây */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;

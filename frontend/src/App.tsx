import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen"; // đường dẫn đến LoginScreen
import ForgotPassword from "./pages/ForgotPassword"; // đường dẫn đến ForgotPassword
import Dashboard from "./pages/Dashboard";
import ProbabilityandStatistics from "./pages/ProbabilityandStatistics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ProbabilityandStatistics" element={<ProbabilityandStatistics />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;

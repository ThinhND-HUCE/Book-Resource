import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen"; // đường dẫn đến LoginScreen
import ForgotPassword from "./pages/ForgotPassword"; // đường dẫn đến ForgotPassword
import CourseList from "./components/CourseList";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

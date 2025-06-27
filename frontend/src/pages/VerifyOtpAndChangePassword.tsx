import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { verifyOtpAndResetPassword } from "../constants/apiService";
import { toast } from "react-toastify";
import backgroundImage from "../assets/images/HUCE.jpg"; // ✅ thêm ảnh nền

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(() => localStorage.getItem("forgot_email") || "");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }

    const response = await verifyOtpAndResetPassword(email, otp, newPassword);
    if (response.success) {
      toast.success("🎉 Đổi mật khẩu thành công!");
      localStorage.removeItem("forgot_email");
      navigate("/login");
    } else {
      toast.error(response.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <VerifyWrapper>
      <VerifyCard>
        <BackButton onClick={() => navigate("/forgot-password")}>
          <FiArrowLeft size={20} />
        </BackButton>

        <Title>Xác nhận mã OTP</Title>

        <Label>Mã OTP</Label>
        <Input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Label>Mật khẩu mới</Label>
        <Input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Label>Nhập lại mật khẩu</Label>
        <Input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button onClick={handleSubmit}>Xác nhận & Đổi mật khẩu</Button>
      </VerifyCard>
    </VerifyWrapper>
  );
}

const VerifyWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const VerifyCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px 30px 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  color: black;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
  color: black;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2196f3;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #007bff;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #007bff;
  }
`;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/images/HUCE.jpg";
import logoImage from "../assets/images/logothay.jpg";
import { toast } from "react-toastify";
import { getToken } from "../constants/storageService";
import {
  sendFirstLoginOtp,
  verifyFirstLoginOtp,
  changeFirstLoginPassword,
} from "../constants/apiService";

const FirstLogin = () => {
  const [step, setStep] = useState<"send-otp" | "verify-otp" | "change-password">("send-otp");
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const token = getToken();
    console.log("🔐 Token gửi OTP:", token);

    if (!token) {
      toast.error("Không tìm thấy token! Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await sendFirstLoginOtp(); 
      toast.success(" OTP đã được gửi");
      setStep("verify-otp");
    } catch (err: any) {
      toast.error(err.message || "Lỗi gửi OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyFirstLoginOtp(otp);
      toast.success(" Xác thực OTP thành công");
      setStep("change-password");
    } catch (err: any) {
      toast.error(err.message || "OTP sai hoặc đã hết hạn");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(" Mật khẩu mới không khớp");
      return;
    }

    try {
      await changeFirstLoginPassword(oldPassword, newPassword);
      toast.success(" Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Lỗi đổi mật khẩu");
    }
  };

  return (
    <LoginBackground>
      <Overlay />
      <LoginCard>
        <BackButton onClick={() => navigate("/login")}>← Quay lại</BackButton>
        <Logo src={logoImage} alt="Logo" />
        <Title>Xác minh & Đổi mật khẩu</Title>

        {step === "send-otp" && (
          <>
            <Label>Nhấn nút dưới để gửi mã OTP đến email</Label>
            <LoginButton onClick={handleSendOtp}>Gửi mã OTP</LoginButton>
          </>
        )}

        {step === "verify-otp" && (
          <>
            <Label>Nhập mã OTP đã nhận</Label>
            <Input
              placeholder="Mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <LoginButton onClick={handleVerifyOtp}>Xác nhận OTP</LoginButton>
          </>
        )}

        {step === "change-password" && (
          <>
            <Label>Mật khẩu cũ</Label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <Label>Mật khẩu mới</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Label>Xác nhận mật khẩu</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <LoginButton onClick={handleChangePassword}>
              Xác nhận & Đăng nhập
            </LoginButton>
          </>
        )}
      </LoginCard>
    </LoginBackground>
  );
};

export default FirstLogin;

// Styled Components (không thay đổi phần này)
const LoginBackground = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 0;
`;

const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  z-index: 1;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 10px;
  max-width: 100px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: black;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
  color: black;
`;

const Input = styled.input`
  width: 428px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2196f3;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    background-color: #007bff;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #2196f3;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  z-index: 2;
`;


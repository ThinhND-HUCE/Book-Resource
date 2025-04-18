import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { sendOtp } from "../constants/apiService";

const ForgotPasswordWrapper = styled.div`
  background-color: #f4f6f9;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
`;

const ForgotPasswordCard = styled.div`
  background-color: white;
  padding: 40px 30px 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
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

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
`;

const SendOtpButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    try {
      const response = await sendOtp(email);
      if (response.success) {
        alert("🎉 Một mã OTP đã được gửi đến email của bạn!");
        navigate("/verify-otp");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError("Không thể kết nối đến server.");
    }
  };

  return (
    <ForgotPasswordWrapper>
      <ForgotPasswordCard>
        <BackButton onClick={() => navigate("/login")}>
          <FiArrowLeft size={20} />
          
        </BackButton>

        <Title>Quên Mật Khẩu</Title>

        <Label>Email*</Label>
        <Input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <Error>{error}</Error>}

        <SendOtpButton onClick={handleSendOtp}>Gửi mã OTP</SendOtpButton>
      </ForgotPasswordCard>
    </ForgotPasswordWrapper>
  );
}

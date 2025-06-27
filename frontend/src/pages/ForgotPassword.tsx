import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { sendOtp } from "../constants/apiService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import backgroundImage from "../assets/images/HUCE.jpg";


const ForgotPasswordWrapper = styled.div`
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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: white;
  margin-top: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendOtp = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await sendOtp(email);
      if (response.success) {
        localStorage.setItem("forgot_email", email);
        toast.success("🎉 Một mã OTP đã được gửi đến email của bạn!");
        navigate("/verify-otp");
      } else {
        toast.error(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        setError(response.message);
      }
    } catch (err: any) {
      toast.error("Không thể kết nối đến máy chủ.");
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
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
        {isLoading && (
          <LoadingOverlay>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Đang gửi mã OTP...</LoadingText>
            </LoadingContainer>
          </LoadingOverlay>
        )}
      </ForgotPasswordCard>
    </ForgotPasswordWrapper>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/images/HUCE.jpg";
import logoImage from "../assets/images/logothay.jpg";
import { verifyBookCode, registerUser } from "../constants/apiService";
import { toast } from 'react-toastify';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
const [hasShownToast, setHasShownToast] = useState(false);

useEffect(() => {
  if (!hasShownToast) {
    const toastId = toast.warning("Vui lòng nhập email và mã sách để nhận mã xác nhận.", {
      autoClose: 7000, // Hiển thị thông báo trong 7 giây
    });
    setHasShownToast(true);

    // Nếu cần, bạn có thể hủy thông báo sau 7 giây
    setTimeout(() => {
      toast.dismiss(toastId); // Hủy thông báo sau 7 giây
    }, 7000);
  }
}, [hasShownToast]);

  const handleVerifyBookCode = async () => {
    setError(null);

    if (!bookCode && !email) {
      toast.warning("Vui lòng nhập email và mã sách.");
      return;
    }

    if (!email) {
      toast.warning("Vui lòng nhập email.");
      document.getElementById("email")?.focus();
      return;
    }

    if (!bookCode) {
      toast.warning("Vui lòng nhập mã sách.");
      document.getElementById("bookCode")?.focus();
      return;
    }

    try {
      await verifyBookCode(bookCode, email);
      setCodeSent(true);
      toast.success("Mã xác nhận đã được gửi về email!");
    } catch (err: any) {
      setError(err.message || "Lỗi khi gửi mã xác nhận.");
      toast.error("Gửi mã thất bại.");
    }
  };


  const handleRegister = async () => {
    setError(null);

    if (!username) {
      toast.warning("Vui lòng nhập tài khoản.");
      document.getElementById("username")?.focus();
      return;
    }

    if (!email) {
      toast.warning("Vui lòng nhập email.");
      document.getElementById("email")?.focus();
      return;
    }

    if (!phone) {
      toast.warning("Vui lòng nhập số điện thoại.");
      document.getElementById("phone")?.focus();
      return;
    }

    if (!password) {
      toast.warning("Vui lòng nhập mật khẩu.");
      document.getElementById("password")?.focus();
      return;
    }

    if (!confirmPassword) {
      toast.warning("Vui lòng xác nhận mật khẩu.");
      document.getElementById("confirmPassword")?.focus();
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Mật khẩu không khớp.");
      document.getElementById("confirmPassword")?.focus();
      return;
    }

    if (!verifyCode) {
      toast.warning("Vui lòng nhập mã khớp đã nhận qua email.");
      document.getElementById("verifyCode")?.focus();
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({ username, email, phone, password, verifyCode });
      toast.success("🎉 Đăng ký thành công!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối!");
      toast.error("❌ Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <LoginBackground>
      <Overlay />
      <LoginCard>
        {/* <Logo src={logoImage} alt="Logo" /> */}
        <Title>Đăng ký tài khoản</Title>

        <Label>Tài khoản*</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <Label>Email*</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Label>Số điện thoại*</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
        />

        <Label>Mật khẩu*</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Label>Nhập lại mật khẩu*</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        <Label>Mã sách*</Label>
        <Row>
          <Input
            id="bookCode"
            value={bookCode}
            onChange={(e) => setBookCode(e.target.value)}
            disabled={isLoading || codeSent}
          />
          <VerifyButton
            onClick={handleVerifyBookCode}
            disabled={isLoading || codeSent}
          >
            {codeSent ? "✓ Đã xác minh" : "Xác nhận mã sách"}
          </VerifyButton>
        </Row>

        {codeSent && (
          <>
            <Label>Nhập mã khớp từ email*</Label>
            <Input
              id="verifyCode"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              disabled={isLoading}
            />
          </>
        )}



        {error && <Error>{error}</Error>}

        <LoginButton
          onClick={handleRegister}
          disabled={isLoading || !verifyCode}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </LoginButton>


        <Footer>
          <FooterText>Đã có tài khoản?</FooterText>
          <Link onClick={() => navigate("/")}>Đăng nhập</Link>
        </Footer>
      </LoginCard>
    </LoginBackground>
  );
}

const LoginBackground = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 60px 20px;
  overflow-y: auto;
  box-sizing: border-box;
`;


const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  z-index: 1;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  box-sizing: border-box;
  top: 120px;
  margin-bottom: 100px;
`;




const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 0;
  pointer-events: none; /* để không chắn nút bấm */
  `;


const Logo = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 100px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: stretch;
  }

  & > input {
    flex: 1;
    min-width: 0;
  }

  & > button {
    flex-shrink: 0;
    white-space: nowrap;
  }
`;




const VerifyButton = styled.button`
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 10px 15px;
  height: 40px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #e0a800;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
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

  &:hover {
    background-color: #007bff;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    &:hover {
      background-color: #cccccc;
    }
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const FooterText = styled.span`
  font-size: 14px;
`;

const Link = styled.button`
  background: none;
  color: #2196f3;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
`;


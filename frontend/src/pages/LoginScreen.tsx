import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/images/HUCE.jpg";
import logoImage from "../assets/images/logothay.jpg";
import { toast } from "react-toastify";
import { loginUser } from "../constants/apiService";
import { setToken } from "../constants/storageService";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("remember_username");
    const savedPassword = localStorage.getItem("remember_password");

    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginUser(username, password);

      if (data.access && data.refresh && data.role) {
        setToken(data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("role", data.role);

        if (rememberMe) {
          localStorage.setItem("remember_username", username);
          localStorage.setItem("remember_password", password);
        } else {
          localStorage.removeItem("remember_username");
          localStorage.removeItem("remember_password");
        }

        if (data.role === "admin") {
          navigate("/AdminDashboard");
          toast.success("🎉 Đăng nhập thành công!");
        } else if (data.role === "student") {
          if (data.is_first_login === true) {
            navigate("/FirstLogin");
            toast.info("Vui lòng xác nhận email để thay đổi mật khẩu");
          } else {
            navigate("/Dashboard");
            toast.success("🎉 Đăng nhập thành công!");
          }
        } else if (data.role === "customer") {
          navigate("/Dashboard");
        } else {
          toast.error("Vai trò người dùng không hợp lệ!");
        }

      } else {
        toast.error("Thiếu thông tin xác thực từ server!");
      }
    } catch (err: any) {
      toast.error(" " + (err.message || "Không thể kết nối đến server!"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginBackground>
      <Overlay />
      <LoginCard>
        <Title>Đăng nhập</Title>

        <Label>Tài khoản*</Label>
        <Input
          placeholder="Nhập tên tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <Label>Mật khẩu*</Label>
        <PasswordWrapper>
          <PasswordInput
            placeholder="Nhập mật khẩu"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <ToggleEye onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </ToggleEye>
        </PasswordWrapper>

        <Row>
          <Checkbox onClick={() => !isLoading && setRememberMe(!rememberMe)}>
            {rememberMe ? "☑" : "☐"} Ghi nhớ
          </Checkbox>
          <Link onClick={() => !isLoading && navigate("/forgot-password")}>Quên mật khẩu?</Link>
        </Row>

        {error && <Error>{error}</Error>}

        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </LoginButton>

        <Footer>
          <FooterText>Chưa có tài khoản? </FooterText>
          <Link onClick={() => !isLoading && navigate("/register")}>Đăng ký</Link>
        </Footer>
      </LoginCard>

      {isLoading && (
        <LoadingOverlay>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Đang đăng nhập...</LoadingText>
          </LoadingContainer>
        </LoadingOverlay>
      )}
    </LoginBackground>
  );
}

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  background-color: #fff;
  margin-bottom: 20px;
  box-sizing: border-box;
  color: #000;

  &:focus {
    border-color: #2196f3;
    outline: none;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const PasswordInput = styled(Input)`
  padding-right: 44px;
  color: #000;
  margin-bottom: 0;
`;

const ToggleEye = styled.div`
  position: absolute;
  top: 18%;
  right: 12px;
  line-height: 40px;
  cursor: pointer;
  color: #555;
`;

const LoginBackground = styled.div`
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 0;
`;

const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  z-index: 1;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 20px;
  max-width: 100px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #1e293b;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #1e293b;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Checkbox = styled.label`
  font-size: 14px;
  cursor: pointer;
  color: #1e293b;
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const LoginButton = styled.button`
  margin-top: 25px;
  width: 100%;
  padding: 14px;
  background-color: #2196f3;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #007bff;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const FooterText = styled.span`
  font-size: 14px;
  color: #1e293b;
`;

const Link = styled.button`
  background: none;
  color: #2196f3;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;

  &:hover {
    text-decoration: none;
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

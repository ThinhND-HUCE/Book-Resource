import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/images/HUCE.jpg";
import logoImage from "../assets/images/logothay.jpg";
import { loginUser } from "../constants/apiService";
export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("📤 Gửi yêu cầu đăng nhập với:", { username, password });
      const data = await loginUser(username, password);
      console.log("📥 Response từ server:", data);
      
      if (data.access && data.refresh) {
        // Lưu token vào localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        navigate("/Dashboard"); // Chuyển hướng đến trang Dashboard
      } else {
        setError("Không nhận được token từ server.");
      }
    } catch (err: any) {
      console.error("🔥 Lỗi đăng nhập:", err);
      setError(err.message || "Không thể kết nối đến server!");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <LoginBackground>
      <Overlay />
      <LoginCard>
        <Logo src={logoImage} alt="Logo" />
        <Title>Đăng nhập</Title>

        <Label>Tài khoản*</Label>
        <Input
          placeholder="Nhập tên tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <Label>Mật khẩu*</Label>
        <Input
          placeholder="Nhập mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

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

const LoginBackground = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw; /* Sử dụng 100vw để đảm bảo chiếm toàn bộ chiều rộng */
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Đảm bảo cố định trên toàn màn hình */
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2); /* Giảm độ mờ để hình nền rõ hơn */
  z-index: 0;
`;

const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 450px; /* Tăng nhẹ để cân đối */
  z-index: 1;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
`;

// const Logo = styled.img`
//   display: block;
//   margin: 0 auto;
//   max-width: 100px;
// `;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: rgba(0, 0, 0);
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
  color: rgba(0, 0, 0);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  width: 430px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Checkbox = styled.label`
  font-size: 14px;
  cursor: pointer;
  color: rgba(0, 0, 0);
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
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #007bff;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const FooterText = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0);
`;

const Link = styled.button`
  background: none;
  color: #2196f3;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
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
<<<<<<< HEAD
=======

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("📤 Gửi yêu cầu đăng nhập với:", { username, password });
      const data = await loginUser(username, password);
      console.log("📥 Response từ server:", data);
      
      if (data.access && data.refresh) {
        // Lưu token vào localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        navigate("/Dashboard"); // Chuyển hướng đến trang Dashboard
      } else {
        setError("Không nhận được token từ server.");
      }
    } catch (err: any) {
      console.error("🔥 Lỗi đăng nhập:", err);
      setError(err.message || "Không thể kết nối đến server!");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <LoginBackground>
      <Overlay />
      <LoginCard>
        {/* <Logo src={logoImage} alt="Logo" /> */}
        <Title>Đăng nhập</Title>

        <Label>Tài khoản*</Label>
        <Input
          placeholder="Nhập mã số sinh viên"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <Label>Mật khẩu*</Label>
        <Input
          placeholder="Nhập mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

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
>>>>>>> f32ef398ca03f0c4d9a267da1b6a6c0a803d9964

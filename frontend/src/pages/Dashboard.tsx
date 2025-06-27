import styled from "styled-components";
import GradeList from "../components/GradeList";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface User {
  username: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface MyJwtPayload {
  username: number;
  firstName: string;
  lastName: string;
  email: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fafcff;
`;

const FlexRight = styled.div`
  position: fixed;
  margin-top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  font-weight: 700;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  height: 50px;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;

const UserInfo = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  color: #000000;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log()
    if (token) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUser({
          username: decoded.username,
          firstname: decoded.firstName,
          lastname: decoded.lastName,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container>
      {user && (
        <UserInfo>
          Xin chào, {user.lastname} {user.firstname} <br />
          ({user.email})
        </UserInfo>
      )}

      <FlexRight>
        {user ? (
          <Button onClick={handleLogout}>Đăng xuất</Button>
        ) : (
          <>
            <Button onClick={() => navigate("/register")}>Đăng ký</Button>
            <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
          </>
        )}
      </FlexRight>

      <MainContent>
        <GradeList />
      </MainContent>
    </Container>
  );
}

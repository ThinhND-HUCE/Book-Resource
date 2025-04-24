import styled from "styled-components";
import CourseList from "../components/CourseList";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const FlexRight = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 20px;
  user-select: none;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Index() {
  const navigate = useNavigate();

  return (
    <Container>
      <FlexRight>
        <Button onClick={() => navigate("/register")}>Đăng ký</Button>
        <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
      </FlexRight>
      <MainContent>
        <CourseList />
      </MainContent>
    </Container>
  );
}

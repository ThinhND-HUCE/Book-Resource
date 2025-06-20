import React, { useEffect, useState } from "react";
import { Route, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

interface Course {
  id: string;
  course_name: string;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled(motion.div)`
  position: relative; 
  height: 150px;
  background: linear-gradient(135deg, #007bff, #250cc4);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; 
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #1976d2, #1b098f);
  }
`;

const Text = styled.div`
  font-size: 14pt;
  position: relative; 
  z-index: 1;
`;

const Title = styled.h1`
  position: absolute;
  top: 30px;
  width: 95%;
  text-align: center;
  color: #333;
  font-size: 2rem;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 50px 0;
`;

const ErrorText = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #dc3545;
  margin: 50px 0;
`;

const BackButton = styled.button`
  background-color: #007bff;
  color: white;
  width: 200px;
  margin-top: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #1976d2;
  }
  z-index: 3;
`;

const CoursePage: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [gradeName, setGradeName] = useState<string>("");

  useEffect(() => {
    if (gradeId) {
      loadCourses(gradeId);
      fetchGradeName(gradeId);
    }
  }, [gradeId]);

  const loadCourses = async (gradeId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/grades/${gradeId}/courses/`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách khóa học');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
      setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGradeName = async (gradeId: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/grades/");
      if (!response.ok) return;
      const data = await response.json();
      const found = data.find((g: any) => g.id === gradeId);
      if (found) setGradeName(found.grade_name);
      else setGradeName("");
    } catch {
      setGradeName("");
    }
  };

  const handleCourseSelect = (courseId: string) => {
    if (gradeId) {
      localStorage.setItem("last_grade_id", gradeId);
    }
    // Điều hướng đến trang chi tiết hoặc route phù hợp
    const routeName = courseId.replace(/_/g, "");
    navigate(`/${routeName}`);
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/Dashboard")}>← Quay lại chọn lớp</BackButton>
      <Title>{gradeName || "Chọn khóa học"}</Title>
      <MainContent>
        <Grid>
          {loading ? (
            <LoadingText>Đang tải danh sách khóa học...</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : (
            courses.map((course, i) => (
              <Card
                key={course.id}
                onClick={() => handleCourseSelect(course.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
              >
                <Text>{course.course_name}</Text>
              </Card>
            ))
          )}
        </Grid>
      </MainContent>
    </Container>
  );
};

export default CoursePage; 
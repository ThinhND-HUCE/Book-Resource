import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaBook, FaChartBar, FaCode, FaCogs, FaCalculator } from "react-icons/fa";
import { LuPickaxe } from "react-icons/lu";
import { PiShareNetworkFill } from "react-icons/pi";
import { PiMathOperationsFill } from "react-icons/pi";
import { TbAB } from "react-icons/tb";

interface Course {
  id: string;
  course_name: string;
}

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  margin: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  font-size: 100px; 
  opacity: 0.3; 
  color: #f1f0f5;
  pointer-events: none;
`;

const Text = styled.div`
  font-size: 14pt;
  position: relative; 
  z-index: 1;
`;

const courseIcons: { [key: string]: React.ReactNode } = {
  "Đại số hiện đại ứng dụng": <FaCalculator />,
  "Khai phá dữ liệu": <LuPickaxe />,
  "Toán rời rạc": <FaCogs />,
  "Học máy": <PiShareNetworkFill />,
  "Toán kinh tế": <FaCalculator />,
  "Phương pháp số": <PiMathOperationsFill />,
  "Nguyên lý ngôn ngữ lập trình": <FaCode />,
  "Xác suất và thống kê": <FaChartBar />,
  "Bài tập Đại số tuyến tính": <FaBook />,
};

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách khóa học:", err));
  }, []);

  const handleCoursePress = (courseId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem nội dung khóa học");
      navigate("/login");
      return;
    }

    const routeName = courseId.replace(/_/g, "");
    navigate(`/${routeName}`);
  };

  return (
    <Container>
      <Grid>
        {courses.map((course, i) => (
          <Card
            key={course.id}
            onClick={() => handleCoursePress(course.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
          >
            <IconWrapper>{courseIcons[course.course_name] || <FaBook />}</IconWrapper>
            <Text>{course.course_name}</Text>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseList;

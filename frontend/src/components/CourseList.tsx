import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  height: 100px;
  padding: 10px;
  background-color: #2196f3;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    background-color: #1976d2;
    transform: scale(1.03);
  }
`;

const CardText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then((response) => response.json())
      .then((data: Course[]) => setCourses(data))
      .catch((error) => console.error("Lỗi khi lấy danh sách khóa học:", error));
  }, []);

  const handleCoursePress = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <Container>
      <Grid>
        {courses.map((course) => (
          <Card key={course.id} onClick={() => handleCoursePress(course.id)}>
            <CardText>{course.course_name}</CardText>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseList;

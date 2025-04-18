import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  course_name: string;
}

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

  const styles = {
    container: {
      padding: "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)", // 5 cột mỗi dòng
      gap: "20px",
    },
    card: {
      height: "100px",
      padding: "10px",
      backgroundColor: "#2196f3",
      color: "white",
      borderWidth: 0,
      borderRadius: "10px",
      cursor: "pointer",
      textAlign: "center" as "center", // Sử dụng giá trị hợp lệ cho textAlign
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardText: {
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={styles.card}
            onClick={() => handleCoursePress(course.id)}
          >
            <span style={styles.cardText}>{course.course_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;

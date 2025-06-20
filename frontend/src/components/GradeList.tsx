import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

interface Grade {
  id: string;
  grade_name: string;
}

interface Course {
  id: string;
  course_name: string;
}

interface CourseDetail {
  id: string;
  title: string;
  content: string;
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

const Text = styled.div`
  font-size: 14pt;
  position: relative; 
  z-index: 1;
`;

const BackButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;

  &:hover {
    background-color: #1976d2;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
`;

const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

const CourseList: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetail[]>([]);
  const [currentStep, setCurrentStep] = useState<'grades' | 'courses' | 'details'>('grades');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch("http://localhost:8000/api/grades/");
      if (!response.ok) {
        throw new Error('Không thể tải danh sách lớp');
      }
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp:", error);
      setError('Không thể tải danh sách lớp. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSelect = (gradeId: string) => {
    navigate(`/courses/${gradeId}`);
  };

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourse(courseId);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem nội dung khóa học");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${courseId}/`);
      if (!response.ok) {
        throw new Error('Không thể tải chi tiết khóa học');
      }
      const data = await response.json();
      setCourseDetails([{
        id: data.id,
        title: data.course_name,
        content: JSON.stringify(data.content, null, 2)
      }]);
      setCurrentStep('details');
    } catch (error) {
      console.error("Lỗi khi tải chi tiết khóa học:", error);
      // Fallback: navigate to existing route
      const routeName = courseId.replace(/_/g, "");
      navigate(`/${routeName}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'courses') {
      setCurrentStep('grades');
      setSelectedGrade('');
      setCourses([]);
      setError('');
    } else if (currentStep === 'details') {
      setCurrentStep('courses');
      setSelectedCourse('');
      setCourseDetails([]);
      setError('');
    }
  };

  const renderGrades = () => (
    <>
      {loading ? (
        <LoadingText>Đang tải danh sách lớp...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <Grid>
          {grades.map((grade, i) => (
            <Card
              key={grade.id}
              onClick={() => handleGradeSelect(grade.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
            >
              <Text>{grade.grade_name}</Text>
            </Card>
          ))}
        </Grid>
      )}
    </>
  );

  const renderCourses = () => (
    <>
      <BackButton onClick={handleBack}>← Quay lại lớp</BackButton>
      <Title>{grades.find(g => g.id === selectedGrade)?.grade_name}</Title>
      {loading ? (
        <LoadingText>Đang tải danh sách khóa học...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <Grid>
          {courses.map((course, i) => (
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
          ))}
        </Grid>
      )}
    </>
  );

  const renderDetails = () => (
    <>
      <BackButton onClick={handleBack}>← Quay lại khóa học</BackButton>
      <Title>Chi tiết khóa học - {courses.find(c => c.id === selectedCourse)?.course_name}</Title>
      {loading ? (
        <LoadingText>Đang tải nội dung khóa học...</LoadingText>
      ) : (
        <DetailContainer>
          {courseDetails.length > 0 ? (
            courseDetails.map((detail, index) => (
              <div key={index}>
                <h3>{detail.title}</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {detail.content}
                </pre>
              </div>
            ))
          ) : (
            <p>Không có nội dung để hiển thị.</p>
          )}
        </DetailContainer>
      )}
    </>
  );

  return (
    <Container>
      {currentStep === 'grades' && renderGrades()}
      {currentStep === 'courses' && renderCourses()}
      {currentStep === 'details' && renderDetails()}
    </Container>
  );
};

export default CourseList;

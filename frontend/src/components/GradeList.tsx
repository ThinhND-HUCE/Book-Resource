import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { API_URL } from "../constants/apiConfig";
interface Grade {
  id: string;
  grade_name: string;
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

const GradeList: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/grades/`, {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("access_token")
        }
      });
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

  return (
    <Container>
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
    </Container>
  );
};

export default GradeList;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchExerciseQuestion, submitExerciseAnswer, ExerciseQuestion } from '../api/xacSuatCoDienApi';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const ExerciseContainer = styled.div`
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.div`
    font-size: 18px;
    margin-bottom: 20px;
    line-height: 1.5;
    color: #000;
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
    background-color: #fff;
`;

const Label = styled.label`
    display: inline-block;
    margin-bottom: 5px;
    background-color: #fff;
    color: #000;
    margin-right: 20px;
`;

const Input = styled.input`
    width: 10%;
    padding: 8px;
    border: 1px solid #000;
    border-radius: 4px;
    font-size: 16px;
    background-color: #fff;
    color: #000;

    /* Remove spinners */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`;

const SubmitButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    height: 40px;

    &:hover {
        background-color: #1976d2;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        &:hover {
            background-color: #cccccc;
        }
    }
`;

const ResultContainer = styled.div`
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
    background-color: #f5f5f5;
    color: #000;
`;

const AnswerDetail = styled.div`
    margin: 10px 0;
    padding: 10px;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #ddd;
`;

const CorrectAnswer = styled.span`
    color: #4caf50;
    font-weight: bold;
`;

const WrongAnswer = styled.span`
    color: #f44336;
    font-weight: bold;
`;

const NewQuestionButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    height: 40px;
    &:hover {
        background-color: #1976d2;
    }
`;

const BackButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;

    &:hover {
        background-color: #1976d2;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

const Hint = styled.span`
    font-size: 14px;
    color: #666;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.hint {
        opacity: 1;
    }
`;

const PopupOverlay = styled.div`
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

const PopupContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    color: #000;
    width: 90%;
`;

const TimerDisplay = styled.div<{ isWarning?: boolean }>`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.isWarning ? '#f44336' : '#2196f3'};
    margin-bottom: 20px;
    transition: color 0.3s ease;
`;

interface ExerciseAnswer {
    m: string;
    t: string;
    p: string;
}

interface ExerciseProps {
    onBack: () => void;
    timeLimit?: number; // Time limit in seconds, default to 300 (5 minutes)
}

const XacSuatCoDien: React.FC<ExerciseProps> = ({ onBack, timeLimit = 300 }) => {
    const [question, setQuestion] = useState<ExerciseQuestion | null>(null);
    const [answer, setAnswer] = useState<ExerciseAnswer>({ m: '', t: '', p: '' });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hintVisible, setHintVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);

    useEffect(() => {
        loadQuestion();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !result) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !result) {
            // Tự động điền 0 cho các ô còn trống
            setAnswer(prev => ({
                m: prev.m === '' ? '0' : prev.m,
                t: prev.t === '' ? '0' : prev.t,
                p: prev.p === '' ? '0' : prev.p
            }));
            setShowTimeoutPopup(true);
        }
    }, [timeLeft, result]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const loadQuestion = async () => {
        try {
            // Reset all states first
            setAnswer({ m: '', t: '', p: '' });
            setResult(null);
            setLoading(false);
            setHintVisible(false);
            setTimeLeft(timeLimit);
            setShowTimeoutPopup(false);
            
            // Then load new question
            setLoading(true);
            const newQuestion = await fetchExerciseQuestion();
            setQuestion(newQuestion);
            setLoading(false);
        } catch (error) {
            console.error('Error loading question:', error);
            setLoading(false);
        }
    };

    const convertFractionToDecimal = (value: string): number => {
        if (value.includes('/')) {
            const [numerator, denominator] = value.split('/').map(Number);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                return numerator / denominator;
            }
        }
        return parseFloat(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;

        // Validate that all fields are filled
        if (answer.m === '' || answer.t === '' || answer.p === '') {
            alert('Vui lòng điền đầy đủ các giá trị');
            return;
        }

        setLoading(true);
        try {
            const response = await submitExerciseAnswer(
                {
                    m: convertFractionToDecimal(answer.m),
                    t: convertFractionToDecimal(answer.t),
                    p: convertFractionToDecimal(answer.p)
                },
                question
            );
            setResult(response);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || !isNaN(parseFloat(value)) || value.includes('/')) {
            setAnswer(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (!question) {
        return <div>Loading...</div>;
    }

    return (
        <ExerciseContainer>
            <BackButton onClick={onBack}>← Quay lại</BackButton>
            <TimerDisplay isWarning={timeLeft < 60}>
                Thời gian còn lại: {formatTime(timeLeft)}
            </TimerDisplay>
            <QuestionText>
                {question.content}
                <p><i>Lời giải:</i></p>
            </QuestionText>

            <form onSubmit={handleSubmit}>
                <InputGroup>
                    <Label>Phép thử: Rút ngẫu nhiên {question.k3} bi. Số trường hợp có thể của phép thử: </Label>
                    <Input
                        type="text"
                        name="m"
                        value={answer.m}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Biến cố <InlineMath math="A"></InlineMath> = {'{'}rút được {question.k4} bi đỏ {'('} và {question.k3 - question.k4} bi xanh{')'}{'}'}. <br />Áp dụng quy tắc nhân và quy tắc tổ hợp, số trường hợp thuận lợi cho <InlineMath math="A"></InlineMath> là:
                    </Label>
                    <Input
                        type="text"
                        name="t"
                        value={answer.t}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </InputGroup>
                <InputGroup>
                    <Label>Suy ra <InlineMath math="P\!\left(A\right)"></InlineMath> là:</Label>
                    <Input
                        type="text"
                        name="p"
                        value={answer.p}
                        onChange={handleInputChange}
                        step="0.0001"
                        required
                        onFocus={() => setHintVisible(true)}
                        onBlur={() => setHintVisible(false)}
                        autoComplete="off"
                    />
                    <Hint className={hintVisible ? 'hint' : ''}>(Làm tròn đến 4 chữ số có nghĩa)</Hint>
                </InputGroup>

                <ButtonContainer>
                    <SubmitButton
                        type="submit"
                        disabled={loading || result !== null}
                    >
                        {loading ? 'Đang kiểm tra...' : 'Kiểm tra'}
                    </SubmitButton>
                    {result && (
                        <NewQuestionButton onClick={loadQuestion}>
                            Làm bài mới
                        </NewQuestionButton>
                    )}
                </ButtonContainer>
            </form>

            {result && (
                <ResultContainer>
                    <h3>Kết quả:</h3>
                    <p>Ý thứ 1: {result.scores.m_score}/{result.frame_scores.m_score}</p>
                    <p>Ý thứ 2: {result.scores.t_score}/{result.frame_scores.t_score}</p>
                    <p>Ý thứ 3: {result.scores.p_score}/{result.frame_scores.p_score}</p>
                    <p>Tổng điểm: {result.scores.total_score}/{result.frame_scores_total}
                        {result.frame_scores_total !== 10 && ` (${((result.scores.total_score / result.frame_scores_total) * 10).toFixed(1)}/10)`}
                    </p>

                    <AnswerDetail>
                        <h4>Chi tiết đáp án:</h4>
                        <p>
                            Ý thứ 1 (Tổng số cách chọn):{' '}
                            {result.scores.m_score === result.frame_scores.m_score ? (
                                <CorrectAnswer>✓ {answer.m}</CorrectAnswer>
                            ) : (
                                <>
                                    <WrongAnswer>✗ {answer.m}</WrongAnswer>
                                    {' → '}
                                    <CorrectAnswer>Đáp án đúng: {result.correct_answers.m}</CorrectAnswer>
                                </>
                            )}
                        </p>
                        <p>
                            Ý thứ 2 (Số cách chọn thỏa mãn):{' '}
                            {result.scores.t_score === result.frame_scores.t_score ? (
                                <CorrectAnswer>✓ {answer.t}</CorrectAnswer>
                            ) : (
                                <>
                                    <WrongAnswer>✗ {answer.t}</WrongAnswer>
                                    {' → '}
                                    <CorrectAnswer>Đáp án đúng: {result.correct_answers.t}</CorrectAnswer>
                                </>
                            )}
                        </p>
                        <p>
                            Ý thứ 3 (Xác suất):{' '}
                            {result.scores.p_score === result.frame_scores.p_score ? (
                                <CorrectAnswer>✓ {answer.p}</CorrectAnswer>
                            ) : (
                                <>
                                    <WrongAnswer>✗ {answer.p}</WrongAnswer>
                                    {' → '}
                                    <CorrectAnswer>Đáp án đúng: {result.correct_answers.p}</CorrectAnswer>
                                </>
                            )}
                        </p>
                    </AnswerDetail>

                    {result.success ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>Chúc mừng! Bạn đã hoàn thành bài tập.</p>
                    ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Hãy thử lại!</p>
                    )}
                </ResultContainer>
            )}

            {showTimeoutPopup && (
                <PopupOverlay>
                    <PopupContent>
                        <h2>Hết thời gian!</h2>
                        <p>Thời gian làm bài của bạn đã hết.</p>
                        <SubmitButton
                            onClick={async () => {
                                if (!question) return;
                                setLoading(true);
                                try {
                                    const response = await submitExerciseAnswer(
                                        {
                                            m: convertFractionToDecimal(answer.m),
                                            t: convertFractionToDecimal(answer.t),
                                            p: convertFractionToDecimal(answer.p)
                                        },
                                        question
                                    );
                                    setResult(response);
                                    setShowTimeoutPopup(false);
                                } catch (error) {
                                    console.error('Error submitting answer:', error);
                                }
                                setLoading(false);
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Đang kiểm tra...' : 'Kiểm tra'}
                        </SubmitButton>
                    </PopupContent>
                </PopupOverlay>
            )}
        </ExerciseContainer>
    );
};

export default XacSuatCoDien; 
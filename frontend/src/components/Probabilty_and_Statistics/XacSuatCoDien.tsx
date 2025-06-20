import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchExerciseQuestion, submitExerciseAnswer, ExerciseQuestion } from '../../constants/xacSuatCoDienService';
import MathJaxRender from '../MathJaxRender'; 

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

const ResultTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: white;
    font-size: 16px;
`;

const TableHeader = styled.th`
    padding: 12px;
    border: 1px solid #666;
    background-color: #f5f5f5;
    text-align: center;
    font-weight: bold;
`;

const TableCell = styled.td`
    padding: 12px;
    border: 1px solid #666;
    text-align: center;
`;

const ContentCell = styled(TableCell)`
    text-align: left;
`;

const TableRow = styled.tr`
    &:last-child {
        background-color: #f5f5f5;
        font-weight: bold;
    }
`;

const TotalCell = styled(TableCell)`
    text-align: right;
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

const ScoreCell = styled(TableCell)<{ score?: number }>`
    color: ${props => {
        if (props.score === undefined) return 'inherit';
        if (props.score < 4) return '#ff0000';
        if (props.score <= 5.5) return '#ffa500';
        return '#008000';
    }};
    font-weight: bold;
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

    //Tự độngg điền đáp án khi hết thời gian
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
    
    //Cấu hình thời gian
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    //Cấu hình khi làm mới
    const loadQuestion = async () => {
        try {
            // Đặt lại giá trị cho tất cả biển
            setAnswer({ m: '', t: '', p: '' }); // biến câu trả lời
            setResult(null); // biến kết quả
            setLoading(false); // biến loading
            setHintVisible(false); // biến gợi ý
            setTimeLeft(timeLimit); // biến thời gian
            setShowTimeoutPopup(false); // thông báo hết thời gian
            
            // Gọi lại hàm để tạo câu hỏi mới
            setLoading(true);
            const newQuestion = await fetchExerciseQuestion();
            setQuestion(newQuestion);
            setLoading(false);
        } catch (error) {
            console.error('Error loading question:', error);
            setLoading(false);
        }
    };

    //Cấu hình để nhận giá trị 2/3 thành dạng float
    const convertFractionToDecimal = (value: string): number => {
        if (value.includes('/')) {
            const [numerator, denominator] = value.split('/').map(Number);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                return numerator / denominator;
            }
        }
        return parseFloat(value);
    };

    //Hàm xử lý khi nhấn vào nút submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;

        // Bắt buộc tất cả các input đều phải có giá tri
        if (answer.m === '' || answer.t === '' || answer.p === '') {
            alert('Vui lòng điền đầy đủ các giá trị');
            return;
        }

        setLoading(true);

        // Hàm POST lên API
        try {
            const response = await submitExerciseAnswer(
                {
                    m: convertFractionToDecimal(answer.m),
                    t: convertFractionToDecimal(answer.t),
                    p: convertFractionToDecimal(answer.p),
                    question_code: question.question_code
                }
            );
            setResult(response);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
        setLoading(false);
    };

    //Hàm lấy giá trị từ ô input
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
            {/* Khung hiển thị thời gian */}
            <TimerDisplay isWarning={timeLeft < 60}>
                Thời gian còn lại: {formatTime(timeLeft)}
            </TimerDisplay>
            {/* Khung câu hỏi */}
            <QuestionText>
                {question.content}
                <p><i>Lời giải:</i></p>
            </QuestionText>

            {/* Khung lời giải */}
            <form onSubmit={handleSubmit}>
                {/* Ý 1 */}
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

                {/* Ý 2 */}
                <InputGroup>
                    <Label>
                        <MathJaxRender latex={`Biến cố \\(A\\) = {rút được ${question.k4} bi đỏ và ${question.k3 - question.k4} bi xanh}. Áp dụng quy tắc tổ hợp, số trường hợp thuận lợi cho \\(A\\) là:`}></MathJaxRender>
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

                {/* Ý 3 */}
                <InputGroup>
                    <Label>
                        <MathJaxRender latex={`Suy ra xác suất \\(P(A)\\) là:`}></MathJaxRender>
                    </Label>
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

                {/* Khung hiển thị nút kiểm tra và làm mới */}
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

            {/* Khung hiển thị kết quả sau khi POST */}
            {result && (
                <ResultContainer>
                    <h3>Kết quả:</h3>
                    {/* Bảng */}
                    <ResultTable>
                        {/* Hàng 1 */}
                        <thead>
                            <tr>
                                <TableHeader>Ý</TableHeader>
                                <TableHeader>Nội dung</TableHeader>
                                <TableHeader>Đúng/Sai</TableHeader>
                                <TableHeader>Đáp án đúng</TableHeader>
                                <TableHeader>Điểm</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hàng 2 */}
                            <tr>
                                <TableCell>Ý thứ 1</TableCell>
                                <ContentCell>Tổng số cách chọn</ContentCell>
                                <TableCell>
                                    {result.scores.m_score === result.frame_scores.m_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.m}</TableCell>
                                <TableCell>{result.scores.m_score} / {result.frame_scores.m_score}</TableCell>
                            </tr>

                            {/* Hàng 3 */}
                            <tr>
                                <TableCell>Ý thứ 2</TableCell>
                                <ContentCell>Số cách chọn thỏa mãn</ContentCell>
                                <TableCell>
                                    {result.scores.t_score === result.frame_scores.t_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.t}</TableCell>
                                <TableCell>{result.scores.t_score} / {result.frame_scores.t_score}</TableCell>
                            </tr>

                            {/* Hàng 4*/}
                            <tr>
                                <TableCell>Ý thứ 3</TableCell>
                                <ContentCell>Xác suất</ContentCell>
                                <TableCell>
                                    {result.scores.p_score === result.frame_scores.p_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p}</TableCell>
                                <TableCell>{result.scores.p_score} / {result.frame_scores.p_score}</TableCell>
                            </tr>

                            {/* Hàng cuối*/}
                            <TableRow>
                                <TotalCell colSpan={4}>Tổng điểm:</TotalCell>
                                <ScoreCell score={result.frame_scores_total !== 10 ? 
                                    Number(((result.scores.total_score / result.frame_scores_total) * 10).toFixed(1)) : 
                                    undefined
                                }>
                                    {`${result.scores.total_score} / ${result.frame_scores_total}${result.frame_scores_total !== 10 ? ` (${((result.scores.total_score / result.frame_scores_total) * 10).toFixed(1)} / 10)` : ''}`}
                                </ScoreCell>
                            </TableRow>
                        </tbody>
                    </ResultTable>

                    {/* Thông báo hoàn thành bài làm */}
                    {result.success ? (
                        <p style={{ color: 'green', fontWeight: 'bold', marginTop: '20px' }}>Chúc mừng! Bạn đã hoàn thành bài tập.</p>
                    ) : (
                        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>Hãy thử lại!</p>
                    )}
                </ResultContainer>
            )}

            {/* Pop up hiển thị sau khi hết thời gian */}
            {showTimeoutPopup && (
                <PopupOverlay>
                    <PopupContent>
                        <h2>Hết thời gian!</h2>
                        <p>Thời gian làm bài của bạn đã hết.</p>
                        <SubmitButton
                            onClick={async () => {
                                if (!question) return;
                                setLoading(true);
                                // Hàm POST lên API
                                try {
                                    const response = await submitExerciseAnswer(
                                        {
                                            m: convertFractionToDecimal(answer.m),
                                            t: convertFractionToDecimal(answer.t),
                                            p: convertFractionToDecimal(answer.p),
                                            question_code: question.question_code
                                        }
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
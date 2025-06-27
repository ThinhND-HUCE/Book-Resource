import React, { useState, useEffect } from 'react';
import { fetchExerciseQuestion, submitExerciseAnswer, ExerciseQuestionCongNhanXacSuat } from '../../constants/Probability_and_Statistics/congNhanXacSuatService';
import MathJaxRender from '../MathJaxRender'; 
import {BackButton,ButtonContainer,ContentCell,CorrectAnswer,ExerciseContainer,Hint,Input,InputGroup,Label,NewQuestionButton,PopupContent,PopupOverlay,QuestionText,ResultContainer,ResultTable,ScoreCell,SubmitButton,TableCell,TableHeader,TableRow,TimerDisplay,TotalCell,WrongAnswer} from '../InterFaceDynamic';


interface ExerciseAnswer {
    p1: string;
    p2: string;
    p3: string;
    pa: string;
    pb: string;
}

interface ExerciseProps {
    onBack: () => void;
    timeLimit?: number; // Time limit in seconds, default to 300 (5 minutes)
}

const XacSuatCoDien: React.FC<ExerciseProps> = ({ onBack, timeLimit = 300 }) => {
    const [question, setQuestion] = useState<ExerciseQuestionCongNhanXacSuat | null>(null);
    const [answer, setAnswer] = useState<ExerciseAnswer>({ p1: '', p2: '', p3: '',pa:'',pb:'' });
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
                p1: prev.p1 === '' ? '0' : prev.p1,
                p2: prev.p2 === '' ? '0' : prev.p2,
                p3: prev.p3 === '' ? '0' : prev.p3,
                pa: prev.pa === '' ? '0' : prev.pa,
                pb: prev.pb === '' ? '0' : prev.pb,
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
            setAnswer({ p1: '', p2: '', p3: '', pa: '', pb : '' }); // biến câu trả lời
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
        if (answer.p1 === '' || answer.p2 === '' || answer.p3 === '' || answer.pa === '' || answer.pb === '') {
            alert('Vui lòng điền đầy đủ các giá trị');
            return;
        }

        setLoading(true);

        // Hàm POST lên API
        try {
            const response = await submitExerciseAnswer(
                {
                    p1: convertFractionToDecimal(answer.p1),
                    p2: convertFractionToDecimal(answer.p2),
                    p3: convertFractionToDecimal(answer.p3),
                    pa: convertFractionToDecimal(answer.pa),
                    pb: convertFractionToDecimal(answer.pb),
                    question_code: question.question_code,
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
                    <MathJaxRender latex='Đặt \(A_i\) là biến cố người thứ \(i\) ném bóng lọt rổ, \(i = 1, 2, 3\). Các biến cố này độc lập và \(P\left(A_1\right) ='></MathJaxRender>
                    <Input
                        type="text"
                        name="p1"
                        value={answer.p1}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <MathJaxRender latex='\(P\left(A_2\right) ='></MathJaxRender>
                    <Input
                        type="text"
                        name="p2"
                        value={answer.p2}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <MathJaxRender latex='\(P\left(A_3\right) ='></MathJaxRender>
                    <Input
                        type="text"
                        name="p3"
                        value={answer.p3}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </InputGroup>

                {/* Ý 2 */}
                <InputGroup>
                    <Label>
                        <MathJaxRender latex='ý a, Xét \(A\) là biến cố cả ba người đều ném không lọt qua rổ. Ta có '></MathJaxRender>
                        <MathJaxRender latex='\[A = \overline A_1 \overline A_2 \overline A_3 .\]'></MathJaxRender>
                        <MathJaxRender latex='Khi đó
                        \[P\left(A\right) = P\left(\overline A_1\right) \times P\left(\overline A_2\right) \times P\left(\overline A_3\right) =\]'></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="pa"
                        value={answer.pa}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </InputGroup>

                {/* Ý 3 */}
                <InputGroup>
                    <Label>
                        <MathJaxRender latex='ý b, Xét \(B\) là biến cố chỉ có một người ném lọt qua rổ. Ta có \[
                        B = A_1 \overline A_2 \overline A_3 + \overline A_1 A_2 \overline A_3 + \overline A_1 \overline A_2 A_3\].Khi đó'></MathJaxRender>
                        <MathJaxRender latex='\begin{align}
                    P\left(B\right) & = P\left(A_1 \overline A_2 \overline A_3\right) + P\left(\overline A_1 A_2 \overline A_3\right) + P\left(\overline A_1 \overline A_2 A_3\right) \\
                    & =   \end{align}'></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="pb"
                        value={answer.pb}
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
                                <ContentCell><MathJaxRender latex='(P\left(A_1\right) ='></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p1 === result.frame_scores.pn_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p1}</TableCell>
                                <TableCell>{result.scores.p1_score} / {result.frame_scores.p1_score}</TableCell>
                            </tr>

                            {/* Hàng 3 */}
                            <tr>
                                <TableCell><MathJaxRender latex='\(P\left(A_2\right)'></MathJaxRender></TableCell>
                                <TableCell>
                                    {result.scores.p2 === result.frame_scores.p_n ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p2}</TableCell>
                                <TableCell>{result.scores.p2_score} / {result.frame_scores.p_n}</TableCell>
                            </tr>

                            {/* Hàng 4*/}
                            <tr>
                                <TableCell>Ý thứ 3</TableCell>
                                <ContentCell><MathJaxRender latex='\(P\left(A_3\right)'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p3_score === result.frame_scores.p_n ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p}</TableCell>
                                <TableCell>{result.scores.p3_score} / {result.frame_scores.p_n}</TableCell>
                            </tr>

                            <tr>
                                <TableCell>Ý pa</TableCell>
                                <ContentCell><MathJaxRender latex='\(\[
P\left(A\right) = P\left(\overline A_1\right) \times P\left(\overline A_2\right) \times P\left(\overline A_3\right) ='></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.pa_score === result.frame_scores.pa ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.pa_score}</TableCell>
                                <TableCell>{result.scores.pa_score} / {result.frame_scores.pa}</TableCell>
                            </tr>

                            <tr>
                                <TableCell>Ý pb</TableCell>
                                <ContentCell><MathJaxRender latex='\begin{align*}
P\left(B\right) & = P\left(A_1 \overline A_2 \overline A_3\right) + P\left(\overline A_1 A_2 \overline A_3\right) + P\left(\overline A_1 \overline A_2 A_3\right) \\
& = . 
\end{align*}'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.pb_score === result.frame_scores.pb ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p}</TableCell>
                                <TableCell>{result.scores.pb_score} / {result.frame_scores.pb}</TableCell>
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
                                            p1: convertFractionToDecimal(answer.p1),
                                            p2: convertFractionToDecimal(answer.p2),
                                            p3: convertFractionToDecimal(answer.p3),
                                            pa: convertFractionToDecimal(answer.pa),
                                            pb: convertFractionToDecimal(answer.pb),
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
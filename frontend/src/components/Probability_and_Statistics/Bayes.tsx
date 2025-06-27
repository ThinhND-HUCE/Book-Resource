import React, { useState, useEffect } from 'react';
import { fetchExerciseQuestion, submitExerciseAnswer, ExerciseQuestionBayes} from '../../constants/Probability_and_Statistics/bayesService';
import MathJaxRender from '../MathJaxRender'; 
import {BackButton,ButtonContainer,ContentCell,CorrectAnswer,ExerciseContainer,Hint,Input,InputGroup,Label,NewQuestionButton,PopupContent,PopupOverlay,QuestionText,ResultContainer,ResultTable,ScoreCell,SubmitButton,TableCell,TableHeader,TableRow,TimerDisplay,TotalCell,WrongAnswer} from '../InterFaceDynamic';


interface ExerciseAnswer {
    p_1: string;
    p_2: string;
    p_dk1: string;
    p_dk2: string;
    p: string;
    p_bayes: string;
}

interface ExerciseProps {
    onBack: () => void;
    timeLimit?: number; // Time limit in seconds, default to 300 (5 minutes)
}

const XacSuatCoDien: React.FC<ExerciseProps> = ({ onBack, timeLimit = 300 }) => {
    const [question, setQuestion] = useState<ExerciseQuestionBayes | null>(null);
    const [answer, setAnswer] = useState<ExerciseAnswer>({ p_1: '', p_2: '', p_dk1: '',p_dk2:'',p:'', p_bayes: '' });
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
                p_1: prev.p_1 === '' ? '0' : prev.p_1,
                p_2: prev.p_2 === '' ? '0' : prev.p_2,
                p_dk1: prev.p_dk1 === '' ? '0' : prev.p_dk1,
                p_dk2: prev.p_dk2 === '' ? '0' : prev.p_dk2,
                p: prev.p === '' ? '0' : prev.p,
                p_bayes: prev.p_bayes === '' ? '0' : prev.p_bayes
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
            setAnswer({ p_1: '', p_2: '', p_dk1: '', p_dk2: '', p : '' ,p_bayes:''}); // biến câu trả lời
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
        if (answer.p_1 === '' || answer.p_2 === '' || answer.p_dk1 === '' || answer.p_dk2 === '' || answer.p === '' || answer.p_bayes === '') {
            alert('Vui lòng điền đầy đủ các giá trị');
            return;
        }

        setLoading(true);

        // Hàm POST lên API
        try {
            const response = await submitExerciseAnswer(
                {
                    p_1: convertFractionToDecimal(answer.p_1),
                    p_2: convertFractionToDecimal(answer.p_2),
                    p_dk1: convertFractionToDecimal(answer.p_dk1),
                    p_dk2: convertFractionToDecimal(answer.p_dk2),
                    p: convertFractionToDecimal(answer.p),
                    p_bayes: convertFractionToDecimal(answer.p_bayes),
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
                    <Label>
                    <MathJaxRender latex='Ta cần tính \(P\left(\text{thẻ lấy được thuộc hộp B} \mid \text{thẻ lấy được có màu đỏ}\right)\). 
Trước hết ta cần tính \(P\left(\text{thẻ lấy đuọc có màu đỏ}\right)\). Rõ ràng xác suất này phụ thuộc vào việc trước đó ta lấy được hộp nào.'></MathJaxRender>
                    <MathJaxRender latex='Xét hệ biến cố đầy đủ'></MathJaxRender>
                    <MathJaxRender latex='\(H_1 = \) \{lấy được hộp A\}, \(H_2 = \) \{lấy được hộp B\}'></MathJaxRender>
                    <MathJaxRender latex='Dễ thấy \(P\left( H_1 \right) ='></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="p_1"
                        value={answer.p_1}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <Label>
                    <MathJaxRender latex='\(P\left(H_2\right) =  \)'></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="p_2"
                        value={answer.p_2}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <Label>
                    <MathJaxRender latex='Đặt \(A\) là biến cố thẻ lấy được có màu đỏ, thì'></MathJaxRender>
                    <MathJaxRender latex='\[P\left(A \mid H_1\right)\] = '></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="p_dk1"
                        value={answer.p_dk1}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <Label>
                    <MathJaxRender latex=' \[(P\left(H_2\right) =\]'></MathJaxRender>
                    </Label>
                    <Input
                        type="text"
                        name="p_dk2"
                        value={answer.p_dk2}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                    <Label>
                    <MathJaxRender latex='Khi đó \(P\left(A\right) = P\left(H_1\right) P\left(A \mid H_1\right) + P\left(H_2\right) P\left(A \mid H_2\right) ='></MathJaxRender>
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
                    <Label>
                    <MathJaxRender latex='Theo lập luận trên, ta cần tính
\[
P\left(H_2\mid A\right) = \frac{P\left(H_2\right) P\left(A \mid H_2\right)}{P\left(A\right)} =\]'></MathJaxRender>
                    </Label>
                </InputGroup>
                <Input
                        type="text"
                        name="p_bayes"
                        value={answer.p_bayes}
                        onChange={handleInputChange}
                        step="0.0001"
                        required
                        onFocus={() => setHintVisible(true)}
                        onBlur={() => setHintVisible(false)}
                        autoComplete="off"
                    />
                    <Hint className={hintVisible ? 'hint' : ''}>(Làm tròn đến 4 chữ số có nghĩa)</Hint>

                
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
                                <ContentCell><MathJaxRender latex='\(P\left( H_1 \right) = \fbox{\(\dfrac{1}{2}= p_1\)}\)'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p1 === result.frame_scores.p1_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p1}</TableCell>
                                <TableCell>{result.scores.p_1_score} / {result.frame_scores.p_1_score}</TableCell>
                            </tr>

                            {/* Hàng 3 */}
                            <tr>
                                <TableCell><MathJaxRender latex='\(P\left(H_2\right) = \fbox{\(\dfrac{1}{2}= p_2\)} \)'></MathJaxRender></TableCell>
                                <TableCell>
                                    {result.scores.p_2 === result.frame_scores.p2_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p_2}</TableCell>
                                <TableCell>{result.scores.p2_score} / {result.frame_scores.p2_score}</TableCell>
                            </tr>

                            {/* Hàng 4*/}
                            <tr>
                                <TableCell>Ý thứ 3</TableCell>
                                <ContentCell><MathJaxRender latex='P\left(A \mid H_1\right) = \fbox{\(\dfrac{k_2}{k_1 + k_2}'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p_dk1_score === result.frame_scores.p_dk1_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p}</TableCell>
                                <TableCell>{result.scores.p_dk1_score} / {result.frame_scores.p_dk1_score}</TableCell>
                            </tr>

                            <tr>
                                <TableCell>Ý p_dk2</TableCell>
                                <ContentCell><MathJaxRender latex='P\left(A \mid H_2\right) = \fbox{\(\dfrac{k_4}{k_3 + k_4} \)}'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p_dk2_score === result.frame_scores.p_dk2_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p_dk2_score}</TableCell>
                                <TableCell>{result.scores.p_dk2_score} / {result.frame_scores.p_dk2_score}</TableCell>
                            </tr>

                            <tr>
                                <TableCell>Ý p</TableCell>
                                <ContentCell><MathJaxRender latex='\(P\left(A\right) = P\left(H_1\right) P\left(A \mid H_1\right) + P\left(H_2\right) P\left(A \mid H_2\right) = \fbox{\(p = \dfrac{1}{2} \times \dfrac{k_2}{k_1 + k_2} + \dfrac{1}{2} \times \dfrac{k_4}{k_3 + k_4}\)}\)'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p_score === result.frame_scores.p_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p}</TableCell>
                                <TableCell>{result.scores.p_score} / {result.frame_scores.p_score}</TableCell>
                            </tr>
                            <tr>
                                <TableCell>Ý p_bayes</TableCell>
                                <ContentCell><MathJaxRender latex='\[
P\left(H_2\mid A\right) = \frac{P\left(H_2\right) P\left(A \mid H_2\right)}{P\left(A\right)} = \].'></MathJaxRender></ContentCell>
                                <TableCell>
                                    {result.scores.p_bayes_score === result.frame_scores.p_bayes_score ? 
                                        <CorrectAnswer>✓</CorrectAnswer> : 
                                        <WrongAnswer>✗</WrongAnswer>}
                                </TableCell>
                                <TableCell>{result.correct_answers.p_bayes_score}</TableCell>
                                <TableCell>{result.scores.p_bayes_score} / {result.frame_scores.p_bayes_score}</TableCell>
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
                                            p_1: convertFractionToDecimal(answer.p_1),
                                            p_2: convertFractionToDecimal(answer.p_2),
                                            p_dk1: convertFractionToDecimal(answer.p_dk1),
                                            p_dk2: convertFractionToDecimal(answer.p_dk2),
                                            p: convertFractionToDecimal(answer.p),
                                            p_bayes: convertFractionToDecimal(answer.p_bayes),
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
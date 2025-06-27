//Câu hỏi
export interface ExerciseQuestionBayes {
    content: string;
    question_code: string;
}

//Thông tin người dùng nhập vào
export interface ExerciseAnswerBayes {
    p_1: number;
    p_2: number;
    p_dk1: number;
    p_dk2: number;
    p : number;
    p_bayes :number;
    question_code: string;
}

//Thông tin được trả về sau khi kiểm tra (kết quả)
export interface ExerciseResponse {
    frame_scores: {
        p1_score:  number;
        p2_score: number;
        p_dk1_score: number;
        p_dk2_score: number;
        p_score: number;
        p_bayes_score: number;
    };
    frame_scores_total: number;
    scores: {
        p1_score:  number;
        p2_score: number;
        p_dk1_score: number;
        p_dk2_score: number;
        p_score: number;
        p_bayes_score: number;
        total_score: number;
    };
    correct_answers: {
        p1_score:  number;
        p2_score: number;
        p_dk1_score: number;
        p_dk2_score: number;
        p_score: number;
        p_bayes_score: number;
    };
    success: boolean;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchExerciseQuestion = async (): Promise<ExerciseQuestionBayes> => {
    const response = await fetch('http://localhost:8000/Probability_and_Statistics/bayes/', {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Không thể lấy câu hỏi từ API');
    }
    const data = await response.json();
    return data;
};

export const submitExerciseAnswer = async (
    answer: ExerciseAnswerBayes,
): Promise<ExerciseResponse> => {
    const response = await fetch('http://localhost:8000/api/Probability_and_Statistics/bayes/submit', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            ...answer,
        })
    });

    if (!response.ok) {
        throw new Error('Không thể đưa câu hỏi lên API');
    }

    return response.json();
}; 
//Câu hỏi
export interface ExerciseQuestionCongNhanXacSuat {
    content: string;
    question_code: string;
}

//Thông tin người dùng nhập vào
export interface ExerciseAnswerCongNhanXacSuat {
    p1: number;
    p2: number;
    p3: number;
    pa : number;
    pb : number;
    question_code: string;
}

//Thông tin được trả về sau khi kiểm tra (kết quả)
export interface ExerciseResponseCongNhanXacSuat {
    frame_scores: {
        p_n: number;
        pa: number;
        pb: number;
    };
    frame_scores_total: number;
    scores: {
        p_n : number;
        pa_score: number;
        pb_score: number;
        total_score: number;
    };
    correct_answers: {
        p1: number;
        p2: number;
        p3: number;
        pa :number;
        pb : number;
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

export const fetchExerciseQuestion = async (): Promise<ExerciseQuestionCongNhanXacSuat> => {
    const response = await fetch('http://localhost:8000/api/Probability_and_Statistics/cong-nhan-xac-suat/', {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Không thể lấy câu hỏi từ API');
    }
    const data = await response.json();
    return data;
};

export const submitExerciseAnswer = async (
    answer: ExerciseAnswerCongNhanXacSuat,
): Promise<ExerciseResponseCongNhanXacSuat> => {
    const response = await fetch('http://localhost:8000/api/Probability_and_Statistics/cong-nhan-xac-suat/submit', {
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
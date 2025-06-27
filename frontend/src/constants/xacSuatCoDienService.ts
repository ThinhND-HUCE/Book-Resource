import { API_URL } from "./apiConfig";
//Câu hỏi
export interface ExerciseQuestion {
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    content: string;
    question_code: string;
}

//Thông tin người dùng nhập vào
export interface ExerciseAnswer {
    m: number;
    t: number;
    p: number;
    question_code: string;
}

//Thông tin được trả về sau khi kiểm tra (kết quả)
export interface ExerciseResponse {
    frame_scores: {
        m_score: number;
        t_score: number;
        p_score: number;
    };
    frame_scores_total: number;
    scores: {
        m_score: number;
        t_score: number;
        p_score: number;
        total_score: number;
    };
    correct_answers: {
        m: number;
        t: number;
        p: number;
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

export const fetchExerciseQuestion = async (): Promise<ExerciseQuestion> => {
    const response = await fetch(`${API_URL}/api/xac_suat_co_dien/`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Không thể lấy câu hỏi từ API');
    }
    const data = await response.json();
    return data;
};

export const submitExerciseAnswer = async (
    answer: ExerciseAnswer,
): Promise<ExerciseResponse> => {
    const response = await fetch(`${API_URL}/api/xac_suat_co_dien/submit/`, {
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
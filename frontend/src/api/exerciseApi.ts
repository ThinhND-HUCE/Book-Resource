export interface ExerciseQuestion {
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    content: string;
    answers: string;
}

export interface ExerciseAnswer {
    m: number;
    t: number;
    p: number;
}

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
    const response = await fetch('http://localhost:8000/api/exercises/xstk/', {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch exercise question');
    }
    const data = await response.json();
    return data.question;
};

export const submitExerciseAnswer = async (
    answer: ExerciseAnswer,
    question: ExerciseQuestion
): Promise<ExerciseResponse> => {
    const response = await fetch('http://localhost:8000/api/exercises/xstk/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            ...answer,
            ...question
        })
    });

    if (!response.ok) {
        throw new Error('Failed to submit exercise answer');
    }

    return response.json();
}; 
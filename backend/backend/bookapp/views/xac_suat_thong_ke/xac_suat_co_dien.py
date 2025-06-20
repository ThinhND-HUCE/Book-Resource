from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sympy import binomial, N
import random as rd

from bookapp.auth.jwt_handler import JWTHandler  # Xác thực người dùng
from bookapp.utils.question_utils import encode_values, decode_values

def correct_answer(k1, k2, k3, k4):
    m = int(binomial(k1 + k2, k3))
    t = int(binomial(k1, k4) * binomial(k2, k3 - k4))
    p = float(t / m)
    return m, t, p

def score(user_val, correct_val):
    if correct_val == 0 and abs(user_val) < 1e-6:
        return True
    if correct_val != 0 and abs((user_val - correct_val) / correct_val) < 1e-2:
        return True
    return False

# ====== GET API ======
@api_view(['GET'])
def generate_question_view(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(' ')[1]
    jwt_handler = JWTHandler()
    user = jwt_handler.verify_token(token)
    if not user:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    # Sinh câu hỏi hợp lệ
    while True:
        k1, k2 = rd.sample(range(3, 11), 2)
        k3 = rd.randint(3, min(k1, k2))
        k4 = rd.randint(1, k3 - 1)
        m = binomial(k1 + k2, k3)
        t = binomial(k1, k4) * binomial(k2, k3 - k4)
        p = t / m
        if 0.01 <= p < 0.99:
            break

    question_code = encode_values(k1, k2, k3, k4)
    content = f"Trong hộp có {k1} bi đỏ, {k2} bi xanh. Rút ngẫu nhiên {k3} bi. Tính xác suất để rút được {k4} bi đỏ."

    return Response({
        "k1": k1,
        "k2": k2,
        "k3": k3,
        "k4": k4,
        "content": content,
        "question_code": question_code  
    })
# ====== POST API ======
@api_view(['POST'])
def submit_answer_view(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(' ')[1]
    jwt_handler = JWTHandler()
    user = jwt_handler.verify_token(token)
    if not user:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        data = request.data
        question_code = data.get('question_code')
        if not question_code:
            return Response({'detail': 'Missing question_code'}, status=status.HTTP_400_BAD_REQUEST)

        k1, k2, k3, k4 = decode_values(question_code)

        user_m = int(data.get('m', 0))
        user_t = int(data.get('t', 0))
        user_p = round(float(data.get('p', 0)), 4)

        correct_m, correct_t, correct_p = correct_answer(k1, k2, k3, k4)

        frame_scores = {'m_score': 4, 't_score': 7, 'p_score': 2}
        scores = {
            'm_score': frame_scores['m_score'] if user_m == correct_m else 0,
            't_score': frame_scores['t_score'] if user_t == correct_t else 0,
            'p_score': frame_scores['p_score'] if score(user_p, correct_p) else 0
        }
        scores['total_score'] = sum(scores.values())

        return Response({
            'frame_scores': frame_scores,
            'frame_scores_total': sum(frame_scores.values()),
            'scores': scores,
            'correct_answers': {
                'm': correct_m,
                't': correct_t,
                'p': f"{N(correct_p, 6)}"
            },
            'success': scores['total_score'] == sum(frame_scores.values())
        })

    except Exception as e:
        return Response({'detail': 'Invalid data', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
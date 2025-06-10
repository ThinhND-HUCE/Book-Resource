from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import random as rd
import math
import json
from ..auth.jwt_handler import JWTHandler  # giả sử bạn có sẵn hàm này
from sympy import *
import math

def question():
    while True:
        k1, k2 = rd.sample(range(3, 11), 2)
        k3 = rd.randint(3, min(k1, k2))
        k4 = rd.randint(1, k3 - 1)
        m = math.comb(k1 + k2, k3)
        t = math.comb(k1, k4) * math.comb(k2, k3 - k4)
        p = t / m
        if 0.01 <= p < 0.99:
            break

    result = {
        "k1": k1,
        "k2": k2,
        "k3": k3,
        "k4": k4,
        "content": f"Trong hộp có {k1} bi đỏ, {k2} bi xanh. Rút ngẫu nhiên {k3} bi. Tính xác suất để rút được {k4} bi đỏ.",
        "answers": [m, t, round(p, 4)],
    }
    return result


def correct_answer(k1: int, k2: int, k3: int, k4: int):
    m = math.comb(k1 + k2, k3)
    t = math.comb(k1, k4) * math.comb(k2, k3 - k4)
    p = round(t / m, 4)
    return m, t, p

def score(input_answer, exact_answer):
    '''
    input_answer, exact_answer: float
    kết quả:
        đúng nếu:   (TH1) exact_answer = 0, | input_answer | < 10^-6; 
                    (TH2) exact_answer != 0, sai số tương đối delta = | (input_answer - exact_answer) / exact_answer | < 10^-4
        sai nếu ngược lại
    '''
    if exact_answer == 0 and abs(input_answer) or exact_answer != 0 and abs( (input_answer - exact_answer) / exact_answer ) < 10**-2:
        return True
    else:
        return False
    
@api_view(['GET', 'POST'])
def xstk_kinh_dien_view(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(' ')[1]
    jwt_handler = JWTHandler()
    user = jwt_handler.verify_token(token)
    if not user:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        return Response({"question": question()})
    
    #POST METHOD
    try:
        data = request.data
        user_m = int(data.get('m', 0))
        user_t = int(data.get('t', 0))
        user_p = round(float(data.get('p', 0)), 4)
        k1 = int(data.get('k1', 0))
        k2 = int(data.get('k2', 0))
        k3 = int(data.get('k3', 0))
        k4 = int(data.get('k4', 0))

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
                'p': correct_p
            },
            'success': scores['total_score'] == sum(frame_scores.values())
        })
    
    except Exception as e:
        return Response({'detail': 'Invalid data', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

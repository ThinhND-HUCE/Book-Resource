from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sympy import binomial, N
import random as rd
from ...auth.jwt_handler import JWTHandler  # Xác thực người dùng
from ...utils.question_utils import encode_values, decode_values
from ...utils.Check_Score import score

@api_view(['GET'])
def generate_question_view_bayes(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(' ')[1]
    jwt_handler = JWTHandler()
    user = jwt_handler.verify_token(token)
    if not user:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    k1, k2, k3, k4 = [i/100 for i in (rd.sample(range(70, 91), 4))]

    content = f"Có hai hộp A và B. Hộp A có {k1} thẻ xanh và {k2} thẻ đỏ, hộp B có {k3} thẻ xanh và {k4} thẻ đỏ. Lấy ngẫu nhiên một hộp, rồi từ hộp đó lấy ra một thẻ và được thẻ đỏ. Tính xác suất để thẻ đó được lấy từ hộp B."
    
    return Response({
        "content": content,
        "question_code": encode_values(k1, k2, k3, k4)
    })

def correct_answer_bayes(p1, p2, p3,k1, k2, k3, k4):
    p1 = p2 = 1/ 2
    p_dk1 = (k2 / (k1 + k2)) 
    p_dk2 = (k4 / (k3 + k4)) 
    p = p1 * p_dk1 + p2 * p_dk2
    p_bayes = p2 * p_dk2 / p
    return p1, p2, p_dk1, p_dk2, p, p_bayes


@api_view(['POST'])
def submit_answer_view_bayes(request):
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
        user_p1 = round(float(data.get('p_1', 0)), 4)
        user_p2 = round(float(data.get('p_2', 0)), 4)
        user_p_dk1 = round(float(data.get('p_dk1', 0)), 4)
        user_p_dk2 = round(float(data.get('p_dk2', 0)), 4)
        user_p = round(float(data.get('p', 0)), 4)
        user_p_bayes = round(float(data.get('p_bayes', 0)), 4)
         
        correct_p1, correct_p2, correct_p_dk1, correct_p_dk2, correct_p, correct_p_bayes = correct_answer_bayes(k1, k2, k3, k4)
        
        frame_scores = {'p1_score': 1,
            'p2_score': 1,
            'p_dk1_score': 2,
            'p_dk2_score': 2,
            'p_score': 3,
            'p_bayes_score': 2
        }

        scores = {
            'p1_score': frame_scores['p1_score'] if score(user_p1,correct_p1) else 0,
            'p2_score': frame_scores['p2_score'] if score(user_p2, correct_p2) else 0,
            'p_dk1_score': frame_scores['p_dk1_score'] if score(user_p_dk1,correct_p_dk1) else 0,
            'p_dk2_score': frame_scores['p_dk2_score'] if score(user_p_dk2,correct_p_dk2) else 0,
            'p_score': frame_scores['p_score'] if score(user_p, correct_p) else 0,
            'p_bayes_score': frame_scores['p_bayes_score'] if score(user_p_bayes, correct_p_bayes) else 0
        }
        scores['total_score'] = sum(scores.values())

        return Response({
            'frame_scores': frame_scores,
            'frame_scores_total': sum(frame_scores.values()),
            'scores': scores,
            'correct_answers': {
                'p_1': f"{N(correct_p1, 4)}",
                'p_2': f"{N(correct_p2, 4)}",
                'p_dk1': f"{N(correct_p_dk1, 4)}",
                'p_dk2': f"{N(correct_p_dk2, 4)}",
                'p': f"{N(correct_p, 6)}",
                'p_bayes': f"{N(correct_p_bayes, 6)}"
            },
            'success': scores['total_score'] == sum(frame_scores.values())
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
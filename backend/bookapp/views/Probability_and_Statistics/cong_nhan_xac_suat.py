from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from sympy import binomial, N
import random as rd
from ...auth.jwt_handler import JWTHandler  # Xác thực người dùng
from ...utils.question_utils import encode_values, decode_values
from ...utils.Check_Score import score

def correct_answer(p1, p2, p3):
    # Tính xác suất để cả ba người đều ném không lọt qua rổ
    pa = (1 - p1) * (1 - p2) * (1 - p3)
    # Tính xác suất để ít nhất một người ném lọt qua rổ
    pb = p1 * (1 - p2) * (1 - p3) + (1 - p1) * p2 * (1 - p3) + (1 - p1) * (1 - p2) * p3 
    return pa, pb
   
@api_view(['GET'])
def generate_question_view_cong_nhan_xac_suat(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(' ')[1]
    jwt_handler = JWTHandler()
    user = jwt_handler.verify_token(token)
    if not user:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    # Sinh câu hỏi hợp lệ
    p1, p2, p3 = [i/100 for i in (rd.sample(range(70, 91), 3))]
    
    content = (
        f"Ba người chơi bóng rổ, mỗi người ném một quả. Xác suất ném lọt qua rổ của mỗi người lần lượt là {p1}, {p2}, {p3}.\n"
        "a.) Tính xác suất để cả ba người đều ném không lọt qua rổ.\n"
        "b.) Tính xác suất để ít nhất một người ném lọt qua rổ.\n"
    )
    return Response({
        "content": content,
        "question_code": encode_values(p1, p2, p3)
    })

@api_view(['POST'])
def submit_answer_view_cong_nhan_xac_suat(request):
    # Authentication check
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

        # Decode question values
        p1,p2,p3 = decode_values(question_code)

        # Get user answers for P_a and P_b
        user_p1 = round(float(data.get('p_1', 0)), 4)
        user_p2 = round(float(data.get('p_2', 0)), 4)
        user_p3 = round(float(data.get('p_3', 0)), 4)
        user_pa = round(float(data.get('P_a', 0)), 4)
        user_pb = round(float(data.get('P_b', 0)), 4)

        # Get correct answers
        correct_pa, correct_pb = correct_answer(p1, p2, p3)

        # Define scoring structure
        frame_scores = {'p_n' : 1, 'pa_score': 6, 'pb_score': 7}
        
        # Calculate scores
        scores = {
            'p_n': frame_scores['p_n'] if score(p1, user_p1) and score(p2,user_p2) and score(p3,user_p3) else 0,  # Fixed score for p_n
            'pa_score': frame_scores['pa_score'] if score(user_pa, correct_pa) else 0,
            'pb_score': frame_scores['pb_score'] if score(user_pb, correct_pb) else 0
        }
        scores['total_score'] = sum(scores.values())

        # Return response
        return Response({
            'frame_scores': frame_scores,
            'frame_scores_total': sum(frame_scores.values()),
            'scores': scores,
            'correct_answers': {
                'p_1': f"{N(p1, 4)}",
                'p_2': f"{N(p2, 4)}",
                'p_3': f"{N(p3, 4)}",
                'P_a': f"{N(correct_pa, 6)}",
                'P_b': f"{N(correct_pb, 6)}"
            },
            'success': scores['total_score'] == sum(frame_scores.values())
        })

    except Exception as e:
        return Response(
            {'detail': 'Invalid data', 'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
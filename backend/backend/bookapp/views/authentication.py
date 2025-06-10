from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from bookapp.permissions import IsAuthenticatedWithJWT
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from ..auth.jwt_handler import JWTHandler
from bookapp import serializers
from bookapp.models import User
from bookapp.models import BookCode
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from bookapp.utils.email_utils import send_html_email


@api_view(['POST'])
def register_user(request):
    verify_code = request.data.get('verifyCode')  # Lấy verifyCode từ payload
    if not verify_code:
        return Response({'error': 'Verify code is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Kiểm tra verifyCode trong bảng book_code
        book_entry = BookCode.objects.get(matched_code=verify_code)
    except BookCode.DoesNotExist:
        return Response({'error': 'Invalid verify code'}, status=status.HTTP_400_BAD_REQUEST)

    # Sử dụng UserSerializer để ánh xạ dữ liệu
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Mã hóa mật khẩu trước khi lưu
        user = serializer.save()

        # Đánh dấu user_id vào bảng book_code
        book_entry.user_id = user.id
        book_entry.save()

        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from bookapp.serializers import UserSerializer

from django.contrib.auth.hashers import make_password, check_password

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        # Lấy thông tin người dùng từ cơ sở dữ liệu
        user = User.objects.get(username=username)
        print(user.password)
        print(make_password(password))
        # Kiểm tra mật khẩu (bạn đã thực hiện trong code trước)
        if check_password(password, user.password):
            jwt_handler = JWTHandler()
            access_token = jwt_handler.generate_access_token(user)
            refresh_token = jwt_handler.generate_refresh_token(username)

            return Response({
                'refresh': str(refresh_token),
                'access': str(access_token),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def verify_book_code(request):
    email = request.data.get('email')
    book_code = request.data.get('book_code')

    if not email or not book_code:
        return Response({'error': 'Thiếu email hoặc mã sách.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Tìm mã sách trong bảng BookCode
        book_entry = BookCode.objects.get(book_code=book_code)

        matched_code = book_entry.matched_code

        # Gửi matched_code đến email người dùng
        send_html_email(email, matched_code)
        

        return Response({'message': 'Mã xác nhận đã được gửi về email.'}, status=status.HTTP_200_OK)

    except BookCode.DoesNotExist:
        return Response({'error': 'Mã sách không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Lỗi gửi email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticatedWithJWT])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        token = refresh_token
        token.blacklist()
        return Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

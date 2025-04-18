from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from bookapp.permissions import IsAuthenticatedWithJWT
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from ..auth.jwt_handler import JWTHandler
from bookapp import serializers
from bookapp.models import User
from django.shortcuts import get_object_or_404
@api_view(['POST'])
def register_user(request):
    serializer = serializers(data=request.data)
    if serializer.is_valid():
        # Password sẽ được mã hóa tự động thông qua serializer
        user = serializer.save()
        return Response({
            'message': 'User created successfully',
            'user': serializers(user).data
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

        # Kiểm tra mật khẩu (bạn đã thực hiện trong code trước)
        if check_password(password, user.password):
            jwt_handler = JWTHandler()
            access_token = jwt_handler.generate_access_token(user)
            refresh_token = jwt_handler.generate_refresh_token(username)

            return Response({
                'refresh': str(refresh_token),
                'access': str(access_token),
                'user': UserSerializer(user).data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)




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

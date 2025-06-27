from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from bookapp.permissions import IsAuthenticatedWithJWT
from django.contrib.auth.hashers import make_password, check_password
from ..auth.jwt_handler import JWTHandler
from bookapp import serializers
from bookapp.models import User
from bookapp.models import BookCode
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from bookapp.utils.email_utils import send_html_email, send_otp_email, send_otp_email_forgot
import random 
from django.utils import timezone
import jwt 
from django.utils.timezone import is_aware, make_aware
from datetime import timedelta
from django.utils.timezone import now, localtime
from django.utils.timezone import is_naive, make_aware, now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from bookapp.utils.page_number_pagination import CustomPagination

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
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_student(request):
    # Sử dụng UserSerializer để ánh xạ dữ liệu
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Mã hóa mật khẩu trước khi lưu
        user = serializer.save()

        return Response({
            'success': True,
            'message': 'User created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticatedWithJWT])
def get_all_users(request):
    try:
        users = User.objects.all().order_by("id")
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"succes": False, "message": f"Lỗi: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def send_otp_forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response({"success": False, "message": "Email không được để trống."}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"success": False, "message": "Email không tồn tại."}, status=404)

    otp = ''.join(random.choices('0123456789', k=6))
    user.otp_code = otp
    user.otp_created_at = localtime(now())
    user.save(update_fields=["otp_code", "otp_created_at"])

    send_otp_email_forgot(user.email, otp)

    return Response({"success": True, "message": "OTP đã được gửi đến email."})

@api_view(["POST"])
@permission_classes([IsAuthenticatedWithJWT])
def send_otp(request):
    print("✅ Đã vào hàm send_otp")
    try:
        # Lấy token từ header
        auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
        token_type, token = auth_header.split()
        jwt_handler = JWTHandler()
        payload = jwt_handler.verify_token(token)

        username = payload.get("username")
        if not username:
            return Response({"error": "Token không chứa username"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        otp = ''.join(random.choices('0123456789', k=6))
        user.otp_code = otp
        user.otp_created_at = localtime(now())  # ✅ Lưu thời gian theo giờ Việt Nam
        user.save(update_fields=["otp_code", "otp_created_at"])

        send_otp_email(user.email, otp)

        return Response({"message": "Đã gửi OTP thành công"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Lỗi xử lý: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticatedWithJWT])
def verify_otp(request):
    try:
        auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return Response({"error": "Thiếu token"}, status=status.HTTP_401_UNAUTHORIZED)

        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            return Response({"error": "Loại token không hợp lệ"}, status=status.HTTP_401_UNAUTHORIZED)

        jwt_handler = JWTHandler()
        payload = jwt_handler.verify_token(token)
        username = payload.get("username")

        if not username:
            return Response({"error": "Token không chứa username"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        input_otp = request.data.get("otp")
        if not input_otp:
            return Response({'error': 'Thiếu mã OTP.'}, status=400)

        otp_time = user.otp_created_at
        now_time = localtime(now())  # ✅ So sánh với thời gian theo giờ VN

        # Debug
        print("📌 Mã OTP nhập:", input_otp)
        print("📌 Mã OTP đúng:", user.otp_code)
        print("📌 Thời điểm tạo OTP:", otp_time)
        print("📌 Thời điểm hiện tại:", now_time)
        print("📌 Chênh lệch:", now_time - otp_time if otp_time else "None")

        if (
            user.otp_code == input_otp and
            otp_time and
            now_time - otp_time <= timedelta(minutes=5)
        ):
            user.otp_code = None
            user.otp_created_at = None
            user.save(update_fields=["otp_code", "otp_created_at"])
            return Response({'success': True}, status=200)
        else:
            return Response({'success': False, 'message': 'OTP không hợp lệ hoặc đã hết hạn.'}, status=400)

    except Exception as e:
        return Response({"error": f"Lỗi xử lý: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticatedWithJWT])
def change_password(request):
    try:
        # ✅ Giải mã token thủ công
        auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
        token_type, token = auth_header.split()
        jwt_handler = JWTHandler()
        payload = jwt_handler.verify_token(token)

        username = payload.get("username")
        if not username:
            return Response({"error": "Token không chứa username"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)  # ✅ Đây là user thật
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # ✅ KHÔNG dùng request.user nữa!

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Thiếu mật khẩu'}, status=400)

        if not check_password(old_password, user.password):
            return Response({'error': 'Mật khẩu cũ không đúng'}, status=400)

        # ✅ Đổi mật khẩu
        user.password = make_password(new_password)
        user.is_first_login = False
        user.save(update_fields=["password", "is_first_login"])

        return Response({'message': 'Đổi mật khẩu thành công'}, status=200)

    except Exception as e:
        return Response({"error": f"Lỗi xử lý: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


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
                'role': user.role,
                "is_first_login": user.is_first_login,
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def verify_book_code(request):
    print(request.data)
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
        print(e);
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

@api_view(["POST"])
def verify_otp_reset_password(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    new_password = request.data.get("new_password")

    if not all([email, otp, new_password]):
        return Response({
            "success": False,
            "message": "Vui lòng điền đầy đủ thông tin."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            "success": False,
            "message": "Email không tồn tại."
        }, status=status.HTTP_404_NOT_FOUND)

    # Kiểm tra OTP đúng và không hết hạn (trong 5 phút)
    if (
        not user.otp_code or
        user.otp_code != otp or
        not user.otp_created_at or
        now() - user.otp_created_at > timedelta(minutes=5)
    ):
        return Response({
            "success": False,
            "message": "Mã OTP không đúng hoặc đã hết hạn."
        }, status=status.HTTP_400_BAD_REQUEST)

    # Cập nhật mật khẩu và xoá OTP
    user.set_password(new_password)
    user.otp_code = None
    user.otp_created_at = None
    user.save(update_fields=["password", "otp_code", "otp_created_at"])

    return Response({
        "success": True,
        "message": "Đổi mật khẩu thành công."
    }, status=status.HTTP_200_OK)


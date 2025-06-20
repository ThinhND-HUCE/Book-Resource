from rest_framework.permissions import BasePermission
from .auth.jwt_handler import JWTHandler

class IsAuthenticatedWithJWT(BasePermission):
    def has_permission(self, request, view):
        print("🛡️ Kiểm tra quyền truy cập bằng JWT")
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            print("❌ Không có Authorization header")
            return False
        try:
            token_type, token = auth_header.split()
            if token_type.lower() != 'bearer':
                print("❌ Token không bắt đầu bằng Bearer")
                return False
            jwt_handler = JWTHandler()
            payload = jwt_handler.verify_token(token)
            print("✅ Payload hợp lệ:", payload)
            return True
        except Exception as e:
            print("❌ Lỗi xác thực token:", str(e))
            return False

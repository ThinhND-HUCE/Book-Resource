import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class JWTHandler:
    def __init__(self):
        self.secret = os.getenv('JWT_SECRET')
        self.algorithm = os.getenv('JWT_ALGORITHM', 'HS256')

    def generate_access_token(self, user):
        payload = {
            'username': user.username,
            'lastName': user.lastName,
            'firstName': user.firstName,
            'email': user.email,
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)  # Đảm bảo dùng PyJWT

    def generate_refresh_token(self, username):
        """Tạo refresh token"""
        payload = {
            'username': username,
            'exp': datetime.utcnow() + timedelta(days=7),
            'type': 'refresh'
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)  # Đảm bảo dùng PyJWT

    def verify_token(self, token):
        """Xác thực token"""
        try:
            return jwt.decode(token, self.secret, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            raise Exception('Token đã hết hạn')
        except jwt.InvalidTokenError:
            raise Exception('Token không hợp lệ')

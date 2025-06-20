import os
import django

# Khởi tạo Django môi trường
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from bookapp.models import User
from django.contrib.auth.hashers import make_password

def migrate_passwords():
    accounts = User.objects.all()
    for account in accounts:
        raw_password = account.password
        if not raw_password.startswith('pbkdf2_'):  # Kiểm tra xem đã hash chưa
            account.password = make_password(raw_password)
            account.save()
            print(f'Đã mã hóa mật khẩu cho tài khoản {account.firstName}')

if __name__ == '__main__':
    migrate_passwords()

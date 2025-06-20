from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    lastName = models.CharField(max_length=255, null=True, blank=True, db_column="last_name")  # Cho phép null và blank
    firstName = models.CharField(max_length=255, null=True, blank=True, db_column="first_name")  # Cho phép null và blank
    username = models.CharField(max_length=255, unique=True, null=True, db_column="username")
    password = models.CharField(max_length=255, null=True, db_column="password_hash")
    classname = models.CharField(max_length=10, null=True, blank=True, db_column="class")
    phone = models.CharField(max_length=15, unique=True, db_column="phone_number")
    email = models.EmailField(max_length=255, unique=True, db_column="email")
    role = models.CharField(max_length=20,null=True, blank=True, db_column="role")
    is_first_login = models.BooleanField(default=True, db_column="is_first_login")
    otp_code = models.CharField(max_length=10, null=True, blank=True, db_column="otp_code")
    otp_created_at = models.DateTimeField(null=True, blank=True, db_column="otp_created_at")


    class Meta:
        db_table = 'users'  # Để kết nối với bảng PostgreSQL hiện có
        managed = False

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
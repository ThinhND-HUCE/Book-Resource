from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    # id = models.CharField(max_length=255, primary_key=True, db_column="id")
    student_id = models.CharField(max_length=255, null=True, blank=True, db_column="student_id")
    last_name = models.CharField(max_length=255, null=True, blank=True, db_column="last_name")  
    first_name = models.CharField(max_length=255, null=True, blank=True, db_column="first_name")  
    username = models.CharField(max_length=255, unique=True, null=True, db_column="username")
    password = models.CharField(max_length=255, null=True, db_column="password")
    classname = models.CharField(max_length=10, null=True, blank=True, db_column="class")
    phone = models.CharField(max_length=15, unique=True, db_column="phone")
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
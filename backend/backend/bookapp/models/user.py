from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    lastName = models.CharField(max_length=255, null=True, blank=True, db_column="last_name")  # Cho phép null và blank
    firstName = models.CharField(max_length=255, null=True, blank=True, db_column="first_name")  # Cho phép null và blank
    username = models.CharField(max_length=255, unique=True, null=True, db_column="username")
<<<<<<< HEAD
    password = models.CharField(max_length=255, null=True, db_column="password")
    classname = models.CharField(max_length=10, null=True, blank=True, db_column="class")
    phone = models.CharField(max_length=15, unique=True, db_column="phone")
=======
    password = models.CharField(max_length=255, null=True, db_column="password_hash")
    classname = models.CharField(max_length=10, db_column="class")
    gender = models.CharField(max_length=10, db_column="gender")
    phoneNum = models.CharField(max_length=15, unique=True, db_column="phone_number")
>>>>>>> f32ef398ca03f0c4d9a267da1b6a6c0a803d9964
    email = models.EmailField(max_length=255, unique=True, db_column="email")

    class Meta:
        db_table = 'users'  # Để kết nối với bảng PostgreSQL hiện có
        managed = False

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
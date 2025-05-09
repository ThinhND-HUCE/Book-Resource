from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    ID = models.CharField(primary_key=True, max_length=15, db_column="student_id")
    lastName = models.CharField(max_length=255, null=False, db_column="last_name")
    firstName = models.CharField(max_length=255, null=True, db_column="first_name")
    username = models.CharField(max_length=255, unique=True, null=True, db_column="username")
    password = models.CharField(max_length=255, null=True, db_column="password")
    classname = models.CharField(max_length=10, db_column="class")
    gender = models.CharField(max_length=10, db_column="gender")
    phoneNum = models.CharField(max_length=15, unique=True, db_column="phone_number")
    email = models.EmailField(max_length=255, unique=True, db_column="email")

    class Meta:
        db_table = 'users'  # Để kết nối với bảng MySQL hiện có
        managed = False

    def save(self, *args, **kwargs):
        # Mã hóa password trước khi lưu, chỉ khi password mới thay đổi hoặc là đối tượng mới
        if self.password and (self._state.adding or self.password != self.__class__.objects.filter(pk=self.pk).first().password):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

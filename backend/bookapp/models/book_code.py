from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BookCode(models.Model):
    book_code = models.CharField(max_length=50)
    matched_code = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_code'      
        managed = False            

    def __str__(self):
        return self.book_code

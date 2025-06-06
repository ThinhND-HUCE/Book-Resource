from django.db import models

class BookCode(models.Model):
    ID = models.AutoField(primary_key=True, db_column="id")
    bookCode = models.CharField(max_length=255, null=False, db_column="book_code")
    matchCode = models.CharField(max_length=255, null=False, db_column="matched_code")
    userID = models.IntegerField(null=False, db_column="user_id")

    class Meta:
        db_table = "book_code"
        managed = False
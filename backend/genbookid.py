import random
import os
import django

# Khởi tạo Django môi trường
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from bookapp.models import BookCode
from django.db import connection

def generate_book_id(n: int):
    # Reset sequence về 1
    with connection.cursor() as cursor:
        cursor.execute("ALTER SEQUENCE book_code_id_seq RESTART WITH 1")
    print("Đã reset ID về 1")

    # Tạo danh sách các số ngẫu nhiên không trùng lặp
    book_codes = random.sample(range(10**15, 10**16), n)
    match_codes = random.sample(range(10**11, 10**12), n)

    bookids = []
    for i in range(n):
        rdnumber = str(book_codes[i])
        manumber = str(match_codes[i])
        
        book = BookCode(bookCode=rdnumber, matchCode=manumber)
        book.save()
        bookids.append((rdnumber, manumber))
        print(f"Đã thêm book code: {rdnumber} với match code: {manumber} và ID: {book.ID}")
    return bookids

if __name__ == '__main__':
    generate_book_id(50)
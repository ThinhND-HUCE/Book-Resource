from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 20  # 👈 mỗi trang 20 user
    page_size_query_param = 'page_size'
    max_page_size = 100
from django.urls import path
from .views import authentication
from .views import renderfile
from .views.xac_suat_thong_ke.xac_suat_co_dien import generate_question_view, submit_answer_view

urlpatterns = [
    path('auth/register/', authentication.register_user, name='register'),
    path('auth/login/', authentication.login_user, name='login'),
    path('auth/verify-book-code/', authentication.verify_book_code, name='verify_book_code'),
    path('auth/logout/', authentication.logout_user, name='logout'),
    path('grades/', renderfile.list_grades, name='list_grades'),
    path('grades/<str:grade_id>/courses/', renderfile.list_courses_by_grade, name='list_courses_by_grade'),
    path('grades/<str:grade_id>/courses/<str:course_id>/', renderfile.course_detail, name='course_detail'),
    path('files/view/', renderfile.get_file_content, name='get_file_content'),
    path('exercises/xstk/generate-question/', generate_question_view, name='generate-question'),
    path('exercises/xstk/submit-answer/', submit_answer_view, name='submit-answer')
]

from django.urls import path
from .views import authentication
from .views import renderfile
from .views import *
from .views.Probability_and_Statistics.cong_nhan_xac_suat import *
from .views.Probability_and_Statistics.xac_suat_co_dien import *
from .views.Probability_and_Statistics.bayes import *

urlpatterns = [
    # API for user
    path('auth/register/', authentication.register_user, name='register'),
    path('auth/register-student/', authentication.register_student, name='register-student'),
    path('auth/get-all-user/', authentication.get_all_users, name='get-all-user'),
    path('auth/login/', authentication.login_user, name='login'),
    path('auth/verify-book-code/', authentication.verify_book_code, name='verify_book_code'),
    path('auth/send-otp/', authentication.send_otp, name = 'send_otp'),
    path('auth/verify-otp/', authentication.verify_otp, name = 'verify-otp'),
    path('auth/change-password/', authentication.change_password, name='change-password'),
    path("auth/verify-otp-reset-password/", authentication.verify_otp_reset_password, name='verify_otp_reset_password'),
    path("auth/send-email-to-take-otp/", authentication.send_otp_forgot_password, name='send_otp_forgot_password'),
    # API for render file
    path('grades/', renderfile.list_grades, name='list_grades'),
    path('grades/<str:grade_id>/courses/', renderfile.list_courses_by_grade, name='list_courses_by_grade'),
    path('grades/<str:grade_id>/courses/<str:course_id>/', renderfile.course_detail, name='course_detail'),
    path('files/view/', renderfile.get_file_content, name='get_file_content'),
    # API tạo trang mới
    path("generate-pages-from-template/", renderfile.generate_pages_from_template, name='generate-pages-from-template'),
    # API for Xác suất Cổ điển
    path('Probability_and_Statistics/xac_suat_co_dien/', generate_question_view_xac_suat_co_dien, name='generate_question_xac_suat_co_dien'),
    path('Probability_and_Statistics/xac_suat_co_dien/submit/', submit_answer_view_xac_suat_co_dien, name='submit_answer_xac_suat_co_dien'),
    # API for Cộng Nhân Xác suất
    path('Probability_and_Statistics/cong-nhan-xac-suat/', generate_question_view_cong_nhan_xac_suat, name='generate_question_cong_nhan_xac_suat'),
    path('Probability_and_Statistics/cong-nhan-xac-suat/submit', submit_answer_view_cong_nhan_xac_suat, name='submit_answer_cong_nhan_xac_suat' ),
    # API for bayes
    path('Probability_and_Statistics/bayes/', generate_question_view_bayes, name='generate_question_bayes'),
    path('Probability_and_Statistics/bayes/submit', submit_answer_view_bayes, name='submit_answer_bayes'),
]

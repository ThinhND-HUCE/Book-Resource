from django.urls import path
from .views import authentication
from .views import renderfile
from .views import *
from .views.Probability_and_Statistics.cong_nhan_xac_suat import *
from .views.Probability_and_Statistics.xac_suat_co_dien import *
from .views.Probability_and_Statistics.bayes import *

urlpatterns = [
    path('auth/register/', authentication.register_user, name='register'),
    path('auth/login/', authentication.login_user, name='login'),
    path('auth/verify-book-code/', authentication.verify_book_code, name='verify_book_code'),
    path('auth/logout/', authentication.logout_user, name='logout'),
    path('courses/', renderfile.list_courses, name='list_courses'),
    path('courses/<str:course_id>/', renderfile.course_detail, name='course_detail'),
    path('files/view', renderfile.get_file_content, name='get_file_content'),
    # API for Xác suất Cổ điển
    path('xac_suat_co_dien/', generate_question_view_xac_suat_co_dien, name='generate_question_xac_suat_co_dien'),
    path('xac_suat_co_dien/submit/', submit_answer_view_xac_suat_co_dien, name='submit_answer_xac_suat_co_dien'),
    # API for Cộng Nhân Xác suất
    path('cong-nhan-xac-suat/', generate_question_view_cong_nhan_xac_suat, name='generate_question_cong_nhan_xac_suat'),
    path('cong-nhan-xac-suat/submit', submit_answer_view_cong_nhan_xac_suat, name='submit_answer_cong_nhan_xac_suat' ),
    # api for bayes
    path('bayes/', generate_question_view_bayes, name='generate_question_bayes'),
    path('bayes/submit', submit_answer_view_bayes, name='submit_answer_bayes'),
]

from django.urls import path
from .views import authentication
from .views import renderfile
from .views.xac_suat_co_dien import xac_suat_co_dien_view

urlpatterns = [
    path('auth/register/', authentication.register_user, name='register'),
    path('auth/login/', authentication.login_user, name='login'),
    path('auth/verify-book-code/', authentication.verify_book_code, name='verify_book_code'),
    path('auth/send-otp/', authentication.send_otp, name = 'send_otp'),
    path('auth/verify-otp/', authentication.verify_otp, name = 'verify-otp'),
    path('auth/change-password/', authentication.change_password, name='change-password'),
    path("auth/verify-otp-reset-password/", authentication.verify_otp_reset_password, name='verify_otp_reset_password'),
    path("auth/send-email-to-take-otp/", authentication.send_otp_forgot_password, name='send_otp_forgot_password'),
    path('auth/logout/', authentication.logout_user, name='logout'),
    path('courses/', renderfile.list_courses, name='list_courses'),
    path('courses/<str:course_id>/', renderfile.course_detail, name='course_detail'),
    path('files/view', renderfile.get_file_content, name='get_file_content'),
    path('exercises/xstk/', xac_suat_co_dien_view, name='xstk_kinh_dien')
]

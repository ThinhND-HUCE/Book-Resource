from django.urls import path
from .views import authentication

urlpatterns = [
    path('register/', authentication.register_user, name='register'),
    path('login/', authentication.login_user, name='login'),
    path('logout/', authentication.logout_user, name='logout'),
]

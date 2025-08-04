from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .views import LoginUsuarioView, RegistroUsuarioView

urlpatterns = [
    # Endpoints de autenticación
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', RegistroUsuarioView.as_view()),
    path('login/', LoginUsuarioView.as_view()),
]
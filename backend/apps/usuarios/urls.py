from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import registro, perfil_usuario

urlpatterns = [
    # Endpoints de autenticación
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', registro, name='registro'),
    path('perfil/', perfil_usuario, name='perfil_usuario'),
]
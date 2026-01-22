from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .views import (
    LoginUsuarioView, 
    RegistroUsuarioView, 
    GetUserData, 
    UpdateUserProfileView,
    DireccionesListView,
    DireccionDetailView,
    FavoritosListView,
    FavoritoDetailView,
    CartListView,
    CartDetailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PasswordResetTokenValidateView,
    ChangePasswordView
)

urlpatterns = [
    # Endpoints de autenticación
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', RegistroUsuarioView.as_view()),
    path('login/', LoginUsuarioView.as_view()),
    # Endpoints de recuperación de contraseña
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/validate-token/', PasswordResetTokenValidateView.as_view(), name='password-reset-validate'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('user-profile/', GetUserData.as_view(), name='user-profile'),
    path('user-profile/update/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('user-profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
    # Endpoints de direcciones
    path('user-profile/direcciones/', DireccionesListView.as_view(), name='direcciones-list'),
    path('user-profile/direcciones/<int:pk>/', DireccionDetailView.as_view(), name='direccion-detail'),
    # Endpoints de favoritos
    path('user-profile/favoritos/', FavoritosListView.as_view(), name='favoritos-list'),
    path('user-profile/favoritos/<int:refaccion_id>/', FavoritoDetailView.as_view(), name='favorito-detail'),
    # Endpoints de carrito
    path('user-profile/cart/', CartListView.as_view(), name='cart-list'),
    path('user-profile/cart/<int:refaccion_id>/', CartDetailView.as_view(), name='cart-detail'),
]
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
    FavoritoDetailView
)

urlpatterns = [
    # Endpoints de autenticación
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', RegistroUsuarioView.as_view()),
    path('login/', LoginUsuarioView.as_view()),
    path('user-profile/', GetUserData.as_view(), name='user-profile'),
    path('user-profile/update/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    # Endpoints de direcciones
    path('user-profile/direcciones/', DireccionesListView.as_view(), name='direcciones-list'),
    path('user-profile/direcciones/<int:pk>/', DireccionDetailView.as_view(), name='direccion-detail'),
    # Endpoints de favoritos
    path('user-profile/favoritos/', FavoritosListView.as_view(), name='favoritos-list'),
    path('user-profile/favoritos/<int:refaccion_id>/', FavoritoDetailView.as_view(), name='favorito-detail'),
]
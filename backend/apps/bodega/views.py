from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Bodega
from .serializer import BodegaSerializer

class BodegaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar las operaciones CRUD de Bodega.
    """
    queryset = Bodega.objects.all().order_by('name')
    serializer_class = BodegaSerializer
    pk = 'noDeServicio'
    permission_classes = [AllowAny]
    
    

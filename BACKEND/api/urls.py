from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarameloViewSet
from .views import RegisterView 
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Crea un router y registra nuestro viewset con él.
router = DefaultRouter()
router.register(r'caramelos', CarameloViewSet)

router = DefaultRouter()
# Registramos nuestro ViewSet de Productos
# 'products' será el prefijo de la URL (ej. /api/products/)
router.register(r'products', views.ProductViewSet, basename='product')


router.register(r'my-products', views.MyProductViewSet, basename='my-products')

router.register(r'historial', views.HistorialViewSet, basename='historial')

# Las URLs de la API son determinadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('comprar/', views.CrearCompraView.as_view(), name='crear-compra')
]
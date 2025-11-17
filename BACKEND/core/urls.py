"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Incluimos las URLs de tu app 'api' (products, register, profile)
    path('api/', include('api.urls')),
    
    # --- 3. CAMBIAMOS LA RUTA DE LOGIN ---
    # Ahora 'api/login/' usa la vista de Simple JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # --- 4. (RECOMENDADO) Añadimos la ruta para refrescar el token ---
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Configuración para servir archivos de medios (imágenes) en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
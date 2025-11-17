from rest_framework import viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated


from rest_framework.views import APIView

from django.db import transaction

from .models import Caramelo, Compra, Product
from .serializers import (CarameloSerializer, 
                        CompraSerializer,
                        RegisterSerializer,
                        ProductSerializer,
                        UserProfileSerializer
                        )


from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework import viewsets, generics, status # Añade generics y status
from rest_framework.permissions import IsAuthenticated, AllowAny


from rest_framework.response import Response # Importa Response
from rest_framework.authtoken.models import Token # Importa Token

from django.contrib.auth.models import User

# Create your views here.

class CarameloViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar caramelos.
    """
    queryset = Caramelo.objects.all()  # Define qué datos debe manejar
    serializer_class = CarameloSerializer # Define qué serializer debe usa


class HistorialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que muestra el historial de compras
    del usuario actualmente autenticado.
    """
    serializer_class = CompraSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Esta función asegura que cada usuario
        solo pueda ver SU PROPIO historial de compras.
        """
        # Filtra las compras por el usuario que hace la petición
        return Compra.objects.filter(usuario=self.request.user).order_by('-fecha_compra')
    
class RegisterView(generics.GenericAPIView):
    """
    Vista para registrar un nuevo usuario.
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Cualquier usuario (autenticado o no) puede ver esto

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Preparamos la respuesta que React espera
        data = {
            "user": serializer.data,
            "token": access_token,
            "refresh": str(refresh)
        }
        
        # Devolvemos la respuesta 201 Created
        
        return Response(
            data, 
            status=status.HTTP_201_CREATED, 
        )
        

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(stock__gte=1)
    serializer_class = ProductSerializer

    # O, para empezar, permite todo:
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        Sobrescribimos este método para asignar el 'owner'
        automáticamente al usuario que hace la petición.
        """
        serializer.save(owner=self.request.user)
        

class MyProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint que muestra, edita y borra
    SOLO los productos del usuario actualmente autenticado.
    """
    serializer_class = ProductSerializer
    
    # CRÍTICO: Solo usuarios autenticados pueden ver esto.
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Esta función mágica filtra el queryset.
        Asegura que el usuario solo vea SUS PROPIOS productos.
        """
        # Filtra los productos por el usuario que hace la petición
        return Product.objects.filter(owner=self.request.user).order_by('-created_at')


class UserProfileView(APIView):
    # La magia está aquí: solo usuarios autenticados (con token) pueden acceder
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user es automáticamente el usuario asociado con el token
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    

class CrearCompraView(APIView):
    """
    Vista para crear una nueva compra (orden).
    """
    permission_classes = [IsAuthenticated] # ¡Solo usuarios logueados pueden comprar!
    
    @transaction.atomic # <-- ¡Muy importante!
    def post(self, request, *args, **kwargs):
        """
        Maneja la petición POST de React.
        """
        # 1. Obtener datos de React
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        
        # 2. Validar datos
        if not product_id or not quantity:
            return Response({"message": "Faltan product_id o quantity"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
            if quantity <= 0:
                raise ValueError()
        except ValueError:
            return Response({"message": "La cantidad debe ser un número positivo"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Lógica de la compra
        try:
            # Busca el producto en la BD
            product = Product.objects.get(id=product_id)
            
            # 4. ¡La verificación de Stock!
            if product.stock < quantity:
                # Si no hay stock, devuelve un error claro
                return Response(
                    {"message": f"Stock insuficiente. Solo quedan {product.stock} unidades."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 5. Si hay stock, se procede con la transacción
            
            # Restar del stock
            product.stock -= quantity
            product.save()
            
            # Calcular precio
            precio_final = product.price * quantity
            
            # Crear el registro de la compra
            compra = Compra.objects.create(
                usuario=request.user,       # El usuario que hace la petición
                product=product,
                cantidad=quantity,
                precio_total=precio_final
            )
            
            # 6. Devolver respuesta de éxito
            serializer = CompraSerializer(compra) # Usamos el serializer que ya tenías
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Product.DoesNotExist:
            return Response({"message": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Si algo más falla, la transacción @transaction.atomic lo revertirá todo
            return Response({"message": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
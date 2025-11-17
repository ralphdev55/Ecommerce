from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Caramelo, Compra, Product
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

# Importa tu modelo

class CarameloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caramelo
        # Define los campos que quieres exponer en tu API
        fields = ['id', 'nombre', 'marca', 'tipo']
        

class CompraSerializer(serializers.ModelSerializer):
    
    # 1. Obtiene 'productName' desde el modelo Product relacionado
    # Cambiamos 'caramelo.nombre' por 'product.name'
    productName = serializers.CharField(source='product.name', read_only=True)
    
    # 2. Obtiene 'imageUrl' desde el modelo Product relacionado
    # Cambiamos 'caramelo.imagen_url' por 'product.image'
    # (Asumiendo que tu modelo Product tiene un campo 'image')
    imageUrl = serializers.ImageField(source='product.image', read_only=True, allow_null=True)
    
    # 3. Formatea la fecha
    purchaseDate = serializers.DateTimeField(source='fecha_compra', format="%d de %B de %Y", read_only=True)

    class Meta:
        model = Compra
        # Lista de campos COMPLETA Y CORRECTA
        fields = [
            'id', 
            'usuario', 
            
            # El ID del producto (si React lo necesita)
            'product', 
            
            # Los campos del modelo Compra
            'cantidad', 
            'precio_total', 
            'fecha_compra', 
            
            # Los campos personalizados que acabamos de declarar
            'productName',
            'imageUrl',
            'purchaseDate'
        ]

        # (Opcional) Si no quieres que 'usuario' y 'product' se puedan escribir,
        # puedes añadirlos a read_only_fields
        read_only_fields = ('usuario', 'product', 'fecha_compra')
        
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Ya existe un usuario con este email.")]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este nombre de usuario ya está en uso.")]
    )
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    first_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name')

    def create(self, validated_data):
        """
        Sobrescribimos el método create para usar create_user.
        Esto asegura que la contraseña se guarde hasheada.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'firstName']
    
class ProductSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['owner']

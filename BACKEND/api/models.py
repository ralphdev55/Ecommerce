from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Caramelo(models.Model):
    # Campo para el nombre (texto corto)
    nombre = models.CharField(max_length=100)
    marca = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)
    def __str__(self):
        return self.nombre
    
class Compra(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)    
    cantidad = models.PositiveIntegerField(default=1)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_compra = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.cantidad}x {self.caramelo.nombre} por {self.usuario.username}'
    
    
class Product(models.Model):
    owner = models.ForeignKey(User, related_name='products', on_delete=models.CASCADE)
    
    name = models.CharField(max_length=255, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    stock = models.IntegerField(default=0, verbose_name="Stock")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Imagen")
    category = models.CharField(max_length=100, default='General', blank=True, verbose_name="Categoría")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.name
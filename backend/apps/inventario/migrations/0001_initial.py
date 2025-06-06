# Generated by Django 5.1.6 on 2025-05-30 16:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('productos', '0002_delete_inventario'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inventario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField()),
                ('tipo_movimiento', models.CharField(choices=[('ENT', 'Entrada'), ('SAL', 'Salida')], max_length=3)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('observaciones', models.TextField(blank=True)),
                ('proveedor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='productos.proveedor')),
                ('refaccion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos', to='productos.refaccion')),
            ],
            options={
                'verbose_name': 'Movimiento de Inventario',
                'verbose_name_plural': 'Movimientos de Inventario',
                'ordering': ['-fecha'],
            },
        ),
    ]

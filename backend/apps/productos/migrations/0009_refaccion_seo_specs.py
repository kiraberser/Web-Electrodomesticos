from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0008_refaccion_ubicacion_estante'),
    ]

    operations = [
        migrations.AddField(
            model_name='refaccion',
            name='slug',
            field=models.SlugField(
                blank=True,
                default=None,
                help_text='URL amigable para SEO. Se auto-genera desde el nombre si se deja vacío.',
                max_length=220,
                null=True,
                unique=True,
            ),
        ),
        migrations.AddField(
            model_name='refaccion',
            name='titulo_seo',
            field=models.CharField(
                blank=True,
                help_text='Título SEO (máx. 60 caracteres). Si se omite, se usa el nombre.',
                max_length=60,
            ),
        ),
        migrations.AddField(
            model_name='refaccion',
            name='descripcion_seo',
            field=models.CharField(
                blank=True,
                help_text='Meta descripción para buscadores (máx. 160 caracteres).',
                max_length=160,
            ),
        ),
        migrations.AddField(
            model_name='refaccion',
            name='descripcion_corta',
            field=models.CharField(
                blank=True,
                help_text='Descripción breve para cards y listados.',
                max_length=300,
            ),
        ),
        migrations.AddField(
            model_name='refaccion',
            name='precio_tachado',
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text='Precio original antes de descuento (se muestra tachado en el frontend).',
                max_digits=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='refaccion',
            name='specs',
            field=models.JSONField(
                blank=True,
                default=list,
                help_text='Especificaciones técnicas: lista de objetos {"clave": "...", "valor": "..."}.',
            ),
        ),
    ]

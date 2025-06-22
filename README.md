💼 Ecommerce Vega

Sistema integral para la gestión de inventario, ventas y servicios de refacciones y electrodomésticos.

📁 Estructura del Proyecto

ecommerce-vega/
├── backend/
│   ├── apps/
│   │   ├── inventario/    # Gestión de movimientos de inventario
│   │   ├── productos/     # Refacciones, categorías, marcas y proveedores
│   │   ├── servicios/     # Registro de servicios y reparaciones
│   │   ├── bodega/        # Administración de bodegas físicas
│   │   └── ...            # Otras apps internas
│   ├── config/            # Configuración global del proyecto Django
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables de React
│   │   ├── pages/         # Vistas principales de la aplicación
│   │   ├── services/      # Lógica para consumir la API
│   │   ├── App.js         # Componente principal
│   │   └── index.js       # Punto de entrada de la app
│   ├── public/            # Archivos estáticos públicos
│   ├── package.json       # Dependencias y scripts de frontend
│   └── ...              # Otros archivos de configuración
└── README.md

🚀 Funcionalidades Principales

🔄 Inventario: Control de entradas y salidas, actualización automática por ventas y servicios.

👷️ Productos: Gestión de refacciones, marcas, categorías y proveedores.

🧾 Ventas: Generación de notas de venta, validación de stock, historial de ventas.

🔧 Servicios: Registro y seguimiento de servicios técnicos, reparaciones, entregas y estados.

🏢 Bodega: Administración de múltiples bodegas para control físico de existencias.

⚙️ Tecnologías Utilizadas

Categoría

Tecnología

Backend

Django, Django REST Framework

Frontend

React (o especificar otra)

Base de datos

PostgreSQL (o SQLite/MySQL)

API

RESTful APIs

🧰 Instalación y Configuración

1. Clonar el repositorio

git clone https://github.com/kiraberser/ecommerce-vega.git
cd ecommerce-vega

2. Configurar el entorno backend

cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

3. Migrar la base de datos

python manage.py makemigrations
python manage.py migrate

4. Crear superusuario (opcional)

python manage.py createsuperuser

5. Levantar el servidor

python manage.py runserver

6. Ejecutar frontend (si aplica)

cd ../frontend
npm install
npm run dev

🥪 Estado del proyecto

🟢 En desarrollo activo🗕️ Última actualización: junio 2025

✨ Contribuciones

¡Pull requests bienvenidos! Para sugerencias, errores o mejoras, abre un issue o contacta directamente.

📄 Licencia

Este proyecto está licenciado bajo MIT.
# AbrilTienda - Proyecto inicial
Proyecto minimal para ABRILTIENDA (Node.js + Express backend, React frontend).
- Usuario admin: admin
- Contraseña: Dosmil25
- Moneda: ARS ($)
- Colores: rosa/salmón, beige, blanco (reemplazar variables CSS)

## Contenido del ZIP
- backend/: API en Node.js (Express) con endpoints básicos (auth, products, sales)
- frontend/: App React (pages: Login, Dashboard, Products, POS)
- docker-compose.yml: para levantar servicios localmente (Postgres, backend, frontend)
- sql/: esquema inicial y seed para admin

## Pasos rápidos (local)
1. Asegurate de tener Docker instalado.
2. Copiar `.env.example` a `backend/.env` y ajustar variables (DB_PASSWORD, JWT_SECRET).
3. Desde este directorio ejecutar: `docker-compose up --build`
4. Ejecutar el seed para crear admin:
   - Abrir shell en el contenedor backend o ejecutar localmente `node backend/src/seed_admin.js`
5. Acceder a frontend en: http://localhost:3000
6. Login admin: admin / Dosmil25

## Notas
- Reemplazar `frontend/public/logo.png` por el logo real (PNG).
- Integración con Render: subir repo a GitHub y conectar a Render o usar el Dockerfile.
- Esto es un esqueleto inicial. Podemos expandir funcionalidades (imprimir ticket, bwip-js para barcode, etc.).

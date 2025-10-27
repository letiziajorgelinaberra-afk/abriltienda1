AbrilTienda - Proyecto completo listo para desplegar en Render
------------------------------------------------------------

Instrucciones rápidas:
1) Descomprimir este ZIP.
2) Subir el contenido a tu repositorio GitHub (ej: letiziajorgelinaberra-afk/abriltienda1).
3) En Render crear un Web Service conectado al repo (o usar Blueprint).
   - Si Render usa Docker, el archivo Dockerfile en la raíz será usado.
   - Configurar la variable de entorno MONGO_URI con tu cadena de conexión.
4) Ejecutar seed para crear usuario admin (opcional si lo hiciste previamente):
   - node backend/src/seed_admin.js (desde el contenedor o local apuntando a la DB).
5) Acceder al frontend en la URL que Render asigne (ej: https://abriltienda.onrender.com).

Credenciales por defecto:
- Admin email: admin@abriltienda.local
- Admin password: Dosmil25

Notas de seguridad:
- Cambiá la contraseña después del primer acceso.
- No compartas públicamente la variable MONGO_URI.

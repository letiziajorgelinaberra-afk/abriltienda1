# Imagen base
FROM node:18

# Crea carpeta de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto (Render usa 10000)
EXPOSE 10000

# Comando para iniciar la app
CMD ["npm", "start"]

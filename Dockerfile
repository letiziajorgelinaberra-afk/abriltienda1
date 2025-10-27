FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
RUN npm run build || true

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/backend /app/backend
RUN mkdir -p /app/backend/public
COPY --from=frontend-build /app/frontend/build /app/backend/public
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 10000
CMD ["node","src/index.js"]

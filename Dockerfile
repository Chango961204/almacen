FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ENV VITE_API_URL=/api
RUN npm run build

FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production

CMD ["sh", "-c", "case \"$DATABASE_URL\" in mysql://*) echo '[DB] DATABASE_URL OK: comienza con mysql://' ;; *) echo '[DB] ERROR: DATABASE_URL no comienza con mysql://. Revisa que el valor no lleve comillas, espacios ni el prefijo DATABASE_URL='; exit 1 ;; esac && npx prisma migrate deploy && node prisma/seed.js && node src/server.js"]
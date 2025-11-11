# ---- Estágio 1: Build (O "Sujo") ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# ---- Estágio 2: Produção (O "Limpo") ----
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copia o código-fonte
COPY --from=build /app/src ./src
COPY --from=build /app/.env ./
COPY --from=build /app/package.json ./package.json

# --- A CORREÇÃO FINAL ESTÁ AQUI ---
# Copia o Schema E o Cliente Gerado do Estágio 1
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001
CMD [ "npm", "start" ]
# ---- Estágio 1: Build ----
FROM node:20-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia código-fonte e schema do Prisma
COPY . .

# Gera Prisma Client no estágio de build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# ---- Estágio 2: Produção ----
FROM node:20-alpine
WORKDIR /app

# Copia tudo, inclusive node_modules e schema.prisma
COPY --from=build /app . 

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# 🚀 Garante que Prisma Client será gerado no runtime se necessário
RUN echo '#!/bin/sh\nnpx prisma generate --schema=./prisma/schema.prisma && node src/server.js' > /start.sh \
    && chmod +x /start.sh

EXPOSE 3001
CMD ["/bin/sh", "/start.sh"]

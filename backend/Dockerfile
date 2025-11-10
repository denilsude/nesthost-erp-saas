# ---- Estágio 1: Build (Instala deps) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Instala TODAS as dependências
RUN npm install
COPY . .

# --- CORREÇÃO ESTÁ AQUI ---
# 1. Aceita o DATABASE_URL como um argumento de build
ARG DATABASE_URL
# 2. Expõe esse argumento como uma ENV *apenas* para o npx prisma generate
ENV DATABASE_URL=$DATABASE_URL

# Constrói o cliente Prisma baseado no schema.prisma
RUN npx prisma generate

# Se você usar TypeScript, descomente a linha abaixo:
# RUN npm run build

# ---- Estágio 2: Produção (Imagem final otimizada) ----
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
# Instala SOMENTE dependências de produção
RUN npm ci --omit=dev

# Expõe a porta 3001 (definida no .env)
EXPOSE 3001
# Comando para iniciar o servidor
CMD [ "npm", "start" ]
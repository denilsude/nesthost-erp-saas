# Estágio 1: Build (Instala deps, compila TS se necessário)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Se você usar TypeScript, descomente a linha abaixo:
# RUN npm run build

# Estágio 2: Produção (Otimizado)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
# Instala SOMENTE dependências de produção
RUN npm ci --omit=dev 

# Expõe a porta que sua API vai rodar (definida no .env)
EXPOSE 3001
# Comando para iniciar o servidor
CMD ["node", "server.js"] # (Ajuste 'server.js' se necessário)
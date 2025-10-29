# ---- Estágio 1: Build (Construir o React/Vite) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O 'npm run build' do Vite/React cria a pasta 'dist'
RUN npm run build 

# ---- Estágio 2: Produção (Servir com Nginx) ----
FROM nginx:stable-alpine
# Copia os arquivos estáticos do React (da pasta 'dist')
COPY --from=build /app/dist /usr/share/nginx/html
# Copia o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
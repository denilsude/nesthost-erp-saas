# Estágio 1: Build (Construir o React)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
# (Se sua pasta de build for 'build', mude o 'dist' abaixo para 'build')

# Estágio 2: Produção (Servir com Nginx)
FROM nginx:stable-alpine
# Copia os arquivos estáticos do React (da pasta 'dist')
COPY --from=build /app/dist /usr/share/nginx/html
# Copia o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
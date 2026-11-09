#Imagen de nginx ya instalado
FROM nginx:alpine
#Copiar web a la carpeta a la carpeta nginx
COPY . /usr/share/nginx/html
#Escucha el puerto 80
EXPOSE 80
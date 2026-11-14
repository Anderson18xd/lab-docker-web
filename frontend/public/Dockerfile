FROM nginx:alpine

# Borramos la configuración por defecto de Nginx y ponemos la nuestra
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos nuestros archivos estáticos (HTML, CSS, JS) a la carpeta de Nginx
COPY public/ /usr/share/nginx/html/

EXPOSE 80
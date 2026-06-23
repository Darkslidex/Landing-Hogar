FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Portal
COPY index.html app.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Landings
COPY aire/ /usr/share/nginx/html/aire/
COPY electricidad/ /usr/share/nginx/html/electricidad/
COPY refacciones/ /usr/share/nginx/html/refacciones/

EXPOSE 80

# Coolify/Nixpacks inyectan PORT (ej. 3000). nginx se adapta a ${PORT:-80}.
CMD ["/bin/sh", "-c", "sed -i \"s/listen 80;/listen ${PORT:-80};/\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

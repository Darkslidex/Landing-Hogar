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

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

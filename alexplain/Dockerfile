FROM nginx:alpine

# Copy all static files
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js
COPY partials/ /usr/share/nginx/html/partials/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

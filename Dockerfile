# Legt Image für den Frontend-Container an
# Das Image basiert auf dem nginx-Image
FROM nginx:alpine

# Kopiert die Dateien aus dem dist-Ordner in den Nginx-Ordner
# Der dist-Ordner wird im Build-Prozess erstellt
COPY ./dist /usr/share/nginx/html

# Der Nginx-Server lauscht auf Port 80
EXPOSE 80
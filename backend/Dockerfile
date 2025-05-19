# --- STAGE 1: BUILD Stage ---
FROM node:lts-alpine AS builder

RUN apk add --no-cache curl

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# package.json und package-lock.json ins Arbeitsverzeichnis kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm ci --production

# Restlichen Anwendungscode ins Arbeitsverzeichnis kopieren
COPY . .

# Port definieren, auf dem die API läuft
EXPOSE 3000

# Startkommando für die Anwendung definieren
# shell command instead of exec form
# CMD sh -c "npm start"
CMD ["sh", "-c", "npm start"]


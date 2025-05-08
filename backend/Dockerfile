# --- STAGE 1: BUILD Stage ---
    FROM node:lts-alpine AS builder

    # Arbeitsverzeichnis im Container setzen
    WORKDIR /app
    
    # package.json und package-lock.json ins Arbeitsverzeichnis kopieren
    COPY package*.json ./
    
    # Abhängigkeiten installieren
    RUN npm ci
    
    # Restlichen Anwendungscode ins Arbeitsverzeichnis kopieren
    COPY . .
    
    # --- STAGE 2: PRODUCTION Stage ---
    FROM node:lts-alpine
    
    # Arbeitsverzeichnis setzen
    WORKDIR /app
    
    # Notwendige Abhängigkeiten aus dem Builder-Image kopieren
    COPY --from=builder /app/node_modules ./node_modules
    
    # Anwendungscode aus dem Builder-Image kopieren
    COPY --from=builder /app .
    
    # Port definieren, auf dem die API läuft
    EXPOSE 3000
    
    # Startkommando für die Anwendung definieren
    CMD ["npm", "start"]
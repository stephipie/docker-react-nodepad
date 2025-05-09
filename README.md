# Full-Stack Anwendung mit React, Node.js, Persistenz und Reverse Proxy (Docker)

Dieses Repository enthält eine containerisierte Full-Stack-Anwendung, bestehend aus einem React-Frontend und einem Node.js/Express API-Backend mit Dateipersistenz. Die Kommunikation zwischen Frontend und Backend erfolgt über ein dediziertes Docker-Netzwerk und ein Nginx Reverse Proxy.

## Projektstruktur

Das Projekt ist in folgende Hauptverzeichnisse unterteilt:

* `frontend/`: Enthält den Quellcode für die React-Anwendung sowie die Dockerfile und die Nginx-Konfigurationsdatei.
* `backend/`: Enthält den Quellcode für die Node.js/Express API und das Dockerfile für das Backend.

Im Wurzelverzeichnis befinden sich diese `README.md`-Datei, `.gitignore` und `.dockerignore`.

## Backend-Persistenz

Das Node.js/Express Backend verwendet eine einfache Dateipersistenz, um Daten zu speichern. Die API speichert alle Notizen in einer JSON-Datei (`notes.json`) innerhalb des Container-Dateisystems unter `/app/data/`. Um diese Daten auch nach dem Stoppen und Neustarten des Backend-Containers zu erhalten, wird ein Docker Volume (`my-backend-data`) an diesen Pfad im Container gemountet. Dadurch bleiben die Daten auf dem Host-System gespeichert und sind auch nach einem Neustart des Containers wieder verfügbar.

## Nginx Reverse Proxy Konfiguration

Das Frontend wird über einen Nginx Webserver ausgeliefert, der gleichzeitig als Reverse Proxy für die API-Anfragen dient. Die Nginx-Konfiguration befindet sich im `frontend/` Verzeichnis in der Datei `nginx.conf` (oder `default.conf`).

Die Konfiguration sieht wie folgt aus:

```nginx
server {
    listen 80;
    server_name _; # oder Domain falls vorhanden

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-service:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Der location / Block dient dazu, die statischen Dateien des gebauten React-Frontends auszuliefern.
Der location /api/ Block konfiguriert Nginx als Reverse Proxy für alle Anfragen, die mit /api/ beginnen. Die proxy_pass Direktive leitet diese Anfragen an http://backend-service:3000/api/ weiter. backend-service ist der interne Hostname des Backend-Containers im Docker-Netzwerk, der von Docker DNS automatisch in die entsprechende IP-Adresse aufgelöst wird. Die proxy_set_header-Direktiven stellen sicher, dass wichtige Informationen über die ursprüngliche Anfrage an das Backend weitergeleitet werden.
Dadurch sendet das Frontend API-Aufrufe an /api/... auf dem eigenen Server (Port 80 des Frontend-Containers), und Nginx leitet diese Anfragen transparent an das Backend weiter, das auf Port 3000 innerhalb des Docker-Netzwerks lauscht.

Docker Netzwerk erstellen und Container starten
Folge diesen Schritten, um das Docker-Netzwerk zu erstellen und die Container mit dem Reverse Proxy Muster zu starten:

Docker Netzwerk erstellen (falls noch nicht vorhanden):

```Bash

docker network create my-app-network
```
Backend Image bauen:

```Bash

cd backend
docker build -t my-backend-api:network-proxy .
cd ..
```
Backend Container starten:

```Bash

docker run -d --name backend-service --network my-app-network -p 8081:3000 -v my-backend-data:/app/data my-backend-api:network-proxy
```
--name backend-service: Gibt dem Backend-Container den Namen backend-service, der in der Nginx-Konfiguration verwendet wird.
--network my-app-network: Verbindet den Container mit dem erstellten Docker-Netzwerk.
-p 8081:3000: Mappt den Host-Port 8081 auf den Container-Port 3000 (optional für Debugging).
-v my-backend-data:/app/data: Mountet das Volume für die Persistenz.
Frontend Image bauen:

```Bash

cd frontend
docker build --build-arg VITE_API_URL='/api' -t my-frontend-app:network-proxy .
cd ..
```
--build-arg VITE_API_URL=/api: Setzt die VITE_API_URL Build-Variable im Frontend auf /api, den Pfad, unter dem Nginx die API-Anfragen entgegennimmt.

Frontend Container starten:

```Bash

docker run -d --name frontend-app --network my-app-network -p 8080:80 my-frontend-app:network-proxy`
```

--name frontend-app: Gibt dem Frontend-Container den Namen frontend-app.
--network my-app-network: Verbindet den Container mit demselben Docker-Netzwerk wie das Backend.
-p 8080:80: Mappt den Host-Port 8080 auf den Container-Port 80 (Nginx).
Nachdem diese Schritte ausgeführt wurden, ist die Anwendung unter ``` http://localhost:8080 ```im Browser erreichbar. API-Aufrufe vom Frontend an /api/... werden von Nginx an das Backend weitergeleitet. Die Daten des Backends bleiben dank des Docker Volumes auch bei Neustarts des Backend-Containers erhalten.

## SQL Recap: Datenmodell und grundlegende Abfragen

Im Backend-Verzeichnis dieses Projekts wurde ein theoretisches relationales Datenmodell für die "Notes"-Datenstruktur entworfen und grundlegende SQL-Abfragen (CRUD) dafür formuliert. Die Details zum Datenmodell und den Abfragen finden Sie in der Datei `sql-recap.md` im Backend-Verzeichnis.

## EINBINDEN VON DOCKER COMPOSE

Erstelle im Wurzelverzeichnis eine docker-compose.yml

```Bash
touch docker-compose.yml #Code kannst Du der docker-compose.yml entnehmen
```
1. **Umgebungsvariablen konfigurieren**

    * Erstelle eine `.env`-Datei im Wurzelverzeichnis des Projekts.
    * Füge die folgenden Umgebungsvariablen hinzu und passe sie nach Bedarf an:

        ```
        POSTGRES_USER=dein_benutzername_bsp
        POSTGRES_PASSWORD=dein_passwort_bsp
        POSTGRES_DB=notizbuch_bsp
        ```

2.  **Anwendung mit Docker Compose starten**

    ```bash
    docker compose up --build -d
    ```

    Dieser Befehl baut die Docker-Images für den Frontend-, Backend- und Datenbank-Service und startet die Container im Hintergrund.

3.  **Anwendung aufrufen**

    Öffne deinen Webbrowser und gehe zu `http://localhost:8080`, um die Anwendung aufzurufen


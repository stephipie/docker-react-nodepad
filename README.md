# Docker React Notepad - Robuste Fullstack-Anwendung

## Stack-Stabilität und Fehlerbehandlung

### Verbesserung der Robustheit

Es wurden folgende Schritte unternommen, um die Stabilität und Fehlerbehandlung zu verbessern:

1. **Implementierung von Healthchecks**
   - Backend prüft aktiv die Datenbankverbindung
   - Frontend hat einen einfachen Healthcheck-Endpunkt
   - Docker Compose wartet auf "healthy" Status der Services

2. **Fehlerbehandlung im Backend**
   - Validierung von Anfragen (z.B. Required Fields)
   - Try-Catch Blöcke für Datenbankoperationen
   - Spezifische HTTP-Statuscodes:
     - 400: Ungültige Anfragen (z.B. fehlende Pflichtfelder)
     - 404: Ressource nicht gefunden
     - 500: Interne Serverfehler

3. **Frontend Resilienz**
   - Fehlerstate für Benutzerrückmeldungen
   - Graceful Degradation bei API-Fehlern
   - Benutzerfreundliche Fehlermeldungen

### Konkrete Fehlerbeispiele

#### Backend-Fehlerbehandlung (DB-Verbindung verloren):
```javascript
// Beispiel aus db.js
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

// Healthcheck implementiert DB-Verbindungstest
export async function testDbConnection() {
  try {
    const client = await pool.connect();
    logger.info('Database connection pool connected successfully!');
    client.release();
  } catch (err) {
    logger.error('Database connection pool initial connection error:', err);
    throw err;
  }
}
```

#### Frontend-Fehlerbehandlung:
```jsx
// Beispiel aus App.jsx
const [error, setError] = useState(null);

// Fehlerbehandlung beim Laden der Notizen
try {
  const response = await fetch(`${apiUrl}/notes`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  setNotes(data);
} catch (error) {
  setError(error);
  console.error('Fehler beim Laden der Notizen:', error);
}

// Anzeige der Fehlermeldung im UI
{error && <p className="error">{error.message}</p>}
```

### Healthchecks und Logging

#### Aussagekräftige Healthchecks
- **Backend**: Prüft aktiv die DB-Verbindung statt nur Server-Erreichbarkeit
- **Frontend**: Stellt sicher, dass der Nginx-Server läuft
- **Datenbank**: Verwendet pg_isready für Verfügbarkeitsprüfung

#### Logging-Strategie
- Strukturiertes Logging mit Winston
- Verschiedene Log-Level (info, warn, error)
- Zeitstempel und Kontext in Log-Nachrichten
- Hilfreiche Log-Beispiele:
  ```
  [INFO] Database connection pool connected successfully!
  [ERROR] Database connection pool initial connection error: ...
  ```

## Starten und Testen des Stacks

### Voraussetzungen
- Docker und Docker Compose
- Node.js (für lokale Entwicklung)

### Start des Stacks
1. Repository klonen
2. .env Datei erstellen:
   ```env
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=notes_db
   ```
3. Stack starten:
   ```bash
   docker compose up --build -d
   ```

### Testen der Robustheit
1. **DB-Ausfall simulieren**:
   ```bash
   docker compose stop database
   ```
   - Frontend zeigt Fehlermeldung
   - Backend loggt Verbindungsfehler
   - Healthcheck schlägt fehlt

2. **DB wiederherstellen**:
   ```bash
   docker compose start database
   ```
   - System erholt sich automatisch
   - Healthchecks werden wieder grün

### Logs einsehen
```bash
# Alle Logs
docker compose logs

# Service-spezifische Logs
docker compose logs backend
docker compose logs frontend
docker compose logs database
```

## Bedeutung für Kubernetes-Deployment

Die implementierten Maßnahmen sind essentiell für den Kubernetes-Betrieb:

1. **Healthchecks**
   - K8s nutzt diese für Readiness/Liveness Prob´s
   - Ermöglicht automatisches Restart bei Problemen

2. **Fehlerbehandlung**
   - Verhindert Cascading Failures
   - Ermöglicht graceful Degradation

3. **Logging**
   - Erleichtert Debugging in verteilten Systemen
   - Ermöglicht Monitoring und Alerting

## Code-Qualität und Wartbarkeit

Sauberer Code und gute Struktur sind entscheidend für:
- Schnelles Debugging
- Einfache Wartung
- Effektive Teamarbeit

Unsere Maßnahmen:
- Klare Komponenten-Struktur
- Konsistente Fehlerbehandlung
- Aussagekräftiges Logging
- Separation of Concerns

## Screenshots


1. Laufender Anwendung

![Running Application](/screenshots/running-app.png)

![Running Application](/screenshots/logs-running-app.png)

2. Frontend mit Fehlermeldung bei DB-Ausfall

![Error State](/screenshots/db-down-status.png)

![Log Message DB](/screenshots/logs-of-db-shutdown-restart.png)

![Restart DB State](/screenshots/after-restart-db.png)

3. Docker Compose Status mit "healthy" Services

![Healthy Services](/screenshots/compose-up-build-d.png)

![Healthy Services](/screenshots/compose-ps.png)

Aktueller Zustand des Stacks
Mein Fullstack-Projekt ist eine robuste Anwendung, die für die Orchestrierung bereit ist. Sie ist erfolgreich auf einem Docker Swarm Cluster mit spezifischer Node-Platzierung deployed. Dies ermöglicht eine skalierbare und fehlertolerante Ausführung der Anwendung.

## Einrichtung des Swarms und Deployment des Stacks

Die folgenden Schritte beschreiben, wie man den Swarm einrichtet und den Stack deployd:

### Multipass VMs vorbereiten:

Stellen Sie sicher, dass Multipass installiert ist.

Erstellen Sie vier Multipass VMs (Manager und drei Worker):

```shell
multipass launch --name manager --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker1 --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker2 --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker3 --cpus 2 --memory 2G --cloud-init cloud-init.yml
```
oder erstellen Sie ein Skript

```shell

./setup-multipass.sh

```

### Docker Swarm einrichten:

Melden Sie sich beim Manager-Knoten an:

```shell

multipass shell manager

```

### Initialisieren Sie den Swarm auf dem Manager-Knoten:

```shell
docker swarm init

```

Melden Sie sich bei den Worker-Knoten an und treten Sie dem Swarm bei. Verwenden Sie den Befehl, der von docker swarm init ausgegeben wird:

```shell
multipass shell worker1

docker swarm join --token <SWARM_TOKEN> <MANAGER_IP>:2377
exit

multipass shell worker2

docker swarm join --token <SWARM_TOKEN> <MANAGER_IP>:2377
exit

multipass shell worker3

docker swarm join --token <SWARM_TOKEN> <MANAGER_IP>:2377
exit
```

(<SWARM_TOKEN> und <MANAGER_IP> durch die entsprechenden Werte ersetzen)

### Worker Nodes labeln:

Melden Sie sich beim Manager-Knoten an:

```shell
multipass shell manager

```

Labeln Sie die Worker-Nodes:

```shell
docker node update --label-add role=frontend worker1
docker node update --label-add role=backend worker2
docker node update --label-add role=database worker3

```

Überprüfen Sie die Labels:

```shell
docker node ls
docker node inspect worker1 --pretty
docker node inspect worker2 --pretty
docker node inspect worker3 --pretty
```

### Swarm Stack Datei erstellen:

Erstellen Sie eine docker-stack.yml-Datei mit folgendem Inhalt (oder passen Sie Ihre bestehende docker-compose.yml an):

```yaml
version: '3.8'
services:
    frontend:
        image: dein-dockerhub-user/mein-frontend:latest
        deploy:
            placement:
                constraints:
                    - node.labels.role == frontend
            replicas: 2
        ports:
            - "8080:80"
        networks:
            - app-network
        depends_on:
            - backend

    backend:
        image: dein-dockerhub-user/mein-backend:latest
        deploy:
            placement:
                constraints:
                    - node.labels.role == backend
            replicas: 2
        environment:
            - PORT=3000
            - FEATURE_HEALTH=true
            - DB_HOST=app_database
            - DB_USER=postgres
            - DB_PASSWORD=postgres
            - DB_PORT=5432
            - DB_NAME=items-db
        expose:
            - 3000
        networks:
            - app-network
        depends_on:
            - database

    database:
        image: dein-dockerhub-user/postgres:latest
        deploy:
            placement:
                constraints:
                    - node.labels.role == database
            replicas: 1
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: items-db
        volumes:
            - pgdata:/var/lib/postgresql/data
        networks:
            - app-network

networks:
    app-network:
        driver: overlay

volumes:
    pgdata:
        driver: local
```

(Ersetzen Sie dein-dockerhub-user/mein-frontend:latest und dein-dockerhub-user/mein-backend:latest durch Ihre tatsächlichen Docker Hub Image-Namen.)

### Docker Images für den Swarm vorbereiten (Build & Push):

Bauen Sie die Docker-Images für Backend und Frontend:

```bash

docker build -t dein-dockerhub-user/backend-app:latest ./backend
docker build -t frontend-app --build-arg VITE_API_URL=api ./frontend
docker tag frontend-app:latest dein-dockerhub-user/frontend-app
docker build -t dein-dockerhub-user/postgres:latest ./database

```

Melden Sie sich bei Docker Hub an:

```bash
docker login

```

Pushen Sie die Images zu Docker Hub:

```bash

docker push dein-dockerhub-user/backend-app:latest
docker push dein-dockerhub-user/frontend-app:latest
docker push dein-dockerhub-user/postgres:latest

```

### Stack deployen:

Kopieren Sie die docker-stack.yml auf den Swarm Manager.

```bash

multipass transfer docker-stack.yml manager:.

```

Deployen Sie den Stack:

Multipass Manager VM

```shell

docker stack deploy -c docker-stack.yml app

```

### Deployment überprüfen:

Überprüfen Sie den Status der Services:

```shell

docker stack services app

```

Überprüfen Sie den Status der Tasks:

```shell

docker service ps app_frontend
docker service ps app_backend
docker service ps app_database

```

Greifen Sie auf die Anwendung zu, um die E2E-Funktionalität zu testen (siehe Abschnitt "Anwendung testen" unten).

## Anwendung testen

### IP-Adresse des Worker-Nodes ermitteln:

Ermitteln Sie die IP-Adresse des Worker-Nodes, auf dem das Frontend läuft (in diesem Fall worker1). Sie können dies mit multipass list oder durch Abrufen der IP innerhalb der VM tun.

### Anwendung im Browser aufrufen:

Öffnen Sie einen Webbrowser und navigieren Sie zu [http://<WORKER1_IP>:8080].

### E2E CRUD testen:

Führen Sie alle CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) durch, um sicherzustellen, dass die Anwendung wie erwartet funktioniert.

## Nachweis der erfolgreichen Bereitstellung

Die folgenden Screenshots belegen die erfolgreiche Bereitstellung:

### Laufende Anwendung:

[Ein Screenshot der laufenden Anwendung, der die E2E-CRUD-Funktionalität demonstriert]

![Running Application](/screenshots/Screenshot%202025-05-19%20174615.png)

### Korrekte Platzierung der Dienste:

[Ein Screenshot der Ausgabe von docker service ps <servicename> oder docker stack services <stackname>, der die korrekte Platzierung der Dienste auf den gelabelten Nodes und den Healthcheck-Status zeigt]

![Docker Service](/screenshots/Screenshot%202025-05-19%20174631.png)

### Knoten-Labels:

[Ein Screenshot der Ausgabe von docker node ls mit den gesetzten Labels]

![Docker Node](/screenshots/dockernode.png)

### Logs prüfen

Verwenden Sie die folgenden Befehle, um die Logs der Dienste zu überprüfen:

```shell

docker service logs app_frontend
docker service logs app_backend
docker service logs app_database

```

Alternativ können Sie sich bei den Worker-VMs anmelden und die Container-Logs direkt abrufen:

```shell
multipass shell worker1
docker logs <frontend_container_id>
exit
multipass shell worker2
docker logs <backend_container_id>
exit
multipass shell worker3
docker logs <database_container_id>
exit
```

.gitignore und .dockerignore
Stellen Sie sicher, dass Ihr Repository korrekte .gitignore- und .dockerignore-Dateien enthält, um unnötige Dateien von der Versionskontrolle und dem Image-Build auszuschließen. 

### Tipp beim Debugging

Überprüfen Sie auf den einzelnen Knoten die Version von Docker, mit 

```bash

docker version

```
falls hier eine Fehlermeldung kommt nochmal den Befehl aus der cloud-init.yml erneut durchführen

```bash

sudo usermod -aG docker $USER

exit

open shell

docker version

```

### Fehlerquelle beim build des Frontend Images

Mit Git - Bash unter Windows in VS - Code am Besten folgenden Befehl nutzen und den Pfad in der App.jsx anpassen

```bash

docker build -t frontend-app --build-arg VITE_API_URL=api ./frontend  

```

App.jsx
```bash

await fetch(`/${apiUrl}/notes`);

```

Ansonsten funktioniert folgender build - Befehl

```bash

docker build -t frontend-app --build-arg VITE_API_URL="/api" ./frontend 

```
App.jsx
```bash

await fetch(`${apiUrl}/notes`);

```

# Kubernetes

## Aufgabe: Einführung in Kubernetes: Lokales Cluster aufsetzen & die Grundlagen überprüfen

## Ziel:
Nach der theoretischen Einführung in Kubernetes wird der erste praktische Schritt gemacht: das Aufsetzen eines lokalen Kubernetes Clusters und die Verifikation, dass kubectl erfolgreich mit dem Cluster kommunizieren kann. Ziel ist es, die im Theorieteil behandelten Konzepte (Was ist ein Cluster, Control Plane, Worker Node, kubectl als CLI-Tool) praktisch zu überprüfen, ohne bereits Workloads (wie Pods oder Deployments) zu deployen.

## Lernziele dieser Aufgabe:

Ein grundlegendes Verständnis dafür entwickeln, wie ein lokales Kubernetes Cluster gestartet wird.
Erfolgreich ein lokales Cluster aufsetzen (mit Docker Desktop oder Minikube müsste ggf. noch installiert werden ).

Verifizieren, dass kubectl als Kommandozeilen-Tool korrekt mit dem Cluster verbunden ist und grundlegende Informationen abrufen kann.
Die im Theorieteil behandelten Konzepte durch die Beantwortung von Reflexionsfragen festigen.

## Speicherort der Abgabe:
Die Antworten auf die Reflexionsfragen sind in der Datei kubernetes/k8s-intro-reflection.md im Projekt-Repository zu finden.


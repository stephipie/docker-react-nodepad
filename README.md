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
   ```
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
# Dockerized React Notepad with File Persistence

Diese Anwendung ist ein einfacher Notizblock, der mit React im Frontend und Node.js/Express im Backend erstellt wurde. Die Besonderheit dieser Version ist die Implementierung der Datenpersistenz im Backend mithilfe von Dateien. Die Anwendung ist vollständig mit Docker containerisiert.

## Beschreibung der Anwendung

Das Frontend bietet eine einfache Benutzeroberfläche zum Erstellen und Anzeigen von Notizen. Das Backend speichert diese Notizen und stellt sie über eine REST-API bereit. In dieser Version werden die Notizen in einer JSON-Datei im Container gespeichert, um die Daten auch nach Neustarts des Backends zu erhalten.

## Containerisierung

Die Anwendung ist in zwei Docker-Containern verpackt: einen für das Frontend (Nginx serving static React build) und einen für das Backend (Node.js/Express API).

### Voraussetzungen

* Docker muss auf deinem System installiert sein.

### Backend Image bauen

Navigiere zum Backend-Verzeichnis:

```bash
cd backend
docker build -t my-backend-api:persistence .
```
### Backend Container starten mit Persistenz
Um die Daten des Backends persistent zu speichern, wird ein Named Volume verwendet, das an das /app/data-Verzeichnis im Container gemountet wird.

```bash
docker volume create my-backend-data
docker run -d -p 8081:3000 --name my-backend-persistent -v my-backend-data:/app/data my-backend-api:persistence
```
### Frontend Image bauen

Navigiere zum Frontend-Verzeichnis:
```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:4000/api -t my-frontend-app:latest .
```
Frontend Container starten
```bash
docker run -d -p 8080:80 --name my-frontend my-frontend-app:latest
```
Die React-Anwendung ist nun unter http://localhost:8080 im Browser erreichbar.

### Entscheidung für den Volume-Typ
Für die Persistenz der Backend-Daten wurde ein Named Volume (my-backend-data) gewählt.

#### Vorteile von Named Volumes:

Abstraktion des Host-Dateisystems: Docker verwaltet den Speicherort der Daten.
Einfache Verwaltung: Docker bietet Befehle zur Verwaltung von Volumes.
Bessere Portabilität: Unabhängiger vom spezifischen Host-System.

#### Nachteile von Named Volumes:

Weniger direkte Kontrolle: Direkter Zugriff auf die Daten auf dem Host ist umständlicher.

#### Vorteile von Bind Mounts:

Direkte Kontrolle: Einfacher Zugriff und Bearbeitung der Daten auf dem Host.

#### Nachteile von Bind Mounts:

Abhängigkeit vom Host-Dateisystem: Pfade müssen existieren und korrekt sein.
Potenzielle Berechtigungsprobleme.
Für diese Entwicklungsumgebung habe ich die einfachere Verwaltung und die bessere Portabilität von Named Volumes als wichtiger erachtet.

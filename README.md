# Mini-Notizblock Anwendung

Diese Anwendung ist ein einfacher Mini-Notizblock, mit dem Benutzer Notizen erstellen, anzeigen und löschen können. Sie besteht aus einem React-basierten Frontend und einem Node.js/Express-basierten Backend.

## Struktur des Projekts

Das Projekt ist in folgende Verzeichnisse unterteilt:

├── backend/
│   ├── Dockerfile          # Dockerfile für die Backend-Anwendung
│   ├── .dockerignore       # Dateien, die beim Bau des Backend-Images ignoriert werden
│   ├── package.json        # Projektkonfiguration und Abhängigkeiten für das Backend
│   ├── package-lock.json   # Genaue Abhängigkeitsversionen für das Backend
│   ├── routes/
│   │   └── notes.js        # Definition der API-Routen für Notizen
│   └── server.js           # Hauptdatei für den Express-Server
├── frontend/
│   ├── Dockerfile          # Dockerfile für die Frontend-Anwendung
│   ├── .dockerignore       # Dateien, die beim Bau des Frontend-Images ignoriert werden
│   ├── public/             # Öffentliche Assets des Frontends
│   ├── src/                # React-Quellcode
│   │   ├── App.jsx           # Hauptkomponente der Anwendung
│   │   ├── components/       # React-Komponenten
│   │   │   ├── NoteInput.jsx # Eingabefeld für neue Notizen
│   │   │   ├── NoteItem.jsx  # Anzeige einer einzelnen Notiz
│   │   │   └── NoteList.jsx  # Liste der angezeigten Notizen
│   │   └── ...
│   ├── package.json        # Projektkonfiguration und Abhängigkeiten für das Frontend
│   ├── package-lock.json   # Genaue Abhängigkeitsversionen für das Frontend
│   ├── .env                # Umgebungsvariablen für die Entwicklung (Frontend)
│   └── vite.config.js      # Vite-Konfiguration 
└── README.md             # Diese Datei

* **`backend/`**: Enthält den Quellcode und die Docker-Konfiguration für die Backend-API.
* **`frontend/`**: Enthält den Quellcode und die Docker-Konfiguration für die React-basierte Benutzeroberfläche.
* **`README.md`**: Die vorliegende Datei mit einer Beschreibung des Projekts.

## Containerisierte Anwendung bauen und starten (separat)

Diese Anleitung beschreibt, wie du die Backend- und Frontend-Anwendungen als separate Docker-Container baust und startest.

### Voraussetzungen

* Docker muss auf deinem System installiert sein. Du kannst es von [https://www.docker.com/get-started](https://www.docker.com/get-started) herunterladen und installieren.

### Backend bauen und starten

1.  **Zum Backend-Verzeichnis navigieren:**
    ```bash
    cd backend
    ```

2.  **Backend-Image bauen:**
    ```bash
    docker build -t my-backend-api .
    ```
    Dieser Befehl erstellt ein Docker-Image namens `my-backend-api` basierend auf dem `Dockerfile` im `backend`-Verzeichnis.

3.  **Backend-Container starten:**
    ```bash
    docker run -d -p 8081:3000 --name my-backend my-backend-api
    ```
    Dieser Befehl startet einen Container im Hintergrund (`-d`) aus dem `my-backend-api`-Image. Der interne Port 3000 des Containers (auf dem die Node.js-Anwendung läuft) wird auf Port 8081 deines Host-Rechners gemappt (`-p 8081:3000`). Der Container erhält den Namen `my-backend`.

### Frontend bauen und starten

1.  **Zum Frontend-Verzeichnis navigieren:**
    ```bash
    cd frontend
    ```

2.  **Frontend-Image bauen:**
    ```bash
    docker build --build-arg VITE_API_URL=http://localhost:8081/api -t my-frontend-app .
    ```
    Dieser Befehl erstellt ein Docker-Image namens `my-frontend-app`. Wichtig ist das `--build-arg VITE_API_URL=http://localhost:8081/api`. Hier wird die URL des laufenden Backend-Containers (erreichbar über `localhost:8081` von deinem Host) als Build-Argument an das Frontend übergeben. Das Frontend wird so gebaut, dass es Anfragen an diese URL sendet.

3.  **Frontend-Container starten:**
    ```bash
    docker run -d -p 8080:80 --name my-frontend my-frontend-app
    ```
    Dieser Befehl startet einen Container im Hintergrund aus dem `my-frontend-app`-Image. Der interne Port 80 des Containers (auf dem der Nginx-Webserver läuft) wird auf Port 8080 deines Host-Rechners gemappt (`-p 8080:80`). Der Container erhält den Namen `my-frontend`.

### Anwendung im Browser aufrufen

Nachdem beide Container erfolgreich gestartet wurden, kannst du die Anwendung in deinem Webbrowser unter folgender Adresse aufrufen:

http://localhost:8080

Die React-Anwendung sollte geladen werden und mit dem Backend kommunizieren, das unter `http://localhost:8081` erreichbar ist. Du kannst Notizen hinzufügen, anzeigen und löschen.

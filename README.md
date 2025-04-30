# Mini-Notizblock mit React und Vite

Diese einfache Webanwendung ist ein Mini-Notizblock, mit dem du Notizen hinzufügen und löschen kannst. Sie wurde mit React und Vite erstellt und für die Bereitstellung mit Docker containerisiert.

## Lokale Entwicklung

1.  Stelle sicher, dass Node.js und npm (oder yarn/pnpm) installiert sind.
2.  Klone dieses Repository.
3.  Navigiere zum Projektverzeichnis: `cd docker-react-notepad`
4.  Installiere die Abhängigkeiten: `npm install`
5.  Starte den Entwicklungsserver: `npm run dev`
6.  Öffne die Anwendung im Browser unter `http://localhost:5173/`.

## Builden der Produktionsversion

1.  Navigiere zum Projektverzeichnis: `cd docker-react-notepad`
2.  Führe den Build-Prozess aus: `npm run build`
3.  Die gebaute Version befindet sich im Ordner `dist/`.
4.  Du kannst die gebaute Version lokal mit einem statischen Server testen: `npx serve dist`

## Containerisierung mit Docker

Voraussetzungen: Docker ist auf deinem System installiert.

1.  Stelle sicher, dass du dich im Hauptverzeichnis des Projekts befindest (wo sich das `Dockerfile` befindet).
2.  Baue das Docker-Image: `docker build -t notizblock-app .`
3.  Starte einen Docker-Container: `docker run -d -p 8080:80 --name notizblock-container notizblock-app`
4.  Die Anwendung ist nun im Browser unter `http://localhost:8080` erreichbar.
5.  Du kannst den Container stoppen mit: `docker stop notizblock-container`
6.  Und wieder starten mit: `docker start notizblock-container`

## Enthaltene Dateien

* `Dockerfile`: Konfiguration für die Docker-Containerisierung.
* `.gitignore`: Gibt Dateien und Ordner an, die von Git ignoriert werden sollen.
* `README.md`: Diese Datei mit Informationen zum Projekt.
* `package.json`, `package-lock.json`: Projektabhängigkeiten und -konfiguration.
* `vite.config.js`: Vite-Konfiguration.
* `index.html`: Haupt-HTML-Datei.
* `src/`: Quellcode der React-Anwendung.
    * `App.jsx`: Hauptkomponente der Anwendung.
    * `main.jsx`: Einstiegspunkt der Anwendung.
    * `components/`: Enthält die React-Komponenten (`NoteInput.jsx`, `NoteItem.jsx`, `NoteList.jsx`).
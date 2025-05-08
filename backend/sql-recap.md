# SQL Recap: Datenmodell und grundlegende Abfragen

## Entworfenes Datenmodell: Tabelle `notes`

Die Tabelle `notes` hat folgendes Schema:

| Spaltenname       | Datentyp        | Primärschlüssel |
| ----------------- | --------------- | --------------- |
| id                | INTEGER         | JA              |
| title             | VARCHAR(255)    | NEIN            |
| content           | TEXT            | NEIN            |
| creation\_date    | TIMESTAMP       | NEIN            |
| modification\_date | TIMESTAMP       | NEIN            |

Die Spalte `id` ist als Primärschlüssel definiert, um jede Zeile in der Tabelle eindeutig zu identifizieren.

## Grundlegende SQL-Abfragen (CRUD)

* **CREATE (Einfügen):**
    ```sql
    INSERT INTO notes (title, content, creation_date, modification_date)
    VALUES ('Neue Notiz', 'Dies ist der Inhalt der neuen Notiz.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    ```

* **READ (Alle abrufen):**
    ```sql
    SELECT *
    FROM notes;
    ```

* **READ (Einzelnen abrufen):**
    ```sql
    SELECT id, title, content, creation_date, modification_date
    FROM notes
    WHERE id = <NOTIZ_ID>;
    ```

* **(Optional) READ (Mit WHERE-Klausel):**
    ```sql
    SELECT id, title, content, creation_date, modification_date
    FROM notes
    WHERE title = '<BESTIMMTER_TITEL>';
    ```

* **UPDATE:**
    ```sql
    UPDATE notes
    SET title = '<NEUER_TITEL>', content = '<NEUER_INHALT>', modification_date = CURRENT_TIMESTAMP
    WHERE id = <NOTIZ_ID>;
    ```

* **DELETE:**
    ```sql
    DELETE FROM notes
    WHERE id = <NOTIZ_ID>;
    ```

## Reflexion

**Warum ist die Speicherung von Anwendungsdaten in einer strukturierten Datenbank besser als die einfache Speicherung in einer JSON-Datei? Nenne mindestens drei Vorteile.**

1.  **Datenintegrität und -konsistenz:** Relationale Datenbanken erzwingen Datenintegrität durch definierte Datentypen, Constraints (z.B. NOT NULL, UNIQUE) und Beziehungen zwischen Tabellen (Fremdschlüssel). Dies reduziert Inkonsistenzen und Fehler in den Daten im Vergleich zur flexibleren, aber potenziell fehleranfälligeren JSON-Speicherung.
2.  **Effiziente Datenabfrage und -manipulation:** SQL ist eine mächtige Sprache zur Abfrage und Manipulation von Daten. Datenbanken sind für effiziente Such-, Filter-, Sortier- und Join-Operationen optimiert, was bei großen Datenmengen und komplexen Abfragen deutlich schneller ist als das manuelle Parsen und Verarbeiten von JSON-Dateien.
3.  **Struktur und Organisation:** Relationale Datenbanken bieten eine klare Struktur durch Tabellen und Spalten mit definierten Datentypen. Dies erleichtert das Verständnis und die Verwaltung der Daten, insbesondere wenn die Daten komplexer werden und Beziehungen zwischen verschiedenen Entitäten bestehen. JSON-Dateien können zwar auch strukturiert sein, aber die Struktur muss in der Anwendungslogik explizit gehandhabt werden und wird nicht durch ein Schema erzwungen.

**Was ist der Hauptzweck eines Primärschlüssels in einer Tabelle, und wie hast du dieses Konzept in deinem Entwurf umgesetzt?**

Der Hauptzweck eines Primärschlüssels ist es, jede Zeile in einer Tabelle eindeutig zu identifizieren. Er stellt sicher, dass es keine doppelten Einträge gibt und ermöglicht es, auf einzelne Datensätze gezielt zuzugreifen, zu aktualisieren oder zu löschen. In meinem Entwurf habe ich die Spalte `id` als Primärschlüssel definiert. Ich habe `INTEGER` als Datentyp gewählt und argumentiert, dass diese Spalte geeignet ist, jede Zeile eindeutig zu identifizieren, insbesondere wenn sie in einer echten Datenbank als Auto-Increment konfiguriert würde.

**Wie würden die API-Endpunkte deiner Backend-Anwendung (GET /notes, GET /notes/:id, POST /notes, DELETE /notes/:id) theoretisch auf die von dir formulierten SQL-Abfragen abgebildet werden? Welche Art von Abfrage würde jeder Endpunkt typischerweise ausführen?**

* **GET /notes:** Würde typischerweise eine `SELECT`-Abfrage ausführen, um alle Zeilen aus der `notes`-Tabelle abzurufen:
    ```sql
    SELECT id, title, content, creation_date, modification_date
    FROM notes;
    ```
* **GET /notes/:id:** Würde typischerweise eine `SELECT`-Abfrage mit einer `WHERE`-Klausel ausführen, um die Zeile mit der entsprechenden ID abzurufen:
    ```sql
    SELECT id, title, content, creation_date, modification_date
    FROM notes
    WHERE id = <NOTIZ_ID>;
    ```
* **POST /notes:** Würde typischerweise eine `INSERT INTO`-Abfrage ausführen, um eine neue Zeile in die `notes`-Tabelle einzufügen, basierend auf den im Request-Body übermittelten Daten (Titel, Inhalt):
    ```sql
    INSERT INTO notes (title, content, creation_date, modification_date)
    VALUES ('<NEUER_TITEL>', '<NEUER_INHALT>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    ```
* **DELETE /notes/:id:** Würde typischerweise eine `DELETE FROM`-Abfrage mit einer `WHERE`-Klausel ausführen, um die Zeile mit der entsprechenden ID zu löschen:
    ```sql
    DELETE FROM notes
    WHERE id = <NOTIZ_ID>;
    ```

**Warum ist die Nutzung einer Datenbank für persistente Daten wichtig im Kontext von containerisierten Anwendungen und DevOps?**

Die Nutzung einer Datenbank ist im Kontext von containerisierten Anwendungen und DevOps aus mehreren Gründen wichtig für die persistente Datenspeicherung:

* **Entkopplung von Containern:** Container sind in der Regel kurzlebig und können jederzeit erstellt, skaliert oder ersetzt werden. Eine externe Datenbank stellt sicher, dass die Daten unabhängig von der Lebensdauer der Container erhalten bleiben.
* **Zustandslose Container:** Das Prinzip der zustandslosen Container wird durch die Auslagerung von persistenten Daten in eine Datenbank gefördert, was die Skalierung und Wartung vereinfacht.
* **Datenmanagement und -zugriff:** Datenbanken bieten robuste Mechanismen für Datenmanagement, Backup, Wiederherstellung und Zugriffskontrolle.
* **Skalierbarkeit und Performance:** Datenbanken können unabhängig von den Anwendungscontainern skaliert werden, um den Anforderungen gerecht zu werden.
* **Standardisierte Schnittstellen:** SQL bietet eine standardisierte Möglichkeit für die Interaktion mit den Daten.




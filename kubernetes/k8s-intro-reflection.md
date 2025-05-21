# Reflexion

## Welche Methode hast du zum Aufsetzen deines lokalen Kubernetes Clusters gewählt (Docker Desktop, Minikube, Kind) und warum?

Ich habe Methode A: Docker Desktop zum Aufsetzen meines lokalen Kubernetes Clusters gewählt. Der Hauptgrund dafür ist die Einfachheit und die nahtlose Integration mit meiner bestehenden Docker-Umgebung. Da Docker Desktop bereits installiert war, konnte ich Kubernetes einfach über die Einstellungen aktivieren, was den Einrichtungsprozess erheblich vereinfacht hat. Es ist eine sehr schnelle und unkomplizierte Möglichkeit, ein lokales Cluster für Lernzwecke zu starten, ohne zusätzliche Tools installieren oder konfigurieren zu müssen.

## Beschreibe in eigenen Worten, was die Control Plane eines Kubernetes Clusters ist und welche Kernrolle sie hat (ohne spezifische Komponenten wie etcd, Scheduler etc. im Detail zu nennen).

Die Control Plane ist das "Gehirn" eines Kubernetes Clusters. Sie ist dafür verantwortlich, den gewünschten Zustand des Clusters aufrechtzuerhalten und alle Operationen zu koordinieren. Man kann sie sich als das Nervenzentrum vorstellen, das alle Entscheidungen trifft, wie Anwendungen bereitgestellt, skaliert und verwaltet werden sollen. Ihre Kernrolle ist es, sicherzustellen, dass das Cluster immer dem entspricht, was der Benutzer oder Administrator beabsichtigt hat. Sie überwacht den aktuellen Zustand, erkennt Abweichungen und leitet die notwendigen Schritte ein, um den gewünschten Zustand wiederherzustellen.

## Was ist die Rolle eines Worker Node in einem Kubernetes Cluster?

Ein Worker Node ist die "Arbeitskraft" in einem Kubernetes Cluster. Er ist die Maschine (virtuell oder physisch), auf der die tatsächlichen Workloads, also die Container-Anwendungen (Pods), ausgeführt werden. Jeder Worker Node verfügt über die notwendigen Ressourcen (CPU, RAM, Speicher, Netzwerk), um Container zu hosten und auszuführen. Sie empfangen Anweisungen von der Control Plane, starten, stoppen und verwalten die Pods und melden ihren Status an die Control Plane zurück. Im Grunde ist der Worker Node der Ort, an dem die Container-Anwendungen "leben" und ihre Arbeit verrichten.

## Der Befehl kubectl ist das Kommandozeilen-Tool zur Interaktion mit Kubernetes. Mit welchem zentralen Bestandteil der Kubernetes Architektur spricht kubectl direkt, wenn du einen Befehl absetzt?

Wenn ich einen Befehl mit kubectl absetze, spricht es direkt mit dem API Server der Kubernetes Control Plane. Der API Server ist der zentrale Kommunikationspunkt im Cluster und die einzige Komponente, mit der kubectl interagiert. Alle Anfragen und Befehle von kubectl werden an den API Server gesendet, der sie dann verarbeitet und an die entsprechenden internen Komponenten der Control Plane weiterleitet oder direkt den Status im Cluster aktualisiert.

## Wie hast du praktisch überprüft, dass kubectl erfolgreich eine Verbindung zu deinem lokalen Cluster herstellen konnte? Welche Befehle hast du dafür genutzt, und was hast du als erfolgreiche Ausgabe erwartet?

Ich habe die Verbindung mit den folgenden Befehlen überprüft:

### kubectl config current-context: 

Ich habe erwartet, dass dieser Befehl den Namen des Kontexts meines lokalen Clusters anzeigt, in meinem Fall "docker-desktop". Die Ausgabe bestätigte, dass kubectl auf den richtigen Kontext eingestellt war.

### kubectl get nodes: 

Hier erwartete ich, dass dieser Befehl eine Liste der Nodes meines lokalen Clusters zurückgibt. Da ich Docker Desktop nutze, wurde ein einzelner Node mit dem Namen "docker-desktop" und dem Status "Ready" angezeigt. Dies bestätigte, dass der Cluster lief und kubectl erfolgreich mit ihm kommunizieren konnte.

### kubectl cluster-info: 

Dieser Befehl sollte grundlegende Informationen über das Cluster und die Adresse des API Servers anzeigen. Die Ausgabe zeigte die URL des Kubernetes Control Plane (API Server) und bestätigte, dass der Dienst läuft, was die erfolgreiche Verbindung unterstrich.

![Kubernetes local Cluster Status](/screenshots/kubectl.png)


## Basierend auf dem Theorieteil: Erkläre kurz die Kernidee der deklarativen Philosophie von Kubernetes.

Die Kernidee der deklarativen Philosophie von Kubernetes ist, dass man nicht den Weg beschreibt, wie ein System seinen Zustand erreichen soll (imperativ), sondern lediglich den gewünschten Endzustand (deklarativ). Man sagt Kubernetes also nicht "Installiere diese App, dann skaliere sie auf drei Instanzen und leite den Traffic so um", sondern man definiert in einer Konfigurationsdatei (YAML), wie die Anwendung aussehen soll: Sie soll existieren, in drei Replikate skaliert sein und einen bestimmten Service haben. Kubernetes übernimmt dann autonom die Aufgabe, diesen gewünschten Zustand herzustellen und kontinuierlich zu überwachen und aufrechtzuerhalten, selbst wenn sich Komponenten ändern oder ausfallen. Dies reduziert die Komplexität der Verwaltung erheblich, da man sich auf das "Was" konzentrieren kann und nicht auf das "Wie".
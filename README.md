# Code à Cuisine

Ein responsiver KI-Rezeptgenerator, der aus vorhandenen Zutaten und persönlichen Kochpräferenzen drei passende Rezeptvorschläge erstellt. Das Frontend wurde mit Angular umgesetzt; n8n steuert die Rezeptgenerierung und Supabase speichert validierte Rezepte sowie die Nutzungslimits.

## Features

- Zutaten mit Menge und Einheit hinzufügen, bearbeiten und entfernen
- Auswahl von Portionen, Anzahl der Köche, Kochzeit, Küche und Ernährungsform
- Generierung von genau drei strukturierten Rezeptvorschlägen durch ein lokales KI-Modell
- Validierung der Eingaben und der generierten Rezepte im n8n-Workflow
- Lade-, Fehler-, Ergebnis- und Rezeptdetailansichten
- Dauerhafte Ergebnis- und Rezept-URLs über Supabase
- Öffentliche Rezeptbibliothek mit Küchenfiltern und Pagination
- Persistente Herzen mit globalem Like-Zähler
- Tageslimit pro IP-Adresse und systemweites Tageslimit
- Cookbook- und Länderküche-Ansichten
- Responsive Darstellung für Desktop, Widescreen und mobile Geräte

## Lokal starten

### Voraussetzungen

- Node.js mit npm
- Ein Supabase-Projekt
- Eine lokale oder gehostete n8n-Instanz
- Ein von n8n erreichbarer Ollama-Server mit einem geeigneten Chat-Modell

Das KI-Modell muss strukturierte Ausgaben zuverlässig erzeugen können. Der Workflow wurde zuletzt mit einem lokal betriebenen Gemma-4-26B-Modell verwendet.

### 1. Projekt installieren

1. Repository klonen:

   ```bash
   git clone https://github.com/mlb27/code-a-cuisine.git
   ```

2. In den Projektordner wechseln und Abhängigkeiten installieren:

   ```bash
   cd code-a-cuisine
   npm install
   ```

### 2. Supabase einrichten

1. Ein neues Supabase-Projekt erstellen.
2. Den SQL Editor des Projekts öffnen.
3. Die Dateien aus `supabase/migrations/` in der Reihenfolge ihrer Dateinamen vollständig in den SQL Editor einfügen und ausführen.
4. Die Supabase Project URL und den serverseitigen Secret- beziehungsweise Service-Role-Key bereithalten.

Die Migration erstellt die Tabellen für generierte Rezepte und Nutzungslimits, passende Indizes, Row Level Security sowie die Funktion `consume_generation_quota`.

### 3. n8n einrichten

1. n8n starten und die Benutzeroberfläche öffnen. Bei der lokalen Standardkonfiguration ist sie unter `http://localhost:5678` erreichbar.
2. Diese drei Workflows über **Import from File** importieren:

   - `n8n/workflows/generate-and-store-recipe-suggestions.json`
   - `n8n/workflows/read-stored-recipes.json`
   - `n8n/workflows/update-recipe-like.json`

3. In n8n ein Credential vom Typ **Header Auth** mit dem Namen `Supabase n8n secret` anlegen:

   - Header Name: `apikey`
   - Header Value: Secret- oder Service-Role-Key des eigenen Supabase-Projekts

4. In den folgenden HTTP-Request-Nodes die enthaltene Supabase Project URL durch die URL des eigenen Projekts ersetzen:

   - `Consume generation quota`
   - `Save generated recipes`
   - `Fetch stored recipes`
   - `List public recipes`
   - `Persist recipe like`

5. Ein Ollama-Credential mit dem Namen `Ollama account` anlegen und dort die für n8n erreichbare Ollama Base URL eintragen.
6. Im Modell-Node des Generierungsworkflows ein installiertes Modell auswählen.
7. In allen Webhook-Nodes unter **Allowed Origins (CORS)** die Adresse des Frontends eintragen. Lokal ist das `http://localhost:4200`.
8. Alle drei Workflows veröffentlichen beziehungsweise aktivieren.

Wenn n8n in Docker läuft, verweist `localhost` innerhalb des Containers auf den n8n-Container selbst. Ein Ollama-Server auf einem anderen Rechner muss deshalb über dessen Netzwerkadresse erreichbar sein.

Die Angular-App verwendet die Production-Webhooks. Test-Webhooks funktionieren nur, solange in n8n **Listen for test event** aktiv ist, und sind nicht für den normalen App-Betrieb gedacht.

### 4. Webhook-Adressen prüfen

Für die lokale Standardkonfiguration sind bereits diese Endpunkte eingetragen:

```text
http://localhost:5678/webhook/generate-recipe
http://localhost:5678/webhook/recipes
http://localhost:5678/webhook/recipes/like
```

Falls n8n unter einer anderen Adresse läuft, müssen die Werte in `src/app/shared/config/recipe-api.config.ts` angepasst werden.

### 5. Angular starten

```bash
npm start
```

Anschließend `http://localhost:4200` im Browser öffnen.

Für einen Produktions-Build kann `npm run build` verwendet werden.

## Datenspeicherung

Zutaten, Präferenzen und die zuletzt generierte Antwort werden für die aktuelle Browser-Sitzung im SessionStorage gespeichert. Erfolgreich validierte Rezepte und ihre globalen Like-Zähler werden in Supabase abgelegt. Dadurch können Ergebnis- und Rezeptdetailseiten auch über ihre jeweilige ID neu geladen und direkt aufgerufen werden. Der Browser merkt sich gelikte Rezept-IDs im LocalStorage, damit ein Herz später wieder entfernt werden kann.

Zur Durchsetzung des Generierungslimits speichert Supabase die IP-Adresse und das zugehörige Datum serverseitig. Einträge, die älter als sieben Tage sind, werden beim nächsten Aufruf der Quota-Funktion entfernt. Bei einer öffentlichen Bereitstellung muss diese Verarbeitung zusätzlich in der Datenschutzerklärung beschrieben werden.

## Sicherheit

- Der Supabase Secret- beziehungsweise Service-Role-Key darf ausschließlich in den n8n-Credentials gespeichert werden.
- Secrets gehören weder in Angular-Dateien noch in Workflow-Exports oder Git.
- Die exportierten Workflows enthalten nur Credential-Referenzen. Vor jedem neuen Export sollte trotzdem geprüft werden, dass keine Zugangsdaten enthalten sind.
- Der Browser kommuniziert nur mit den öffentlichen n8n-Webhooks und erhält keinen direkten Zugriff auf serverseitige Secrets.

## Deployment

Für eine veröffentlichte Version müssen n8n und das KI-Modell dauerhaft erreichbar sein. Danach sind folgende Werte anzupassen:

1. Die drei lokalen Webhook-Adressen in `recipe-api.config.ts` durch die veröffentlichten n8n-Adressen ersetzen.
2. In allen n8n-Webhooks unter **Allowed Origins (CORS)** die Domain des veröffentlichten Angular-Frontends eintragen.
3. Alle Workflows in der gehosteten n8n-Instanz importieren, Credentials neu anlegen und veröffentlichen.
4. Prüfen, dass die gehostete n8n-Instanz Supabase und den Ollama-Server erreichen kann.

## Technologien

- Angular
- TypeScript
- SCSS
- Angular Signals und Router
- Supabase Database und Row Level Security
- n8n
- Ollama und ein lokal betriebenes Sprachmodell

## Projektstruktur

```text
src/app/
|-- layout/                 # Gemeinsamer Seiten-Header
|-- pages/                  # Seiten und seitenspezifische Komponenten
`-- shared/                 # Config, Guards, Models und Services

public/                     # Fonts, Bilder, Logos und Loader
n8n/workflows/              # Importierbare n8n-Workflows
supabase/migrations/        # Datenbankschema, RLS und Quota-Funktion
```

## Projektkontext

Dieses Projekt wurde im Rahmen der Weiterbildung bei der **Developer Akademie** erstellt.

## Autor

Moritz Böhm

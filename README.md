# Der zerbrochne Krug – interaktive Handlungssicherung

Interaktive Unterrichtsseite für einen Deutsch-Grundkurs der Q1 zu Heinrich von Kleists Lustspiel **„Der zerbrochne Krug“**.

Die Anwendung wurde für eine 45-minütige Unterrichtsstunde nach der Ganzlektüre entwickelt. Die Lernenden können

- eine bereits bis zum 7. Auftritt erarbeitete Figurenkonstellation ergänzen,
- die Auftritte 8–13 in die richtige Reihenfolge bringen,
- ihre Ergebnisse unmittelbar selbst überprüfen,
- den vollständigen Handlungsverlauf als Sicherung anzeigen und
- die fertigen Ergebnisse per Screenshot in OneNote ablegen.

Die Aufgaben bieten die Differenzierungsstufen **Förder**, **Basis** und **Erweitert**.

## Öffentliche Unterrichtsseite

[zerbrochne-krug-45-minuten.burcu-yilmaz1758.chatgpt.site](https://zerbrochne-krug-45-minuten.burcu-yilmaz1758.chatgpt.site)

## Lokal starten

Voraussetzung: Node.js ab Version 22.13.

```bash
pnpm install
pnpm dev
```

Anschließend ist die Seite in der Regel unter `http://localhost:3000` erreichbar.

## Qualitätsprüfung

```bash
pnpm build
pnpm test
```

## Wichtige Dateien

- `app/page.tsx` – Inhalte und Interaktionen
- `app/globals.css` – Layout, Farben und responsive Gestaltung
- `public/adam-hero.png` – eigens erstelltes Titelbild
- `.openai/hosting.json` – Konfiguration der veröffentlichten Sites-Version

## Unterrichtlicher Rahmen

- Fach: Deutsch
- Lerngruppe: Q1, Grundkurs
- Lehrkraftkürzel: Erd
- Werk: Heinrich von Kleist, *Der zerbrochne Krug*

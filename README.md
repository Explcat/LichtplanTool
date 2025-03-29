# LichtplanTool README

Hi! This is a very simple tool to take notes for theater plays at our school. We are running two old analog DMX mixers and one “modern” LED mixer capable of storing lighting scenes in 24 banks. For this project, I have modeled the setup with slider ranges and buttons. I hope you don’t need this because your school has modern equipment 😊. If you do have a use case for it, please note:

> This project was pushed out in 6 hours with the help of a large language model doing the heavy code lifting.  
> It works! It is stable! It relies on some small workarounds in the UI sometimes. Feel free to improve it.  
> **IMPORTANT:** THIS IS INTENDED TO RUN ONLY OFFLINE IN A BROWSER! I did NOT pay attention to security in ANY way!!!!  
> Do **NOT** put this on your server without knowing what you are doing!

---

## Overview / Überblick

**ENGLISH:**  
LichtplanTool is a simple web application used to build a list of Szenes for a play. And TAKE NOTES of slider positions and manage lighting scenes. The app allows you to create, edit, and navigate through scenes. Each scene can have its own settings such as slider values, LED button states, images, and even music files.

**DEUTSCH:**  
LichtplanTool ist eine einfache Webanwendung, mit der du ein List von Szenen erstellen, die Regler EINSTELLUNG von Licht-Szenen notieren und verwalten kannst. Mit der App kannst du Szenen erstellen, bearbeiten und zwischen ihnen navigieren. Jede Szene hat eigene Einstellungen, wie Slider-Werte, LED-Button-Zustände, Bilder und sogar Musikdateien.

---

## Project Structure / Projektstruktur

**ENGLISH:**  
The project is organized into several folders and files:

- **Root Folder:**  
  Contains the main HTML file and global project files.

- **css Folder:**  
  Contains all the style files for the application:
  - `style.css`: Main styles for layout and design.
  - `musiclist.css`: Specific styles for the music list.
  - `nouislider.min.css`: Styles for the slider library (noUiSlider).

- **js Folder:**  
  Contains all JavaScript files which control the functionality of the app:
  - **globals.js:**  
    Sets up global variables, the database structure, and functions to load/save data.
  - **helpers.js:**  
    Contains helper functions used to create and manage sliders and LED buttons.
  - **render.js:**  
    Contains functions to display the current scene, update the UI, and render lists (scene list, music list, etc.).
  - **events.js:**  
    Contains event handlers for user interactions such as button clicks, file selections, and keyboard navigation.
  - **nouislider.min.js:**  
    A third-party, minified library that provides slider functionality. (Do not modify this file.)

- **szenendatenbank Folder (if exists):**  
  Contains the external JSON file (`db.json`) used to load the initial database if no data is saved in the browser.

- **Szenenmusik Folder (if exists):**  
  Contains music files.

- **Szenenbilder Folder (if exists):**  
  Contains pictures (including a `default.jpg` placeholder).

**DEUTSCH:**  
Das Projekt ist in mehrere Ordner und Dateien unterteilt:

- **Projekt-Stammordner:**  
  Enthält die Haupt-HTML-Datei und globale Projektdateien.

- **css-Ordner:**  
  Enthält alle Style-Dateien der Anwendung:
  - `style.css`: Haupt-Stile für Layout und Design.
  - `musiclist.css`: Spezifische Stile für die Musikliste.
  - `nouislider.min.css`: Stile für die Slider-Bibliothek (noUiSlider).

- **js-Ordner:**  
  Enthält alle JavaScript-Dateien, die die Funktionalität der App steuern:
  - **globals.js:**  
    Richtet globale Variablen, die Datenbankstruktur und Funktionen zum Laden/Speichern der Daten ein.
  - **helpers.js:**  
    Enthält Hilfsfunktionen zur Erstellung und Verwaltung von Slidern und LED-Buttons.
  - **render.js:**  
    Enthält Funktionen zur Darstellung der aktuellen Szene, zur Aktualisierung der Benutzeroberfläche sowie zum Rendern von Listen (z.B. Szenenliste, Musikliste).
  - **events.js:**  
    Enthält Event-Handler für Benutzerinteraktionen wie Klicks, Dateiauswahl und Tastatursteuerung.
  - **nouislider.min.js:**  
    Eine Drittanbieter-Bibliothek in minimierter Form, die die Slider-Funktionalität bereitstellt. (Diese Datei nicht ändern!)

- **szenendatenbank (falls vorhanden):**  
  Enthält die externe JSON-Datei (`db.json`), die zum Laden der Anfangsdaten verwendet wird, wenn keine Daten im Browser vorhanden sind.

- **Szenenmusik Folder (falls vorhanden):**  
  Hier kannst du die Musikdateien ablegen.

- **Szenenbilder Folder (falls vorhanden):**  
  Hier kannst du die Szenenbilder ablegen. Enthält auch eine `default.jpg` als Platzhalter.

---

## How the App Works / Funktionsweise der App

**ENGLISH:**  
- **Start and Data Loading:**  
  When you open the HTML file in your web browser, the app loads saved data from the browser’s local storage. If no data exists, default data is loaded from an external JSON file.

- **Scene Management:**  
  Navigate between scenes using the "previous" and "next" buttons or by clicking a scene in the scene list. Each scene displays its own settings (sliders, LED buttons, images, and music files).

- **Edit Mode and Read Mode:**  
  The app has two modes:
  - **Edit Mode:** Modify scene names, adjust sliders, upload images, and add music. Extra controls (e.g., “Edit” button, file inputs) are available.
  - **Read Mode:** Scenes are displayed in a non-editable format. Navigation is still possible via arrow keys or buttons.

- **Sliders and LED Buttons:**  
  Sliders (created using the noUiSlider library) allow you to adjust channel values. LED buttons can be toggled on/off in edit mode to set the lighting status.

- **Music Integration:**  
  Add music files to each scene. A persistent music list shows available music that you can play or, in edit mode, delete.

- **Saving and Importing:**  
  The app automatically saves snapshots when you switch scenes or use the "Save Snapshot" button. You can also export the entire database as a JSON file or import data from such a file.

**DEUTSCH:**  
- **Start und Datenladen:**  
  Wenn du die HTML-Datei im Browser öffnest, lädt die App die gespeicherten Daten aus dem Browser-Speicher. Falls keine Daten vorhanden sind, werden Standarddaten aus einer externen JSON-Datei geladen.

- **Szenenverwaltung:**  
  Mit den Buttons „Vorherige Szene“ und „Nächste Szene“ oder durch Klick in der Szenenliste kannst du zwischen Szenen wechseln. Jede Szene zeigt ihre eigenen Einstellungen wie Slider, LED-Buttons, Bilder und Musikdateien.

- **Edit-Mode und Read-Mode:**  
  Die App hat zwei Modi:
  - **Edit-Mode:** Hier kannst du Szenennamen ändern, Slider anpassen, Bilder hochladen und Musik hinzufügen. Im Edit-Modus werden zusätzliche Steuerungen angezeigt.
  - **Read-Mode:** Die Szenen werden schreibgeschützt dargestellt. Die Navigation ist weiterhin möglich (über Pfeiltasten oder Buttons).

- **Slider und LED-Buttons:**  
  Mithilfe der noUiSlider-Bibliothek kannst du Werte für verschiedene Kanäle anpassen. LED-Buttons lassen sich im Edit-Modus ein- und ausschalten, um den Lichtstatus jeder Szene festzulegen.

- **Musik-Integration:**  
  Du kannst jeder Szene Musikdateien hinzufügen. Die App zeigt eine persistente Musikliste, in der du Musik abspielen oder im Edit-Modus löschen kannst.

- **Speichern und Importieren:**  
  Die App speichert automatisch Snapshots der Szenen – aber nur, wenn du die Szenenwechsel-Buttons oder den "Szene zwischenspeichern"-Button benutzt! Außerdem kannst du die gesamte Datenbank als JSON-Datei exportieren oder Daten aus einer solchen Datei importieren.

---

## Installation & Setup / Installation und Einrichtung

**ENGLISH:**  
Since this project is intended for offline use only, follow these simple steps:

1. **Download the Release ZIP:**  
   Download the ZIP file from the Git repository release page.

2. **Unzip the File:**  
   Extract the contents to a folder on your computer.

3. **Run the App Locally:**  
   Open the `lichtplan-montag.html` file in your web browser by double-clicking it.  
   **Note:** This project is not designed to run on a server and is not secure for online use.

**DEUTSCH:**  
Da dieses Projekt ausschließlich offline genutzt werden soll, befolge diese einfachen Schritte:

1. **Release-ZIP herunterladen:**  
   Lade die ZIP-Datei von der Git-Repository-Release-Seite herunter.

2. **ZIP entpacken:**  
   Entpacke den Inhalt in einen Ordner auf deinem Computer.

3. **App lokal starten:**  
   Öffne die Datei `lichtplan-montag.html` in deinem Webbrowser, indem du darauf doppelklickst.  
   **Hinweis:** Dieses Projekt ist nicht für den Einsatz auf einem Server konzipiert und nicht sicher für den Online-Betrieb.

---

## Usage Instructions / Bedienungsanleitung

**ENGLISH:**  
1. Open the `lichtplan-montag.html` file in your browser.
2. Use the on-screen buttons to navigate between scenes, edit settings, and interact with the sliders and LED buttons.
3. Switch between **Edit Mode** and **Read Mode** using the "Wechsel zu Edit Mode" or "Wechsel zu Read Mode" button.
4. Changes are automatically saved in your browser’s local storage. You can also export/import the database using the provided buttons.

**DEUTSCH:**  
1. Öffne die Datei `lichtplan-montag.html` in deinem Browser.
2. Verwende die auf dem Bildschirm angezeigten Buttons, um zwischen Szenen zu wechseln, Einstellungen zu bearbeiten und mit den Slidern sowie LED-Buttons zu interagieren.
3. Wechsle zwischen **Edit-Mode** und **Read-Mode** mit dem Button „Wechsel zu Edit Mode“ bzw. „Wechsel zu Read Mode“.
4. Änderungen werden automatisch im Browser gespeichert. Du kannst die Datenbank auch exportieren bzw. importieren, indem du die entsprechenden Buttons verwendest.

---

## Customizing the Mixers and Sliders / Anpassungen an den Mischpulten und Slidern

Please refer to the detailed guide in the manual section (see below) for instructions on how to modify the number of sliders, slider ranges, orientation, etc.

**Example Instructions:**  
1. **Changing the Number of Sliders:**  
   - In `globals.js`, find the `createEmptyScene` function.
   - Change the number in:
     ```javascript
     pultLinks: { sectionA: new Array(12).fill(0) },
     pultRechts: { sectionA: new Array(12).fill(0) },
     ```
     For example, change `12` to `16` for 16 sliders per side.

2. **Changing the Slider Range:**  
   - In `helpers.js`, locate the `createSlider` function.
   - Modify the range object:
     ```javascript
     range: { 'min': 0, 'max': 10 },
     ```
     Change it to:
     ```javascript
     range: { 'min': 0, 'max': 20 },
     ```
     to set the slider range from 0 to 20.

3. **Changing the Slider Orientation:**  
   - Also in `helpers.js` within `createSlider`, you can change:
     ```javascript
     orientation: 'vertical',
     direction: 'rtl',
     ```
     to:
     ```javascript
     orientation: 'horizontal',
     direction: 'ltr',
     ```
     for a horizontal slider layout.

After making any changes, save your files and reload the `lichtplan-montag.html` file in your browser to see the updates.

**DEUTSCH:**  
Siehe die detaillierte Anleitung im Abschnitt oben für Anpassungen:

1. **Ändern der Anzahl der Slider:**  
   - In `globals.js` findest du die Funktion `createEmptyScene`.
   - Ändere die Zahl in:
     ```javascript
     pultLinks: { sectionA: new Array(12).fill(0) },
     pultRechts: { sectionA: new Array(12).fill(0) },
     ```
     Zum Beispiel, ersetze `12` durch `16`, um 16 Slider pro Seite zu haben.

2. **Ändern des Slider-Bereichs:**  
   - In `helpers.js` findest du die Funktion `createSlider`.
   - Passe das Range-Objekt an:
     ```javascript
     range: { 'min': 0, 'max': 10 },
     ```
     Ändere es zu:
     ```javascript
     range: { 'min': 0, 'max': 20 },
     ```
     um einen Bereich von 0 bis 20 festzulegen.

3. **Ändern der Slider-Ausrichtung:**  
   - In derselben Funktion `createSlider` in `helpers.js` kannst du ändern:
     ```javascript
     orientation: 'vertical',
     direction: 'rtl',
     ```
     zu:
     ```javascript
     orientation: 'horizontal',
     direction: 'ltr',
     ```
     für ein horizontales Layout.

Nach Änderungen speichere alle Dateien und lade die `lichtplan-montag.html` neu im Browser.

---

## Contributing / Mitwirken

**ENGLISH:**  
Since I will not be actively developing this project further, feel free to **fork** this repository if you wish to add improvements or adapt it for your needs. Contributions are welcome, but please note that this project is a simple tool and is only maintained as-is for our school use.

**DEUTSCH:**  
Da ich dieses Projekt nicht weiter aktiv entwickeln werde, kannst du das Repository gerne **forken**, wenn du Verbesserungen hinzufügen oder es an deine Bedürfnisse anpassen möchtest. Beiträge sind willkommen, aber beachte bitte, dass dieses Projekt ein einfaches Tool ist, das nur in der aktuellen Form für unsere Schule gepflegt wird.

---

## License / Lizenz

**ENGLISH:**  
This project is released under the [MIT License](LICENSE). It is an open and permissive license allowing you to use, modify, and distribute the software without many restrictions.

**DEUTSCH:**  
Dieses Projekt wird unter der [MIT-Lizenz](LICENSE) veröffentlicht. Es handelt sich um eine offene und permissive Lizenz, die es dir erlaubt, die Software ohne viele Einschränkungen zu nutzen, zu modifizieren und zu verteilen.

---

## Roadmap & Future Enhancements / Zukünftige Verbesserungen

**ENGLISH:**  
- No major improvements are foreseen in the next year until the next school group uses it for their play.
- **Needed Improvement:** Make the item order in the scene list changeable.

**DEUTSCH:**  
- Für das nächste Jahr sind keine größeren Verbesserungen geplant, bis die nächste Schulgruppe das Tool für ihr Theaterstück verwendet.
- **Verbesserungsvorschlag:** Die Reihenfolge der Elemente in der Szenenliste sollte änderbar sein.

---

## Credits & Acknowledgments / Danksagungen

**ENGLISH:**  
- This project makes use of the [noUiSlider](https://refreshless.com/nouislider/) library for slider functionality.  
- Thanks to the community and tools that helped speed up development.

**DEUTSCH:**  
- Dieses Projekt verwendet die [noUiSlider](https://refreshless.com/nouislider/)-Bibliothek zur Bereitstellung der Slider-Funktionalität.
- Vielen Dank an die Community und die Tools, die die Entwicklung beschleunigt haben.

---

## Support & Issue Tracking / Support & Fehlermeldungen

**ENGLISH:**  
If you encounter any issues or have suggestions for improvements, please open an issue in the GitHub issue tracker. I will monitor the issues and do my best to assist.

**DEUTSCH:**  
Falls du auf Probleme stößt oder Verbesserungsvorschläge hast, öffne bitte ein Issue im GitHub-Issue-Tracker. Ich werde die Meldungen beobachten und nach Möglichkeit helfen.

---

## Final Notes / Schlussbemerkungen

**ENGLISH:**  
This tool is intended solely for offline use in a browser. It is not designed for secure server deployment. Please ensure you understand this before using it in any environment beyond your local setup.

**DEUTSCH:**  
Dieses Tool ist ausschließlich für die Offline-Nutzung in einem Browser gedacht. Es ist nicht für den sicheren Einsatz auf einem Server konzipiert. Bitte stelle sicher, dass du dies verstehst, bevor du es in einer anderen Umgebung als deiner lokalen Umgebung nutzt.

---

Feel free to adjust any sections as needed. Once finalized, you can push the repository to GitHub and share the release ZIP file with other schools. Happy coding!

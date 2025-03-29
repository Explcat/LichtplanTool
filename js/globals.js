/*********************** js/globals.js ************************/
/*
  FILE: js/globals.js
  ENGLISH: This file sets up global variables and the database for the lighting plan tool.
  GERMAN: Diese Datei richtet globale Variablen und die Datenbank für das Lichtplan-Tool ein.
*/

/*********************** Global Variables & DB Setup ************************/
// ENGLISH: A boolean flag to indicate if the application is in edit mode.
// GERMAN: Ein boolescher Flag, der angibt, ob sich die Anwendung im Edit-Modus befindet.
let isEditMode = false;

// ENGLISH: The database object that holds all scenes.
// GERMAN: Das Datenbankobjekt, das alle Szenen enthält.
let db = { scenes: [] };

// ENGLISH: An index to track the current scene.
// GERMAN: Ein Index, der die aktuelle Szene verfolgt.
let currentSceneIndex = 0;

// ENGLISH: Get the HTML element that displays the scene name. It is global so it can be updated dynamically.
// GERMAN: Hole das HTML-Element, das den Szenennamen anzeigt. Es ist global, damit es dynamisch aktualisiert werden kann.
let szenenameDisplay = document.getElementById('szenenameDisplay');

/*
  FUNCTION: createEmptyScene
  ENGLISH: This function creates a new, empty scene with default values for sliders, LED buttons, LED slider, and spotlight notes.
  GERMAN: Diese Funktion erstellt eine neue, leere Szene mit Standardwerten für Fader, LED-Buttons, LED-Slider und Spotlight-Notizen.
  PARAMETERS:
    - sceneNumber (number): The number of the new scene.
      (EN: The scene number / DE: Die Szenennummer)
  RETURNS:
    - object: A new scene object with default properties.
      (EN: A new scene object / DE: Ein neues Szenen-Objekt)
  PROGRAMMING TERM: Function – A reusable block of code that performs a specific task.
*/
function createEmptyScene(sceneNumber) {
  return {
    sceneNumber: sceneNumber,                   // EN: Scene number / DE: Szenennummer
    sceneName: 'Szene ' + sceneNumber,            // EN: Default scene name / DE: Standard-Szenenname
    nextszenename: '',                           // EN: Placeholder for the next scene name / DE: Platzhalter für den nächsten Szenennamen
    notes: '',                                   // EN: Placeholder for scene notes / DE: Platzhalter für Szenennotizen
    image: 'szenenbilder/default.jpg',           // EN: Default image for new scenes / DE: Standardbild für neue Szenen
    pultLinks: { sectionA: new Array(12).fill(0) }, // EN: Default values for the left control panel sliders / DE: Standardwerte für die linken Mischpult-Fader
    pultRechts: { sectionA: new Array(12).fill(0) },// EN: Default values for the right control panel sliders / DE: Standardwerte für die rechten Mischpult-Fader
    led: new Array(24).fill(false),              // EN: Default state for 24 LED buttons (all off) / DE: Standardzustand für 24 LED-Buttons (alle aus)
    ledSlider: 0,                                // EN: Default LED slider value / DE: Standardwert für den LED-Slider
    verfolger: '',                               // EN: Placeholder for spotlight (Verfolger) notes / DE: Platzhalter für Spotlight-Notizen
    musik: []                                    // EN: An empty array for music items in this scene / DE: Ein leeres Array für Musik-Elemente in dieser Szene
  };
}

/*
  FUNCTION: saveJsonDB
  ENGLISH: Saves the current database state to the browser's localStorage.
  GERMAN: Speichert den aktuellen Zustand der Datenbank im localStorage des Browsers.
  PROGRAMMING TERM: localStorage – A web storage API that allows saving key/value pairs in the browser.
*/
function saveJsonDB() {
  localStorage.setItem('jsonDB', JSON.stringify(db));
}

/*
  FUNCTION: loadJsonDB
  ENGLISH: Loads the database state from localStorage or, if not available, from an external JSON file.
  GERMAN: Lädt den Zustand der Datenbank aus dem localStorage oder, falls nicht vorhanden, aus einer externen JSON-Datei.
  PROCESS:
    1. Tries to load data from localStorage.
    2. If not found, fetches from an external file (db.json).
    3. If an error occurs, creates a default database.
  PROGRAMMING TERM: Fetch – A function to retrieve resources asynchronously.
*/
function loadJsonDB() {
  const localData = localStorage.getItem('jsonDB');
  if (localData) {
    db = JSON.parse(localData);
    console.log('DB aus localStorage geladen'); // EN: DB loaded from localStorage / DE: DB aus localStorage geladen
    renderScene(); // EN: Render the scene after loading the database / DE: Szene nach dem Laden der DB rendern
  } else {
    fetch('Projektdaten/db.json')
      .then(response => response.json())
      .then(data => {
        db = data;
        if (db.scenes.length === 0) {
          db.scenes.push(createEmptyScene(1));
        }
        renderScene();
      })
      .catch(err => {
        console.error('Fehler beim Laden der db.json, Standard-DB wird erstellt.', err);
        // EN: If there is an error, create a default database with one empty scene.
        // DE: Falls ein Fehler auftritt, erstelle eine Standard-Datenbank mit einer leeren Szene.
        db = { scenes: [createEmptyScene(1)] };
        renderScene();
      });
  }
}

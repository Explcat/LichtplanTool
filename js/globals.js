/*********************** Global Variables & DB Setup ************************/
let isEditMode = false;
let db = { scenes: [] };
let currentSceneIndex = 0;

// DOM-Elemente – szenenameDisplay as a global variable because we update it dynamically.
let szenenameDisplay = document.getElementById('szenenameDisplay');

/**
 * Creates a new empty scene with default values for faders, LED buttons, LED slider, and spotlight notes.
 * @param {number} sceneNumber 
 * @returns {object} new scene object
 */
function createEmptyScene(sceneNumber) {
  return {
    sceneNumber: sceneNumber,
    sceneName: 'Szene ' + sceneNumber,
    nextszenename: '',
    notes: '',
    image: 'szenenbilder/default.jpg',  // Das standard Bild für neue Szenen
    pultLinks: { sectionA: new Array(12).fill(0) },
    pultRechts: { sectionA: new Array(12).fill(0) },
    led: new Array(24).fill(false),      // LED buttons for current scene
    ledSlider: 0,                        // LED slider value for current scene
    verfolger: '',                       // Spotlight-Notizen
    musik: []                            // NEW: Array for music items in this scene
  };
}

/**
 * Saves the current DB state to localStorage.
 */
function saveJsonDB() {
  localStorage.setItem('jsonDB', JSON.stringify(db));
}

/**
 * Loads the DB state from localStorage or from an external JSON file.
 */
function loadJsonDB() {
  const localData = localStorage.getItem('jsonDB');
  if (localData) {
    db = JSON.parse(localData);
    console.log('DB aus localStorage geladen');
    renderScene();
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
        db = { scenes: [createEmptyScene(1)] };
        renderScene();
      });
  }
}

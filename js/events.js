/*********************** js\events.js ************************/
/*
  FILE: js\events.js
  ENGLISH: This file contains event bindings and mode handling for the lighting plan tool.
  GERMAN: Diese Datei enthält Event-Bindings und die Handhabung des Modus für das Lichtplan-Tool.
*/

/*********************** Global Variables & DOM Elements ************************/
// Global variable for music items (if not already defined)
// ENGLISH: A global array to store music items.
let musicItems = [];

// ENGLISH: Get references to important HTML elements from the page.
// GERMAN: Hole Referenzen zu wichtigen HTML-Elementen der Seite.
const toggleModeButton = document.getElementById('toggleMode');
const editSzenenameBtn = document.getElementById('editSzenenameBtn');
const pictureFileInput = document.getElementById('pictureFileInput');
const addPictureBtn = document.getElementById('addPictureBtn');

/*********************** Scene Name Editing ************************/
/*
  FUNCTION: enableSzenenameEditing
  ENGLISH: This function allows the user to edit the scene name.
  GERMAN: Diese Funktion ermöglicht es dem Benutzer, den Szenennamen zu bearbeiten.
  PROGRAMMING TERM: Function – A block of code designed to perform a particular task.
*/
function enableSzenenameEditing() {
  const input = document.createElement('input'); // EN: Create an input element. / DE: Erstelle ein Eingabefeld.
  input.type = 'text';
  input.id = 'szenenameInput';
  input.value = szenenameDisplay.textContent; // EN: Set the input value to the current scene name. / DE: Setze den Eingabewert auf den aktuellen Szenennamen.
  szenenameDisplay.parentNode.replaceChild(input, szenenameDisplay); // EN: Replace the text display with the input field. / DE: Ersetze die Textanzeige durch das Eingabefeld.
  editSzenenameBtn.textContent = 'Save'; // EN: Change button text to "Save". / DE: Ändere den Button-Text zu "Save".
}

/*
  FUNCTION: saveSzenenameEdit
  ENGLISH: This function saves the edited scene name.
  GERMAN: Diese Funktion speichert den bearbeiteten Szenennamen.
*/
function saveSzenenameEdit() {
  const input = document.getElementById('szenenameInput');
  if (input) {
    // EN: Update the scene name in the database for the current scene.
    // DE: Aktualisiere den Szenennamen in der Datenbank für die aktuelle Szene.
    db.scenes[currentSceneIndex].sceneName = input.value;
    const span = document.createElement('span'); // EN: Create a new span element. / DE: Erstelle ein neues span-Element.
    span.id = 'szenenameDisplay';
    span.textContent = input.value;
    input.parentNode.replaceChild(span, input); // EN: Replace the input field with the span that shows the new name.
    szenenameDisplay = span;
    // EN: Update the scene name in the input fields.
    // DE: Aktualisiere den Szenennamen in den Eingabefeldern.
    document.getElementById('currentSceneNameField').value = input.value;
    document.getElementById('currentSceneNameFieldRight').value = input.value;
    editSzenenameBtn.textContent = 'Edit'; // EN: Change button text back to "Edit". / DE: Ändere den Button-Text zurück zu "Edit".
  }
}

// ENGLISH: Add a click event listener to the scene name edit button.
// GERMAN: Füge dem Button zum Bearbeiten des Szenennamens einen Klick-Listener hinzu.
editSzenenameBtn.addEventListener('click', function() {
  if (editSzenenameBtn.textContent === 'Edit') {
    enableSzenenameEditing();
  } else {
    saveSzenenameEdit();
    saveJsonDB(); // EN: Save the updated database. / DE: Speichere die aktualisierte Datenbank.
  }
});

/*********************** Picture File Selection ************************/
/*
  FUNCTION: Picture Selection
  ENGLISH: When the "Add Picture" button is clicked, simulate a click on the hidden file input.
  GERMAN: Wenn der "Add Picture"-Button geklickt wird, wird ein Klick auf das versteckte Datei-Eingabefeld simuliert.
*/
addPictureBtn.addEventListener('click', function() {
  pictureFileInput.click();
});

// ENGLISH: Validate and process the selected picture file when the file input changes.
// GERMAN: Validierung und Verarbeitung der ausgewählten Bilddatei, wenn sich das Eingabefeld ändert.
pictureFileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== "image/jpeg") {
    alert("Bitte nur JPEG-Bilder auswÃ¤hlen."); // EN: Alert if the file is not a JPEG.
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert("DateigrÃ¶ÃŸe darf 10 MB nicht Ã¼berschreiten."); // EN: Alert if file size exceeds 10MB.
    return;
  }
  const localURL = "szenenbilder/" + file.name;
  // EN: Update the current scene's image property in the database.
  // DE: Aktualisiere die Bild-Eigenschaft der aktuellen Szene in der Datenbank.
  db.scenes[currentSceneIndex].image = localURL;
  document.getElementById('sceneImg').src = localURL;
  saveJsonDB();
});

/*********************** Music Section Events ************************/
/*
  FUNCTION: Add Music Button Click
  ENGLISH: When the "Add Music" button is clicked, trigger the hidden file input for music files.
  GERMAN: Wenn der "Add Music"-Button geklickt wird, wird das versteckte Datei-Eingabefeld für Musikdateien geöffnet.
*/
document.getElementById('addMusicBtn').addEventListener('click', function(){
  document.getElementById('musicFileInput').click();
});

// ENGLISH: Validate and add a music file to the current scene when a file is selected.
// GERMAN: Validierung und Hinzufügen einer Musikdatei zur aktuellen Szene, wenn eine Datei ausgewählt wird.
document.getElementById('musicFileInput').addEventListener('change', function(event){
  const file = event.target.files[0];
  if (!file) return;
  
  if (musicItems.length >= 10) {
    alert('Maximal 5 Musikdateien pro Szene sind erlaubt. Das kannst du im Code in der Datei events.js Ã¤ndern');
    return;
  }
  
  const fileUrl = 'szenenmusik/' + file.name;
  const fileName = file.name;
  
  // ENGLISH: Add the new music item to the global musicItems array.
  // DE: Füge das neue Musik-Element dem globalen Array musicItems hinzu.
  musicItems.push({ fileUrl, fileName, audio: null });
  
  // ENGLISH: Immediately update the current scene's music array in the database.
  // DE: Aktualisiere sofort das musik-Array der aktuellen Szene in der Datenbank.
  db.scenes[currentSceneIndex].musik = [...musicItems];
  
  // ENGLISH: Save the current snapshot of the scene (persisting the changes).
  // DE: Speichere den aktuellen Szenen-Snapshot (Änderungen werden übernommen).
  saveSnapshot(true);
  
  // ENGLISH: Use a slight delay to allow the DOM to update before re-rendering.
  // DE: Verwende eine kurze Verzögerung, damit die Anzeige aktualisiert werden kann, bevor neu gerendert wird.
  setTimeout(() => {
    renderPersistentMusicList();
  }, 100);
});

/*
  FUNCTION: deleteMusicItem
  ENGLISH: Deletes a music item from a scene by its scene number and music index.
  GERMAN: Löscht ein Musik-Element aus einer Szene anhand der Szenennummer und dem Index der Musikdatei.
  PARAMETERS:
    - sceneNumber: the number of the scene where the music item is located.
      (EN: The scene number / DE: Die Szenennummer)
    - musicIndex: the index of the music item to remove.
      (EN: The index in the array / DE: Der Index im Array)
*/
function deleteMusicItem(sceneNumber, musicIndex) {
  const sceneIndex = db.scenes.findIndex(s => s.sceneNumber === sceneNumber);
  if (sceneIndex === -1) return;

  // ENGLISH: Remove the music item from the specified scene's music array.
  // DE: Entferne das Musik-Element aus dem musik-Array der angegebenen Szene.
  db.scenes[sceneIndex].musik.splice(musicIndex, 1);

  // ENGLISH: Also remove the item from the global musicItems array if it is the current scene.
  // DE: Entferne das Element auch aus dem globalen Array musicItems, wenn es sich um die aktuelle Szene handelt.
  if (sceneIndex === currentSceneIndex) {
    musicItems.splice(musicIndex, 1);
  }

  // ENGLISH: Save the snapshot after deletion.
  // DE: Speichere den Snapshot nach dem Löschen.
  saveSnapshot(true);

  // ENGLISH: Update the UI by re-rendering the persistent music list.
  // DE: Aktualisiere die Benutzeroberfläche, indem die persistente Musikliste neu gerendert wird.
  renderPersistentMusicList();
}

/*********************** Mode & Snapshot Handling ************************/
/*
  FUNCTION: saveSnapshot
  ENGLISH: Saves the current state (snapshot) of the scene.
  GERMAN: Speichert den aktuellen Zustand (Snapshot) der Szene.
  PARAMETERS:
    - silent (boolean): If true, the function will not show an alert.
      (EN: A flag to indicate if the save should be silent / DE: Ein Flag, das angibt, ob die Speicherung ohne Benachrichtigung erfolgen soll.)
  PROGRAMMING TERM: Parameter – Values passed into a function to customize its behavior.
*/
function saveSnapshot(silent) {
  const scene = db.scenes[currentSceneIndex];
  // ENGLISH: Save notes from the textarea to the scene.
  // DE: Speichere die Notizen aus dem Textbereich in der Szene.
  scene.notes = document.getElementById('notes').value;
  scene.pultLinks.sectionA = collectValues('links-A');
  scene.pultRechts.sectionA = collectValues('rechts-A');

  // ENGLISH: Save LED statuses from current scene (Section A).
  // DE: Speichere die LED-Zustände der aktuellen Szene (Bereich A).
  const ledStateA = [];
  document.querySelectorAll('#led-buttons-SectionA .led-btn').forEach(btn => {
    ledStateA.push(btn.classList.contains('on'));
  });
  scene.led = ledStateA;

  // ENGLISH: Save the LED slider value using the noUiSlider API.
  // DE: Speichere den LED-Slider-Wert mit der noUiSlider API.
  const ledSliderA = document.getElementById('led-slider-A');
  scene.ledSlider = parseInt(ledSliderA.noUiSlider.get());

  // ENGLISH: Save spotlight (Verfolger) notes.
  // DE: Speichere die Spotlight-Notizen.
  scene.verfolger = document.getElementById('verfolgerInput').value;
  
  // ENGLISH: Save a copy of the current scene's music items.
  // DE: Speichere eine Kopie der Musik-Elemente der aktuellen Szene.
  scene.musik = [...musicItems];

  saveJsonDB();
  if (!silent) {
    alert('Snapshot gespeichert!'); // EN: Alert that the snapshot has been saved.
  }
}

// ENGLISH: Toggle between edit mode and read mode when the toggle button is clicked.
// GERMAN: Wechsel zwischen Edit-Mode und Read-Mode, wenn der Toggle-Button geklickt wird.
toggleModeButton.addEventListener('click', function() {
  isEditMode = !isEditMode;
  toggleModeButton.textContent = isEditMode ? 'Wechsel zu Read Mode' : 'Wechsel zu Edit Mode';
  editSzenenameBtn.style.display = isEditMode ? 'inline-block' : 'none';
  document.getElementById('newSzene').style.display = isEditMode ? 'inline-block' : 'none';
  document.getElementById('deleteSzene').style.display = isEditMode ? 'inline-block' : 'none';
  document.getElementById('addMusicBtn').style.display = isEditMode ? 'inline-block' : 'none';
  document.getElementById('notes').readOnly = !isEditMode;
  updatePictureControls();

  const ledSliderA = document.getElementById('led-slider-A');
  if (ledSliderA) {
    ledSliderA.style.pointerEvents = isEditMode ? 'auto' : 'none';
  }
  
  renderScene();
  // ENGLISH: Re-render the persistent music list to update the UI based on the current mode.
  // DE: Render die persistente Musikliste neu, um die UI entsprechend dem aktuellen Modus zu aktualisieren.
  renderPersistentMusicList();
});

/*********************** Scene Navigation ************************/
// ENGLISH: Navigate to the previous scene when the "prevScene" button is clicked.
// DE: Wechsel zur vorherigen Szene, wenn der "prevScene"-Button geklickt wird.
document.getElementById('prevScene').addEventListener('click', function() {
  saveSnapshot(true);
  if (currentSceneIndex > 0) {
    currentSceneIndex--;
    renderScene();
  } else {
    alert('Bereits bei der ersten Szene.');
  }
});

// ENGLISH: Navigate to the next scene when the "nextScene" button is clicked.
// DE: Wechsel zur nächsten Szene, wenn der "nextScene"-Button geklickt wird.
document.getElementById('nextScene').addEventListener('click', function() {
  saveSnapshot(true);
  if (currentSceneIndex < db.scenes.length - 1) {
    currentSceneIndex++;
    renderScene();
  } else {
    alert('Keine nÃ¤chste Szene vorhanden.');
  }
});

/*********************** New Scene / Delete Scene ************************/
// ENGLISH: Create a new scene when the "newSzene" button is clicked.
// DE: Erstelle eine neue Szene, wenn der "newSzene"-Button geklickt wird.
document.getElementById('newSzene').addEventListener('click', function() {
  saveSnapshot(true);
  const newScene = createEmptyScene(db.scenes[currentSceneIndex].sceneNumber + 1);
  db.scenes.splice(currentSceneIndex + 1, 0, newScene);
  renumberScenes();
  currentSceneIndex++;
  renderScene();
  saveJsonDB();
});

// ENGLISH: Delete the current scene when the "deleteSzene" button is clicked.
// DE: Lösche die aktuelle Szene, wenn der "deleteSzene"-Button geklickt wird.
document.getElementById('deleteSzene').addEventListener('click', function() {
  if (db.scenes.length <= 1) {
    alert('Mindestens eine Szene muss vorhanden sein.');
    return;
  }
  if (confirm('Szene wirklich lÃ¶schen?')) {
    db.scenes.splice(currentSceneIndex, 1);
    if (currentSceneIndex >= db.scenes.length) {
      currentSceneIndex = db.scenes.length - 1;
    }
    renumberScenes();
    renderScene();
    saveJsonDB();
  }
});

/*
  FUNCTION: renumberScenes
  ENGLISH: Renumbers all scenes in the database so that their scene numbers are sequential.
  GERMAN: Nummeriert alle Szenen in der Datenbank neu, sodass ihre Szenennummern fortlaufend sind.
*/
function renumberScenes() {
  db.scenes.forEach((scene, index) => {
    scene.sceneNumber = index + 1;
  });
}

/*********************** Snapshot Buttons ************************/
// ENGLISH: Save snapshot button click event.
// DE: Klick-Ereignis für den Button zum Speichern des Snapshots.
document.getElementById('saveSnapshot').addEventListener('click', function() {
  saveSnapshot();
});
// ENGLISH: Load snapshot button click event.
// DE: Klick-Ereignis für den Button zum Laden des Snapshots.
document.getElementById('loadSnapshot').addEventListener('click', function() {
  loadJsonDB();
  alert('Snapshot geladen!');
});

/*********************** Export / Import ************************/
/*
  FUNCTION: exportData
  ENGLISH: Exports the database as a JSON file.
  GERMAN: Exportiert die Datenbank als JSON-Datei.
*/
function exportData() {
  const dataStr = JSON.stringify(db, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "db.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/*
  FUNCTION: importData
  ENGLISH: Imports a JSON file and updates the database.
  GERMAN: Importiert eine JSON-Datei und aktualisiert die Datenbank.
*/
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      db = JSON.parse(e.target.result);
      currentSceneIndex = 0;
      renderScene();
      saveJsonDB();
      alert("Daten erfolgreich geladen!");
    } catch (error) {
      alert("Fehler beim Parsen der Datei!");
    }
  };
  reader.readAsText(file);
}

// ENGLISH: Bind export and import functionality to their buttons.
// DE: Binde Export- und Import-Funktionalitäten an die entsprechenden Buttons.
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('importBtn').addEventListener('click', function() {
  document.getElementById('importFile').click();
});
document.getElementById('importFile').addEventListener('change', importData);

/*********************** LED Slider Event ************************/
// ENGLISH: Attach update event for the current scene LED slider.
// DE: Füge ein Update-Ereignis für den LED-Slider der aktuellen Szene hinzu.
const ledSliderA = document.getElementById('led-slider-A');
if (ledSliderA && ledSliderA.noUiSlider) {
  ledSliderA.noUiSlider.on('update', function(values, handle) {
    updateLEDSliderValue(values[handle], 'led-slider-value-A');
  });
}
// ENGLISH: For the next scene LED slider (Section B) the slider is read-only so no update event is attached.
// DE: Für den LED-Slider der nächsten Szene (Bereich B) wird kein Update-Ereignis benötigt, da dieser schreibgeschützt ist.

/*********************** Initial Setup ************************/
// ENGLISH: Initialize LED buttons and vertical LED sliders for current (editable) and next (read-only) scenes.
// DE: Initialisiere LED-Buttons und vertikale LED-Slider für die aktuelle (editierbare) und die nächste (schreibgeschützte) Szene.
initLEDButtons('led-buttons-SectionA', true);   // Editable (current scene)
initLEDButtons('led-buttons-SectionB', false);    // Read-only (next scene)
initLEDSlider('led-slider-A', 0, true);             // Editable
initLEDSlider('led-slider-B', 0, false);            // Read-only
loadJsonDB();
updatePictureControls();

// ENGLISH: Add keyboard navigation for read mode.
// DE: Füge die Navigation per Tastatur im Read-Mode hinzu.
document.addEventListener('keydown', function(event) {
  // Only process keyboard events in read mode
  if (!isEditMode) {
    if (event.key === 'ArrowRight') {
      // ENGLISH: Move to next scene when the right arrow key is pressed.
      // DE: Wechsel zur nächsten Szene, wenn die rechte Pfeiltaste gedrückt wird.
      saveSnapshot(true);
      if (currentSceneIndex < db.scenes.length - 1) {
        currentSceneIndex++;
        renderScene();
      } else {
        alert('Keine nÃ¤chste Szene vorhanden.');
      }
    } else if (event.key === 'ArrowLeft') {
      // ENGLISH: Move to previous scene when the left arrow key is pressed.
      // DE: Wechsel zur vorherigen Szene, wenn die linke Pfeiltaste gedrückt wird.
      saveSnapshot(true);
      if (currentSceneIndex > 0) {
        currentSceneIndex--;
        renderScene();
      } else {
        alert('Bereits bei der ersten Szene.');
      }
    }
  }
});

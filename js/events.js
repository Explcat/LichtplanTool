/*********************** Event Bindings & Mode Handling ************************/

// DOM Elements used in events
const toggleModeButton = document.getElementById('toggleMode');
const editSzenenameBtn = document.getElementById('editSzenenameBtn');
const pictureFileInput = document.getElementById('pictureFileInput');
const addPictureBtn = document.getElementById('addPictureBtn');

/*********************** Szenenname Editing ************************/
/**
 * Enables editing the scene name.
 */
function enableSzenenameEditing() {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'szenenameInput';
  input.value = szenenameDisplay.textContent;
  szenenameDisplay.parentNode.replaceChild(input, szenenameDisplay);
  editSzenenameBtn.textContent = 'Save';
}

/**
 * Saves the edited scene name.
 */
function saveSzenenameEdit() {
  const input = document.getElementById('szenenameInput');
  if (input) {
    db.scenes[currentSceneIndex].sceneName = input.value;
    const span = document.createElement('span');
    span.id = 'szenenameDisplay';
    span.textContent = input.value;
    input.parentNode.replaceChild(span, input);
    szenenameDisplay = span;
    document.getElementById('currentSceneNameField').value = input.value;
    document.getElementById('currentSceneNameFieldRight').value = input.value;
    editSzenenameBtn.textContent = 'Edit';
  }
}

editSzenenameBtn.addEventListener('click', function() {
  if (editSzenenameBtn.textContent === 'Edit') {
    enableSzenenameEditing();
  } else {
    saveSzenenameEdit();
    saveJsonDB();
  }
});

/*********************** Bildauswahl ************************/
// Show file input when addPictureBtn is clicked
addPictureBtn.addEventListener('click', function() {
  pictureFileInput.click();
});

// Validate and process the selected picture file.
pictureFileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== "image/jpeg") {
    alert("Bitte nur JPEG-Bilder auswählen.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert("Dateigröße darf 10 MB nicht überschreiten.");
    return;
  }
  const localURL = "szenenbilder/" + file.name;
  db.scenes[currentSceneIndex].image = localURL;
  document.getElementById('sceneImg').src = localURL;
  saveJsonDB();
});

/*********************** Mode & Snapshot Handling ************************/
/**
 * Saves the current scene snapshot.
 * @param {boolean} silent - if true, no alert is shown.
 */
function saveSnapshot(silent) {
  const scene = db.scenes[currentSceneIndex];
  // Save notes from textarea
  scene.notes = document.getElementById('notes').value;
  scene.pultLinks.sectionA = collectValues('links-A');
  scene.pultRechts.sectionA = collectValues('rechts-A');

  // Save LED statuses from current scene (Section A)
  const ledStateA = [];
  document.querySelectorAll('#led-buttons-SectionA .led-btn').forEach(btn => {
    ledStateA.push(btn.classList.contains('on'));
  });
  scene.led = ledStateA;

  // Save LED slider value for current scene using noUiSlider API
  const ledSliderA = document.getElementById('led-slider-A');
  scene.ledSlider = parseInt(ledSliderA.noUiSlider.get());

  // Save spotlight (Verfolger) notes from textarea
  scene.verfolger = document.getElementById('verfolgerInput').value;

  saveJsonDB();
  if (!silent) {
    alert('Snapshot gespeichert!');
  }
}

toggleModeButton.addEventListener('click', function() {
  isEditMode = !isEditMode;
  toggleModeButton.textContent = isEditMode ? 'Wechsel zu Read Mode' : 'Wechsel zu Edit Mode';
  editSzenenameBtn.style.display = isEditMode ? 'inline-block' : 'none';
  // Update the new scene and delete scene buttons
  document.getElementById('newSzene').style.display = isEditMode ? 'inline-block' : 'none';
  document.getElementById('deleteSzene').style.display = isEditMode ? 'inline-block' : 'none';
  
  // Update the notes textarea readOnly property
  document.getElementById('notes').readOnly = !isEditMode;
  updatePictureControls();

  // Update pointer events for LED slider in section A
  const ledSliderA = document.getElementById('led-slider-A');
  if (ledSliderA) {
    ledSliderA.style.pointerEvents = isEditMode ? 'auto' : 'none';
  }
  
  renderScene();
});

/*********************** Scene Navigation ************************/
document.getElementById('prevScene').addEventListener('click', function() {
  saveSnapshot(true);
  if (currentSceneIndex > 0) {
    currentSceneIndex--;
    renderScene();
  } else {
    alert('Bereits bei der ersten Szene.');
  }
});

document.getElementById('nextScene').addEventListener('click', function() {
  saveSnapshot(true);
  if (currentSceneIndex < db.scenes.length - 1) {
    currentSceneIndex++;
    renderScene();
  } else {
    alert('Keine nächste Szene vorhanden.');
  }
});

/*********************** Neue Szene / Löschen ************************/
document.getElementById('newSzene').addEventListener('click', function() {
  saveSnapshot(true);
  const newScene = createEmptyScene(db.scenes[currentSceneIndex].sceneNumber + 1);
  db.scenes.splice(currentSceneIndex + 1, 0, newScene);
  renumberScenes();
  currentSceneIndex++;
  renderScene();
  saveJsonDB();
});

document.getElementById('deleteSzene').addEventListener('click', function() {
  if (db.scenes.length <= 1) {
    alert('Mindestens eine Szene muss vorhanden sein.');
    return;
  }
  if (confirm('Szene wirklich löschen?')) {
    db.scenes.splice(currentSceneIndex, 1);
    if (currentSceneIndex >= db.scenes.length) {
      currentSceneIndex = db.scenes.length - 1;
    }
    renumberScenes();
    renderScene();
    saveJsonDB();
  }
});

/**
 * Renumbers all scenes in the database.
 */
function renumberScenes() {
  db.scenes.forEach((scene, index) => {
    scene.sceneNumber = index + 1;
  });
}

/*********************** Snapshot Buttons ************************/
document.getElementById('saveSnapshot').addEventListener('click', function() {
  saveSnapshot();
});
document.getElementById('loadSnapshot').addEventListener('click', function() {
  loadJsonDB();
  alert('Snapshot geladen!');
});

/*********************** Export / Import ************************/
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

document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('importBtn').addEventListener('click', function() {
  document.getElementById('importFile').click();
});
document.getElementById('importFile').addEventListener('change', importData);

/*********************** LED Slider Event ************************/
// For current scene LED slider (Section A)
const ledSliderA = document.getElementById('led-slider-A');
if (ledSliderA && ledSliderA.noUiSlider) {
  ledSliderA.noUiSlider.on('update', function(values, handle) {
    updateLEDSliderValue(values[handle], 'led-slider-value-A');
  });
}
// For next scene LED slider (Section B) - read-only, so no update event needed

/*********************** Initial Setup ************************/
// Initialize LED buttons and vertical LED sliders
initLEDButtons('led-buttons-SectionA', true);   // Editable (current scene)
initLEDButtons('led-buttons-SectionB', false);    // Read-only (next scene)
initLEDSlider('led-slider-A', 0, true);             // Editable
initLEDSlider('led-slider-B', 0, false);            // Read-only
loadJsonDB();
updatePictureControls();

document.addEventListener('keydown', function(event) {
  // Only process keyboard events in read mode
  if (!isEditMode) {
    if (event.key === 'ArrowRight') {
      // Move to next scene
      saveSnapshot(true);
      if (currentSceneIndex < db.scenes.length - 1) {
        currentSceneIndex++;
        renderScene();
      } else {
        alert('Keine nächste Szene vorhanden.');
      }
    } else if (event.key === 'ArrowLeft') {
      // Move to previous scene
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

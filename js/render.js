/*********************** js/render.js ************************/
/*
  FILE: js/render.js
  ENGLISH: This file contains functions to render the current scene, update the user interface, and display scene-related information.
  GERMAN: Diese Datei enthält Funktionen zur Darstellung der aktuellen Szene, zur Aktualisierung der Benutzeroberfläche und zur Anzeige szenenbezogener Informationen.
*/

/*
  FUNCTION: renderScene
  ENGLISH: Renders the current scene including LED grids, sliders, spotlight notes, images, and music information.
  GERMAN: Rendert die aktuelle Szene, einschließlich LED-Gittern, Slidern, Spotlight-Notizen, Bildern und Musik-Informationen.
  PROGRAMMING TERM: Function – A reusable block of code that performs a specific task.
*/
function renderScene() {
  const currentScene = db.scenes[currentSceneIndex];

  // >>> FIX: Sync the global musicItems with current scene’s musik array
  // ENGLISH: Update the global musicItems array with the music items from the current scene.
  // GERMAN: Aktualisiere das globale Array musicItems mit den Musik-Elementen der aktuellen Szene.
  musicItems = currentScene.musik ? [...currentScene.musik] : [];

  // ENGLISH: Ensure the current scene has default LED values if missing.
  // GERMAN: Stelle sicher, dass die aktuelle Szene Standard-LED-Werte besitzt, falls diese fehlen.
  if (!currentScene.led || currentScene.led.length !== 24) {
    currentScene.led = new Array(24).fill(false);
  }
  if (typeof currentScene.ledSlider !== 'number') {
    currentScene.ledSlider = 0;
  }

  // ENGLISH: Update the scene number and scene name display.
  // GERMAN: Aktualisiere die Anzeige der Szenennummer und des Szenennamens.
  document.getElementById('sceneNumber').textContent = currentScene.sceneNumber;
  szenenameDisplay.textContent = currentScene.sceneName;
  
  // ENGLISH: Update the notes textarea with the current scene's notes.
  // GERMAN: Aktualisiere das Notizen-Textfeld mit den Notizen der aktuellen Szene.
  document.getElementById('notes').value = currentScene.notes;

  // ENGLISH: Update the image display for the current scene.
  // GERMAN: Aktualisiere die Bildanzeige für die aktuelle Szene.
  const sceneImg = document.getElementById('sceneImg');
  sceneImg.src = currentScene.image || "";

  // ENGLISH: Update scene name input fields on both sides.
  // GERMAN: Aktualisiere die Szenennamen-Eingabefelder auf beiden Seiten.
  document.getElementById('currentSceneNameField').value = currentScene.sceneName;
  document.getElementById('currentSceneNameFieldRight').value = currentScene.sceneName;

  // ENGLISH: Determine the next scene to be displayed (or a placeholder if none exists).
  // GERMAN: Bestimme die nächste Szene, die angezeigt werden soll (oder einen Platzhalter, falls keine vorhanden ist).
  let nextScene = db.scenes[currentSceneIndex + 1] || {
    sceneName: "Keine nÃ¤chste Szene",
    image: "",
    pultLinks: { sectionA: new Array(12).fill(0) },
    pultRechts: { sectionA: new Array(12).fill(0) },
    led: new Array(24).fill(false),
    ledSlider: 0
  };
  document.getElementById('nextSceneNameField').value = nextScene.sceneName;
  document.getElementById('nextSceneNameFieldRight').value = nextScene.sceneName;
  document.getElementById('nextSceneImg').src = nextScene.image || "";

  // ENGLISH: Render channel sliders for the current scene (editable sliders) and next scene (read-only sliders).
  // GERMAN: Rendere Kanalslider für die aktuelle Szene (editierbar) und die nächste Szene (schreibgeschützt).
  createChannelSliders('links-A', currentScene.pultLinks.sectionA);
  createChannelSliders('rechts-A', currentScene.pultRechts.sectionA);
  createChannelSliders('links-B', nextScene.pultLinks.sectionA, true);
  createChannelSliders('rechts-B', nextScene.pultRechts.sectionA, true);

  // ENGLISH: Render the scene list on the right side.
  // GERMAN: Rendere die Szenenliste auf der rechten Seite.
  renderSceneList();

  // ENGLISH: Render LED buttons and update their states for the current scene (Section A).
  // GERMAN: Rendere LED-Buttons und aktualisiere deren Zustände für die aktuelle Szene (Bereich A).
  const ledButtonsA = document.querySelectorAll('#led-buttons-SectionA .led-btn');
  ledButtonsA.forEach((btn, index) => {
    if (currentScene.led && currentScene.led[index]) {
      btn.classList.add('on');
      btn.style.backgroundColor = 'green';
    } else {
      btn.classList.remove('on');
      btn.style.backgroundColor = 'white';
    }
  });
  const ledSliderA = document.getElementById('led-slider-A');
  if (ledSliderA && ledSliderA.noUiSlider) {
    ledSliderA.noUiSlider.set(currentScene.ledSlider);
    updateLEDSliderValue(ledSliderA.noUiSlider.get(), 'led-slider-value-A');
  }

  // ENGLISH: NEW FEATURE: Check if the current scene has music items and render a warning below LED Section A.
  // GERMAN: NEUES FEATURE: Prüfe, ob die aktuelle Szene Musik-Elemente enthält und rendere einen Warnhinweis unter LED-Bereich A.
  const ledSectionA = document.getElementById('led-sectionA');
  let existingWarningA = document.getElementById('led-warning-A');
  if (currentScene.musik && currentScene.musik.length > 0) {
    if (!existingWarningA) {
      existingWarningA = document.createElement('div');
      existingWarningA.id = 'led-warning-A';
      existingWarningA.textContent = 'Musik abspielen';
      // ENGLISH: Optional styling for the warning.
      // GERMAN: Optionale Formatierung für den Warnhinweis.
      existingWarningA.style.color = 'red';
      existingWarningA.style.fontWeight = 'bold';
      existingWarningA.style.backgroundColor = 'lightcoral';
      existingWarningA.style.textAlign = 'center';
      existingWarningA.style.marginTop = '10px';
      ledSectionA.appendChild(existingWarningA);
    }
  } else {
    if (existingWarningA) {
      existingWarningA.remove();
    }
  }

  // ENGLISH: Render LED buttons and sliders for the next scene (Section B) in read-only mode.
  // GERMAN: Rendere LED-Buttons und -Slider für die nächste Szene (Bereich B) im schreibgeschützten Modus.
  const ledButtonsB = document.querySelectorAll('#led-buttons-SectionB .led-btn');
  ledButtonsB.forEach((btn, index) => {
    if (nextScene.led && nextScene.led[index]) {
      btn.classList.add('on');
      btn.style.backgroundColor = 'green';
    } else {
      btn.classList.remove('on');
      btn.style.backgroundColor = 'white';
    }
  });
  const ledSliderB = document.getElementById('led-slider-B');
  if (ledSliderB && ledSliderB.noUiSlider) {
    ledSliderB.noUiSlider.set(nextScene.ledSlider || 0);
    updateLEDSliderValue(ledSliderB.noUiSlider.get(), 'led-slider-value-B');
  }

  // ENGLISH: NEW FEATURE: Check if the next scene has music items and render a warning under LED Section B.
  // GERMAN: NEUES FEATURE: Prüfe, ob die nächste Szene Musik-Elemente enthält und rendere einen Warnhinweis unter LED-Bereich B.
  const ledSectionB = document.getElementById('led-sectionB');
  let existingWarning = document.getElementById('led-warning-B');
  if (nextScene.musik && nextScene.musik.length > 0) {
    if (!existingWarning) {
      existingWarning = document.createElement('div');
      existingWarning.id = 'led-warning-B';
      existingWarning.textContent = 'Musik gleich!';
      // ENGLISH: Optional styling for the warning.
      // GERMAN: Optionale Formatierung für den Warnhinweis.
      existingWarning.style.color = 'red';
      existingWarning.style.fontWeight = 'bold';
      existingWarning.style.backgroundColor ='yellow';
      existingWarning.style.textAlign = 'center';
      existingWarning.style.marginTop = '10px';
      ledSectionB.appendChild(existingWarning);
    }
  } else {
    if (existingWarning) {
      existingWarning.remove();
    }
  }

  // ENGLISH: Update the spotlight (Verfolger) textarea with the current scene's notes.
  // GERMAN: Aktualisiere das Spotlight (Verfolger) Textfeld mit den Notizen der aktuellen Szene.
  document.getElementById('verfolgerInput').value = currentScene.verfolger || '';

  // ENGLISH: Update or render the persistent music list display.
  // GERMAN: Aktualisiere oder rendere die persistente Musikliste.
  if (document.getElementById('persistentMusicList')) {
      updatePersistentMusicListStyles();
  } else {
      renderPersistentMusicList();
  }

  // ENGLISH: Update picture controls based on the current mode (edit or read).
  // GERMAN: Aktualisiere die Bildsteuerung basierend auf dem aktuellen Modus (Edit oder Read).
  updatePictureControls();

  // ENGLISH: Update the background color of the body based on the current mode.
  // GERMAN: Aktualisiere die Hintergrundfarbe des Bodys basierend auf dem aktuellen Modus.
  document.body.style.backgroundColor = isEditMode ? '#ffffe0' : '#ffffff';
}

/*
  FUNCTION: renderSceneList
  ENGLISH: Renders a list of all scenes on the right side of the interface.
  GERMAN: Rendert eine Liste aller Szenen auf der rechten Seite der Benutzeroberfläche.
*/
function renderSceneList() {
  const szenelistDiv = document.getElementById('szenelist');
  szenelistDiv.innerHTML = "";
  db.scenes.forEach((scene, index) => {
    const item = document.createElement('div');
    item.classList.add('szenelist-item');
    if (index === currentSceneIndex) {
      item.classList.add('current');
    }
    // ENGLISH: Display the scene number and name.
    // GERMAN: Zeige die Szenennummer und den Namen an.
    item.textContent = scene.sceneNumber + ": " + scene.sceneName;
    // ENGLISH: Add a click event to switch to the selected scene.
    // GERMAN: Füge ein Klick-Ereignis hinzu, um zur ausgewählten Szene zu wechseln.
    item.addEventListener('click', function() {
      saveSnapshot(true);
      currentSceneIndex = index;
      renderScene();
    });
    szenelistDiv.appendChild(item);
  });
  
  // ENGLISH: Update LED controls for the next scene by adding a "readonly" class.
  // GERMAN: Aktualisiere die LED-Steuerung für die nächste Szene, indem die Klasse "readonly" hinzugefügt wird.
  document.getElementById('led-sectionB').classList.add('readonly');
}

/*
  FUNCTION: updatePictureControls
  ENGLISH: Shows or hides the picture controls based on whether the app is in edit mode.
  GERMAN: Zeigt oder versteckt die Bildsteuerung, abhängig davon, ob die App im Edit-Modus ist.
*/
function updatePictureControls() {
  const addPictureBtn = document.getElementById('addPictureBtn');
  addPictureBtn.style.display = isEditMode ? 'inline-block' : 'none';
}

/*
  FUNCTION: renderPersistentMusicList
  ENGLISH: Renders the persistent music player list, displaying scene information and associated music files.
  GERMAN: Rendert die persistente Musikspieler-Liste, welche Szeneninformationen und zugehörige Musikdateien anzeigt.
  DETAILS:
    - For each scene with music items, display the scene number, name, and filename.
    - In edit mode, add a delete button for each music item.
*/
function renderPersistentMusicList() {
  let persistentContainer = document.getElementById('persistentMusicList');
  if (!persistentContainer) {
    const musikDiv = document.getElementById('musik');
    persistentContainer = document.createElement('div');
    persistentContainer.id = 'persistentMusicList';
    persistentContainer.style.paddingTop = '10px';
    persistentContainer.style.borderTop = '1px solid #ccc';
    musikDiv.appendChild(persistentContainer);
  } else {
    // ENGLISH: Clear existing content so new items can be added.
    // GERMAN: Lösche vorhandenen Inhalt, damit neue Elemente hinzugefügt werden können.
    persistentContainer.innerHTML = '';
  }
  
  // ENGLISH: Sort scenes by scene number.
  // GERMAN: Sortiere die Szenen nach der Szenennummer.
  const sortedScenes = db.scenes.slice().sort((a, b) => a.sceneNumber - b.sceneNumber);
  
  sortedScenes.forEach(scene => {
    if (scene.musik && scene.musik.length > 0) {
      const sceneDiv = document.createElement('div');
      sceneDiv.classList.add('scene-music');
      sceneDiv.setAttribute('data-scene-number', scene.sceneNumber);
      persistentContainer.appendChild(sceneDiv);

      // ENGLISH: Create a header row displaying the scene number and name.
      // GERMAN: Erstelle eine Kopfzeile, die die Szenennummer und den Namen anzeigt.
      const headerRow = document.createElement('div');
      headerRow.classList.add('scene-header');
      headerRow.textContent = `Szene ${scene.sceneNumber}: ${scene.sceneName}`;
      sceneDiv.appendChild(headerRow);

      // ENGLISH: If this is the current scene, display a "Play" warning.
      // GERMAN: Falls dies die aktuelle Szene ist, zeige einen "Abspielen!"-Hinweis an.
      if (scene.sceneNumber === db.scenes[currentSceneIndex].sceneNumber) {
        const warning = document.createElement('div');
        warning.classList.add('scene-warning');
        warning.textContent = 'Abspielen!';
        headerRow.appendChild(warning);
      }
      
      // ENGLISH: Create a container for music items.
      // GERMAN: Erstelle einen Container für die Musik-Elemente.
      const itemsContainer = document.createElement('div');
      itemsContainer.classList.add('music-items');
      scene.musik.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('music-item');
        
        // ENGLISH: Display the filename of the music file.
        // GERMAN: Zeige den Dateinamen der Musikdatei an.
        const fileLabel = document.createElement('div');
        fileLabel.classList.add('music-filename');
        fileLabel.textContent = item.fileName + ':';
        itemRow.appendChild(fileLabel);

        // ENGLISH: Create an audio element for the music file.
        // GERMAN: Erstelle ein Audio-Element für die Musikdatei.
        const audioContainer = document.createElement('div');
        audioContainer.classList.add('music-player');
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        audioElem.src = item.fileUrl;
        // ENGLISH: Prevent arrow keys from affecting scene navigation.
        // GERMAN: Verhindere, dass die Pfeiltasten die Szenennavigation beeinflussen.
        audioElem.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.stopPropagation();
          }
        });
        audioContainer.appendChild(audioElem);
        itemRow.appendChild(audioContainer);

        // ENGLISH: In edit mode, add a delete button for the music item.
        // GERMAN: Im Edit-Modus, füge einen Lösch-Button für das Musik-Element hinzu.
        if (isEditMode) {
          const btnContainer = document.createElement('div');
          btnContainer.classList.add('music-actions');
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteMusicItem(scene.sceneNumber, index);
          });
          btnContainer.appendChild(deleteBtn);
          itemRow.appendChild(btnContainer);
        }

        itemsContainer.appendChild(itemRow);
      });
      
      sceneDiv.appendChild(itemsContainer);
    }
  });
}

/*
  FUNCTION: updatePersistentMusicListStyles
  ENGLISH: Updates the styles of the persistent music list items, changing background colors and warnings based on the current and next scenes.
  GERMAN: Aktualisiert die Stilvorlagen der persistenten Musikliste, indem Hintergrundfarben und Warnhinweise basierend auf der aktuellen und nächsten Szene geändert werden.
*/
function updatePersistentMusicListStyles() {
  const persistentContainer = document.getElementById('persistentMusicList');
  if (!persistentContainer) return;

  const currentScene = db.scenes[currentSceneIndex];
  const nextScene = db.scenes[currentSceneIndex + 1];

  Array.from(persistentContainer.children).forEach(sceneDiv => {
    const sceneNumber = parseInt(sceneDiv.getAttribute('data-scene-number'), 10);
    
    // ENGLISH: Set background colors for the current and next scenes.
    // GERMAN: Setze Hintergrundfarben für die aktuelle und nächste Szene.
    if (sceneNumber === currentScene.sceneNumber) {
      sceneDiv.style.backgroundColor = 'lightcoral';
    } else if (nextScene && sceneNumber === nextScene.sceneNumber) {
      sceneDiv.style.backgroundColor = 'yellow';
    } else {
      sceneDiv.style.backgroundColor = '';
    }
    
    // ENGLISH: Update the warning text ("Abspielen!") in the header row for the current scene.
    // GERMAN: Aktualisiere den Warnhinweis ("Abspielen!") in der Kopfzeile für die aktuelle Szene.
    const headerRow = sceneDiv.querySelector('.scene-header');
    if (headerRow) {
      const existingWarning = headerRow.querySelector('.scene-warning');
      if (sceneNumber === currentScene.sceneNumber) {
        if (!existingWarning) {
          const warning = document.createElement('div');
          warning.classList.add('scene-warning');
          warning.textContent = 'Abspielen!';
          headerRow.appendChild(warning);
        } else {
          existingWarning.textContent = 'Abspielen!';
        }
      } else {
        if (existingWarning) {
          existingWarning.remove();
        }
      }
    }
  });
}

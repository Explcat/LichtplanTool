/*********************** Rendering Functions ************************/

/**
 * Renders the current scene including LED grids, sliders, spotlight notes, and updates music displays.
 */
function renderScene() {
  const currentScene = db.scenes[currentSceneIndex];

  // >>> FIX: Sync the global musicItems with current scene’s musik array
  musicItems = currentScene.musik ? [...currentScene.musik] : [];

  // Ensure default LED values if missing.
  if (!currentScene.led || currentScene.led.length !== 24) {
    currentScene.led = new Array(24).fill(false);
  }
  if (typeof currentScene.ledSlider !== 'number') {
    currentScene.ledSlider = 0;
  }

  document.getElementById('sceneNumber').textContent = currentScene.sceneNumber;
  szenenameDisplay.textContent = currentScene.sceneName;
  
  // Update notes textarea value
  document.getElementById('notes').value = currentScene.notes;

  // Update image if exists
  const sceneImg = document.getElementById('sceneImg');
  sceneImg.src = currentScene.image || "";

  // Update scene name fields
  document.getElementById('currentSceneNameField').value = currentScene.sceneName;
  document.getElementById('currentSceneNameFieldRight').value = currentScene.sceneName;

  // Determine next scene
  let nextScene = db.scenes[currentSceneIndex + 1] || {
    sceneName: "Keine nächste Szene",
    image: "",
    pultLinks: { sectionA: new Array(12).fill(0) },
    pultRechts: { sectionA: new Array(12).fill(0) },
    led: new Array(24).fill(false),
    ledSlider: 0
  };
  document.getElementById('nextSceneNameField').value = nextScene.sceneName;
  document.getElementById('nextSceneNameFieldRight').value = nextScene.sceneName;
  document.getElementById('nextSceneImg').src = nextScene.image || "";

  // Render channel sliders for current and next scenes
  createChannelSliders('links-A', currentScene.pultLinks.sectionA);
  createChannelSliders('rechts-A', currentScene.pultRechts.sectionA);
  createChannelSliders('links-B', nextScene.pultLinks.sectionA, true);
  createChannelSliders('rechts-B', nextScene.pultRechts.sectionA, true);

  renderSceneList();

  // Render LED Buttons and Sliders for current scene (Section A)
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

  // Render LED Buttons and Sliders for next scene (Section B) - read-only
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
   // NEW FEATURE: Check if next scene has music items and render warning under LED Section B
  const ledSectionB = document.getElementById('led-sectionB');
  let existingWarning = document.getElementById('led-warning-B');
  if (nextScene.musik && nextScene.musik.length > 0) {
    if (!existingWarning) {
      existingWarning = document.createElement('div');
      existingWarning.id = 'led-warning-B';
      existingWarning.textContent = 'Musik gleich!';
      // Optional styling for the warning
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

  // Update spotlight (Verfolger) textarea value
  document.getElementById('verfolgerInput').value = currentScene.verfolger || '';

  // Render the persistent music player (all scenes)
  renderPersistentMusicList();

  // Update picture controls based on mode
  updatePictureControls();

  // Update body background color based on mode
  document.body.style.backgroundColor = isEditMode ? '#ffffe0' : '#ffffff';
}


/**
 * Renders the scene list on the right.
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
    // Combine scene number and scene name in the list item.
    item.textContent = scene.sceneNumber + ": " + scene.sceneName;
    // Switch scene on click
    item.addEventListener('click', function() {
      saveSnapshot(true);
      currentSceneIndex = index;
      renderScene();
    });
    szenelistDiv.appendChild(item);
  });
  
  // Also update LED controls for next scene (read-only) by adding a readonly class
  document.getElementById('led-sectionB').classList.add('readonly');
}

/**
 * Updates picture controls based on mode.
 */
function updatePictureControls() {
  const addPictureBtn = document.getElementById('addPictureBtn');
  addPictureBtn.style.display = isEditMode ? 'inline-block' : 'none';
}

/**
 * Renders the persistent music player in a dedicated container inside the #musik section.
 * For each scene with music items, displays the scene number, scene name, and the filename.
 * If the scene matches the current scene, a warning "Achtung Musik!" is displayed.
 * In edit mode, each music item also gets a Delete button.
 */
function renderPersistentMusicList() {
  // Use (or create) a container with id "persistentMusicList" inside the #musik section.
  let persistentContainer = document.getElementById('persistentMusicList');
  if (!persistentContainer) {
    const musikDiv = document.getElementById('musik');
    persistentContainer = document.createElement('div');
    persistentContainer.id = 'persistentMusicList';
    persistentContainer.style.paddingTop = '10px';
    persistentContainer.style.borderTop = '1px solid #ccc';
    musikDiv.appendChild(persistentContainer);
  }
  
  // Clear previous content
  persistentContainer.innerHTML = '';
  
  // Sort scenes by sceneNumber in ascending order
  const sortedScenes = db.scenes.slice().sort((a, b) => a.sceneNumber - b.sceneNumber);
  
  sortedScenes.forEach(scene => {
    if (scene.musik && scene.musik.length > 0) {
      // Main container for the scene with a grid layout (2 rows)
      const sceneDiv = document.createElement('div');
      sceneDiv.classList.add('scene-music');

// If this scene is the current scene, change background color to light red.
      // Else if it's the next scene, change background color to yellow.
      const currentScene = db.scenes[currentSceneIndex];
      const nextScene = db.scenes[currentSceneIndex + 1];
      if (scene.sceneNumber === currentScene.sceneNumber) {
        sceneDiv.style.backgroundColor = 'lightcoral';
      } else if (nextScene && scene.sceneNumber === nextScene.sceneNumber) {
        sceneDiv.style.backgroundColor = 'yellow';
      }
      
      // Row 1: Header row for scene number, scene name, and optional warning.
      const headerRow = document.createElement('div');
      headerRow.classList.add('scene-header');
      headerRow.textContent = `Szene ${scene.sceneNumber}: ${scene.sceneName}`;
      sceneDiv.appendChild(headerRow);
      
      // If the scene is the current scene, add a warning element
      if (scene.sceneNumber === db.scenes[currentSceneIndex].sceneNumber) {
        const warning = document.createElement('div');
        warning.classList.add('scene-warning');
        warning.textContent = 'Abspielen!';
        headerRow.appendChild(warning);
      }
      
      // Row 2: Container for music items
      const itemsContainer = document.createElement('div');
      itemsContainer.classList.add('music-items');
      
      // Iterate over all music items in this scene
      scene.musik.forEach((item, index) => {
        // Each music item is a grid row with fixed column for filename and flexible column for player and button
        const itemRow = document.createElement('div');
        itemRow.classList.add('music-item');
        
        // Column 1: Filename with a fixed width
        const fileLabel = document.createElement('div');
        fileLabel.classList.add('music-filename');
        fileLabel.textContent = item.fileName + ':';
        itemRow.appendChild(fileLabel);
        
        // Column 2: HTML5 audio element
        const audioContainer = document.createElement('div');
        audioContainer.classList.add('music-player');
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        audioElem.src = item.fileUrl;
        audioContainer.appendChild(audioElem);
        itemRow.appendChild(audioContainer);
        
        // Column 3: In edit mode, add a Delete button
        if (isEditMode) {
          const btnContainer = document.createElement('div');
          btnContainer.classList.add('music-actions');
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', function(e) {
            // Remove the item from the scene's musik array
            const sceneIndex = db.scenes.findIndex(s => s.sceneNumber === scene.sceneNumber);
            if (sceneIndex !== -1) {
              db.scenes[sceneIndex].musik.splice(index, 1);
              renderPersistentMusicList();
              // If the current scene was affected, update the snapshot.
              if (scene.sceneNumber === db.scenes[currentSceneIndex].sceneNumber) {
                saveSnapshot(true);
              }
            }
            e.stopPropagation();
          });
          btnContainer.appendChild(deleteBtn);
          itemRow.appendChild(btnContainer);
        }
        
        itemsContainer.appendChild(itemRow);
      });
      
      sceneDiv.appendChild(itemsContainer);
      persistentContainer.appendChild(sceneDiv);
    }
  });
}


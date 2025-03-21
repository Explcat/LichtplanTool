/*********************** Rendering Functions ************************/

/**
 * Renders the current scene including LED grids, sliders, spotlight notes, and updates music displays.
 */
function renderScene() {
  const currentScene = db.scenes[currentSceneIndex];

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
  // Update LED slider for current scene
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
  
  // Update spotlight (Verfolger) textarea value
  document.getElementById('verfolgerInput').value = currentScene.verfolger || '';
  
  // Update music items for the current scene (for editing in #musicList)
  if (!currentScene.musik) {
    currentScene.musik = [];
  }
  musicItems = currentScene.musik;
  renderMusicList();
  
  // Render persistent music player (all scenes)
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
 * Renders the music list in the #musicList div (for editing, including delete buttons).
 */
function renderMusicList() {
  const musicList = document.getElementById('musicList');
  musicList.innerHTML = '';
  musicItems.forEach((item, index) => {
    const container = document.createElement('div');
    container.classList.add('music-item');
    container.style.marginBottom = '5px';
    
    // Display the file name
    const fileLabel = document.createElement('span');
    fileLabel.textContent = item.fileName + ': ';
    container.appendChild(fileLabel);
    
    // Create the HTML5 audio element with controls
    const audioElem = document.createElement('audio');
    audioElem.controls = true;
    audioElem.src = item.fileUrl;
    container.appendChild(audioElem);
    
    // In edit mode, add a Delete button for each music item.
    if (isEditMode) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.addEventListener('click', function(e) {
        // Remove the item from the musicItems array
        musicItems.splice(index, 1);
        renderMusicList();
        // Save the snapshot so that deletion is persisted in the scene's DB entry.
        saveSnapshot(true);
        e.stopPropagation();
      });
      container.appendChild(deleteBtn);
    }
    
    musicList.appendChild(container);
  });
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
  persistentContainer.innerHTML = '<h3>Persistent Music Player</h3>';
  
  db.scenes.forEach(scene => {
    if (scene.musik && scene.musik.length > 0) {
      // Container for music items of this scene
      const sceneDiv = document.createElement('div');
      sceneDiv.classList.add('scene-music');
      
      // Header with scene number and scene name
      const header = document.createElement('h4');
      header.textContent = `Szene ${scene.sceneNumber}: ${scene.sceneName}`;
      sceneDiv.appendChild(header);
      
      // If the scene is the current scene, display a warning
      if (scene.sceneNumber === db.scenes[currentSceneIndex].sceneNumber) {
        const warning = document.createElement('div');
        warning.style.color = 'red';
        warning.textContent = 'Achtung Musik!';
        sceneDiv.appendChild(warning);
      }
      
      // Iterate over all music items in this scene
      scene.musik.forEach((item, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('music-item');
        itemContainer.style.marginBottom = '5px';
        
        // Display the filename
        const fileLabel = document.createElement('span');
        fileLabel.textContent = item.fileName + ': ';
        itemContainer.appendChild(fileLabel);
        
        // Create the HTML5 audio element with controls
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        audioElem.src = item.fileUrl;
        itemContainer.appendChild(audioElem);
        
        // In edit mode, add a Delete button for each music item.
        if (isEditMode) {
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.style.marginLeft = '10px';
          deleteBtn.addEventListener('click', function(e) {
            // Remove the item from the scene's musik array
            const sceneIndex = db.scenes.findIndex(s => s.sceneNumber === scene.sceneNumber);
            if (sceneIndex !== -1) {
              db.scenes[sceneIndex].musik.splice(index, 1);
              renderPersistentMusicList();
              // If the current scene was affected, also update the editable music list.
              if (scene.sceneNumber === db.scenes[currentSceneIndex].sceneNumber) {
                renderMusicList();
                saveSnapshot(true);
              }
            }
            e.stopPropagation();
          });
          itemContainer.appendChild(deleteBtn);
        }
        
        sceneDiv.appendChild(itemContainer);
      });
      
      persistentContainer.appendChild(sceneDiv);
    }
  });
}

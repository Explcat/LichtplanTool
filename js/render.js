/*********************** Rendering Functions ************************/

/**
 * Renders the current scene including LED grids, sliders, spotlight notes, and music.
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
  
  // Load and render music for the current scene.
  if (!currentScene.musik) {
    currentScene.musik = [];
  }
  musicItems = currentScene.musik;
  renderMusicList();

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
    item.textContent = scene.sceneName;
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
 * Renders the music list in the #musicList div.
 */
function renderMusicList() {
  const musicList = document.getElementById('musicList');
  musicList.innerHTML = '';
  musicItems.forEach((item, index) => {
    const musicDiv = document.createElement('div');
    musicDiv.classList.add('music-item');
    musicDiv.style.marginBottom = '5px';
    
    // Display filename
    const fileLabel = document.createElement('span');
    fileLabel.textContent = item.fileName + ' ';
    musicDiv.appendChild(fileLabel);
    
    // Create Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    musicDiv.appendChild(playBtn);
    
    // Create Stop button
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    musicDiv.appendChild(stopBtn);
    
    // Create audio element if not already created
    if (!item.audio) {
      item.audio = new Audio(item.fileUrl);
    }
    
    // Button event bindings
    playBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      item.audio.play();
    });
    
    stopBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      item.audio.pause();
      item.audio.currentTime = 0;
    });
    
    // Allow the whole music item div to toggle play/pause when clicked
    musicDiv.addEventListener('click', function() {
      if (item.audio.paused) {
        item.audio.play();
      } else {
        item.audio.pause();
        item.audio.currentTime = 0;
      }
    });
    
    musicList.appendChild(musicDiv);
  });
}

/*********************** Rendering Functions ************************/

/**
 * Renders the current scene including LED grid, sliders, and spotlight notes.
 */
function renderScene() {
  const currentScene = db.scenes[currentSceneIndex];
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
    pultRechts: { sectionA: new Array(12).fill(0) }
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

  // Render LED Buttons based on current DB value
  const ledButtons = document.querySelectorAll('.led-btn');
  ledButtons.forEach((btn, index) => {
    if (currentScene.led && currentScene.led[index]) {
      btn.classList.add('on');
      btn.style.backgroundColor = 'green';
    } else {
      btn.classList.remove('on');
      btn.style.backgroundColor = 'white';
    }
  });

  // Update LED slider value using noUiSlider API
  const ledSlider = document.getElementById('led-slider');
  if (ledSlider && ledSlider.noUiSlider) {
    ledSlider.noUiSlider.set(currentScene.ledSlider || 0);
    updateLEDSliderValue(ledSlider.noUiSlider.get());
  }

  // Update spotlight (Verfolger) textarea value
  document.getElementById('verfolgerInput').value = currentScene.verfolger || '';
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
}

/**
 * Updates picture controls based on mode.
 */
function updatePictureControls() {
  const addPictureBtn = document.getElementById('addPictureBtn');
  addPictureBtn.style.display = isEditMode ? 'inline-block' : 'none';
}

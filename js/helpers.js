/*********************** Helper Functions ************************/

/**
 * Creates a noUiSlider on the given element.
 * Used for channel sliders.
 * @param {HTMLElement} element 
 * @param {number} startValue 
 * @param {boolean} readOnly 
 */
function createSlider(element, startValue, readOnly = false) {
  noUiSlider.create(element, {
    start: startValue,
    step: 1,
    range: { 'min': 0, 'max': 10 },
    orientation: 'vertical',
    direction: 'rtl', // Niedrigste Werte unten
    tooltips: true,
    animate: false
  });
  element.style.pointerEvents = readOnly ? 'none' : (isEditMode ? 'auto' : 'none');
}

/**
 * Creates 12 vertical sliders in a container based on an array of values.
 * @param {string} containerId 
 * @param {Array} values 
 * @param {boolean} readOnly 
 */
function createChannelSliders(containerId, values, readOnly = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const chanDiv = document.createElement('div');
    chanDiv.classList.add('channel');

    // Label above the slider
    const label = document.createElement('div');
    label.classList.add('slider-label');
    label.textContent = i + 1;
    chanDiv.appendChild(label);

    // Slider container
    const sliderDiv = document.createElement('div');
    sliderDiv.classList.add('slider');
    sliderDiv.id = containerId + '-channel-' + (i + 1);
    chanDiv.appendChild(sliderDiv);
    container.appendChild(chanDiv);

    let initial = (values && values[i] !== undefined) ? values[i] : 0;
    createSlider(sliderDiv, initial, readOnly);
  }
}

/**
 * Initializes the LED button grid (4 rows x 6 columns) in a given container.
 * Each button is labeled with its number (1-24) and toggles its state on click.
 * @param {string} containerId - The ID of the container element.
 * @param {boolean} editable - If true, buttons are clickable (only toggled in edit mode).
 */
function initLEDButtons(containerId, editable = true) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const btn = document.createElement('button');
    btn.classList.add('led-btn');
    btn.dataset.index = i;
    btn.textContent = i + 1; // Display button number (1 to 24)
    if (editable) {
      btn.addEventListener('click', function() {
        if (!isEditMode) return;  // Only allow toggling in edit mode
        btn.classList.toggle('on');
        btn.style.backgroundColor = btn.classList.contains('on') ? 'green' : 'white';
      });
    }
    container.appendChild(btn);
    // Insert a line break after every 6 buttons
    if ((i + 1) % 6 === 0) {
      container.appendChild(document.createElement('br'));
    }
  }
}

/**
 * Initializes a vertical noUiSlider for the LED slider in a given container.
 * @param {string} containerId - The ID of the slider element.
 * @param {number} startValue - The initial slider value.
 * @param {boolean} editable - If true, slider is interactive in edit mode.
 */
function initLEDSlider(containerId, startValue, editable = true) {
  const slider = document.getElementById(containerId);
  noUiSlider.create(slider, {
    start: startValue,
    step: 1,
    range: { min: 0, max: 100 },
    orientation: 'vertical',
    direction: 'rtl',
    tooltips: true,
    animate: false
  });
  slider.style.pointerEvents = editable ? (isEditMode ? 'auto' : 'none') : 'none';
}

/**
 * Updates the LED slider value display.
 * @param {number|string} value 
 * @param {string} displayId - The ID of the element to update.
 */
function updateLEDSliderValue(value, displayId) {
  document.getElementById(displayId).textContent = value + '%';
}

/**
 * Collects slider values from a given container.
 * @param {string} containerId 
 * @returns {Array} values of sliders
 */
function collectValues(containerId) {
  const container = document.getElementById(containerId);
  const sliders = container.getElementsByClassName('slider');
  const values = [];
  for (let sliderDiv of sliders) {
    let value = sliderDiv.noUiSlider.get();
    values.push(parseInt(value));
  }
  return values;
}

/*********************** Helper Functions ************************/

/**
 * Creates a noUiSlider on the given element.
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
 * Initializes the LED button grid (4 rows x 6 columns).
 * Each button is labeled with its number (1-24) and toggles its state on click.
 */
function initLEDButtons() {
  const ledButtonsContainer = document.getElementById('led-buttons');
  ledButtonsContainer.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const btn = document.createElement('button');
    btn.classList.add('led-btn');
    btn.dataset.index = i;
    btn.textContent = i + 1; // Display button number (1 to 24)
    // Toggle LED status on click – always responsive regardless of edit mode.
    btn.addEventListener('click', function() {
      btn.classList.toggle('on');
      // Background color will update based on class (CSS handles .led-btn.on)
      btn.style.backgroundColor = btn.classList.contains('on') ? 'green' : 'white';
    });
    ledButtonsContainer.appendChild(btn);
    // Insert a line break after every 6 buttons
    if ((i + 1) % 6 === 0) {
      ledButtonsContainer.appendChild(document.createElement('br'));
    }
  }
}

/**
 * Initializes a vertical noUiSlider for the LED slider in the LED section.
 */
function initLEDSlider() {
  const slider = document.getElementById('led-slider');
  noUiSlider.create(slider, {
    start: 0,
    step: 1,
    range: { min: 0, max: 100 },
    orientation: 'vertical',
    direction: 'rtl',
    tooltips: true,
    animate: false
  });
}

/**
 * Updates the LED slider value display.
 * @param {number|string} value 
 */
function updateLEDSliderValue(value) {
  document.getElementById('led-slider-value').textContent = value + '%';
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

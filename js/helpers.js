/*********************** js/helpers.js ************************/
/*
  FILE: js/helpers.js
  ENGLISH: This file contains helper functions used by the lighting plan tool.
  GERMAN: Diese Datei enthält Hilfsfunktionen, die im Lichtplan-Tool verwendet werden.
*/

/*********************** Helper Functions ************************/

/*
  FUNCTION: createSlider
  ENGLISH: Creates a vertical slider using the noUiSlider library.
  GERMAN: Erstellt einen vertikalen Slider mit der noUiSlider-Bibliothek.
  PARAMETERS:
    - element (HTMLElement): The HTML element where the slider will be created.
      (EN: The target element / DE: Das Ziel-Element)
    - startValue (number): The initial value of the slider.
      (EN: Starting value / DE: Startwert)
    - readOnly (boolean, optional): Whether the slider should be non-interactive.
      (EN: Flag to set slider as read-only / DE: Flag, um den Slider schreibgeschützt zu machen)
  PROGRAMMING TERM: Library – Prewritten code to help with common tasks.
*/
function createSlider(element, startValue, readOnly = false) {
  noUiSlider.create(element, {
    start: startValue,
    step: 1,
    range: { 'min': 0, 'max': 10 },
    orientation: 'vertical',
    direction: 'rtl', // ENGLISH: Lower values at the bottom. / GERMAN: Niedrigste Werte unten.
    tooltips: true,
    animate: false
  });
  // ENGLISH: Allow interaction if not read-only and in edit mode.
  // GERMAN: Erlaube Interaktion, wenn nicht schreibgeschützt und im Edit-Modus.
  element.style.pointerEvents = readOnly ? 'none' : (isEditMode ? 'auto' : 'none');
}

/*
  FUNCTION: createChannelSliders
  ENGLISH: Creates 12 vertical sliders in a container based on an array of values.
  GERMAN: Erstellt 12 vertikale Slider in einem Container basierend auf einem Array von Werten.
  PARAMETERS:
    - containerId (string): The ID of the container element.
      (EN: Container ID / DE: Container-ID)
    - values (Array): An array of values for initializing each slider.
      (EN: Slider values / DE: Slider-Werte)
    - readOnly (boolean, optional): Whether the sliders should be non-interactive.
      (EN: Read-only flag / DE: Schreibschutz-Flag)
  PROGRAMMING TERM: Loop – A structure to repeat a block of code.
*/
function createChannelSliders(containerId, values, readOnly = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // ENGLISH: Clear the container / GERMAN: Leere den Container.
  
  // ENGLISH: If this container is for the right control panel, apply a horizontal flex layout.
  // GERMAN: Falls der Container für das rechte Mischpult gedacht ist, verwende ein horizontales Flex-Layout.
  if (containerId.indexOf('rechts') !== -1) {
    container.style.display = 'flex';
    container.style.flexWrap = 'nowrap';
    container.style.alignItems = 'flex-start';
  }

  // ENGLISH: Create 12 sliders using a loop.
  // GERMAN: Erstelle 12 Slider mithilfe einer Schleife.
  for (let i = 0; i < 12; i++) {
    // ENGLISH: For the right panel, add a gap after the 6th slider.
    // GERMAN: Beim rechten Panel, füge nach dem 6. Slider einen Abstand hinzu.
    if (i === 6 && containerId.indexOf('rechts') !== -1) {
      const gapDiv = document.createElement('div');
      gapDiv.style.width = '20px';  // ENGLISH: Adjust gap width as needed / DE: Passe die Breite des Abstands an.
      gapDiv.style.display = 'inline-block';
      container.appendChild(gapDiv);
    }
    
    const chanDiv = document.createElement('div');
    chanDiv.classList.add('channel');
    
    // ENGLISH: For the right control panel, ensure each channel is displayed inline.
    // GERMAN: Für das rechte Mischpult, stelle sicher, dass jeder Kanal inline angezeigt wird.
    if (containerId.indexOf('rechts') !== -1) {
      chanDiv.style.display = 'inline-block';
    }

    // ENGLISH: Create a label above the slider showing the channel number.
    // GERMAN: Erstelle ein Label oberhalb des Sliders, das die Kanalnummer anzeigt.
    const label = document.createElement('div');
    label.classList.add('slider-label');
    label.textContent = i + 1;
    chanDiv.appendChild(label);

    // ENGLISH: Create a container for the slider and set its ID.
    // GERMAN: Erstelle einen Container für den Slider und setze dessen ID.
    const sliderDiv = document.createElement('div');
    sliderDiv.classList.add('slider');
    sliderDiv.id = containerId + '-channel-' + (i + 1);
    chanDiv.appendChild(sliderDiv);
    container.appendChild(chanDiv);

    // ENGLISH: Set the initial value for each slider, defaulting to 0 if not provided.
    // GERMAN: Setze den Startwert für jeden Slider, standardmäßig auf 0, falls nicht angegeben.
    let initial = (values && values[i] !== undefined) ? values[i] : 0;
    createSlider(sliderDiv, initial, readOnly);
  }
}

/*
  FUNCTION: initLEDButtons
  ENGLISH: Initializes a grid of 24 LED buttons (4 rows x 6 columns) in a given container.
  GERMAN: Initialisiert ein Gitter von 24 LED-Buttons (4 Reihen x 6 Spalten) in einem bestimmten Container.
  PARAMETERS:
    - containerId (string): The ID of the container element where the buttons will be created.
      (EN: Container ID / DE: Container-ID)
    - editable (boolean): If true, the buttons are clickable (only toggled in edit mode).
      (EN: Editable flag / DE: Editierbar-Flag)
  PROGRAMMING TERM: Event Listener – Code that waits for an event (like a click) to occur.
*/
function initLEDButtons(containerId, editable = true) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // ENGLISH: Clear any existing content / DE: Entferne vorhandenen Inhalt.
  for (let i = 0; i < 24; i++) {
    const btn = document.createElement('button');
    btn.classList.add('led-btn');
    btn.dataset.index = i;
    btn.textContent = i + 1; // ENGLISH: Display the button number (1 to 24) / DE: Zeige die Button-Nummer (1 bis 24) an.
    if (editable) {
      // ENGLISH: Add a click event to toggle the LED state only when in edit mode.
      // DE: Füge ein Klick-Ereignis hinzu, um den LED-Zustand nur im Edit-Modus umzuschalten.
      btn.addEventListener('click', function() {
        if (!isEditMode) return;  // ENGLISH: Only allow toggling in edit mode / DE: Schalte den Button nur im Edit-Modus um.
        btn.classList.toggle('on');
        btn.style.backgroundColor = btn.classList.contains('on') ? 'green' : 'white';
      });
    }
    container.appendChild(btn);
    // ENGLISH: Insert a line break after every 6 buttons to create rows.
    // DE: Füge nach jedem 6. Button einen Zeilenumbruch ein, um Reihen zu erstellen.
    if ((i + 1) % 6 === 0) {
      container.appendChild(document.createElement('br'));
    }
  }
}

/*
  FUNCTION: initLEDSlider
  ENGLISH: Initializes a vertical noUiSlider for the LED slider in a given container.
  GERMAN: Initialisiert einen vertikalen noUiSlider für den LED-Slider in einem bestimmten Container.
  PARAMETERS:
    - containerId (string): The ID of the slider element.
      (EN: Slider element ID / DE: Slider-Element-ID)
    - startValue (number): The starting value for the slider.
      (EN: Starting value / DE: Startwert)
    - editable (boolean): If true, the slider is interactive in edit mode.
      (EN: Editable flag / DE: Editierbar-Flag)
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
  // ENGLISH: Enable slider interaction only if editable and in edit mode.
  // DE: Erlaube die Interaktion mit dem Slider nur, wenn er editierbar ist und sich im Edit-Modus befindet.
  slider.style.pointerEvents = editable ? (isEditMode ? 'auto' : 'none') : 'none';
}

/*
  FUNCTION: updateLEDSliderValue
  ENGLISH: Updates the display of the LED slider value.
  GERMAN: Aktualisiert die Anzeige des LED-Slider-Werts.
  PARAMETERS:
    - value (number|string): The current value of the slider.
      (EN: Slider value / DE: Slider-Wert)
    - displayId (string): The ID of the HTML element that displays the value.
      (EN: Display element ID / DE: Anzeigeelement-ID)
*/
function updateLEDSliderValue(value, displayId) {
  document.getElementById(displayId).textContent = value + '%';
}

/*
  FUNCTION: collectValues
  ENGLISH: Collects the values of all sliders within a given container.
  GERMAN: Sammelt die Werte aller Slider innerhalb eines bestimmten Containers.
  PARAMETERS:
    - containerId (string): The ID of the container element.
      (EN: Container element ID / DE: Container-Element-ID)
  RETURNS:
    - Array: An array of integer values from each slider.
      (EN: Array of slider values / DE: Array der Slider-Werte)
*/
function collectValues(containerId) {
  const container = document.getElementById(containerId);
  const sliders = container.getElementsByClassName('slider');
  const values = [];
  // ENGLISH: Loop through each slider and collect its value.
  // DE: Durchlaufe jeden Slider und sammle dessen Wert.
  for (let sliderDiv of sliders) {
    let value = sliderDiv.noUiSlider.get();
    values.push(parseInt(value));
  }
  return values;
}

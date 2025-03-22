// Make sure html2pdf.js is loaded in your project (e.g., via a script tag in your HTML).

/**
 * Exports all scenes in the DB to a PDF.
 * Each scene is rendered as a separate page.
 */
function exportScenesToPdf() {
  // Create a container for printable scenes
  const printableContainer = document.createElement('div');
  printableContainer.id = 'printable-container';
  // Optionally, you can add CSS classes or inline styles to mimic your layout
  printableContainer.style.display = 'none';  // hide from view

  // Build each scene's printable version from the DB scenes array
  // Assuming 'db' is globally available (from js/globals.js)
  db.scenes.forEach(scene => {
    const scenePage = document.createElement('div');
    scenePage.classList.add('printable-scene');
    // Ensure every scene starts on a new page
    scenePage.style.pageBreakAfter = 'always';
    scenePage.style.padding = '20px';

    // Build a simple blueprint of the scene based on your existing design.
    // You can adjust the HTML as needed to include other scene details.
    scenePage.innerHTML = `
      <h1>Szene ${scene.sceneNumber}: ${scene.sceneName}</h1>
      ${scene.image ? `<img src="${scene.image}" alt="Scene Image" style="max-width: 100%; height: auto;" />` : ''}
      <p>${scene.notes || ''}</p>
      <h3>LED Values</h3>
      <p>Slider: ${scene.ledSlider}%</p>
      <p>LED Buttons: ${scene.led ? scene.led.map((on, idx) => ` ${idx + 1}: ${on ? 'On' : 'Off'}`).join(', ') : ''}</p>
      ${scene.musik && scene.musik.length > 0 ? `
        <h3>Musik Items:</h3>
        <ul>
          ${scene.musik.map(item => `<li>${item.fileName}</li>`).join('')}
        </ul>
      ` : ''}
    `;
    
    printableContainer.appendChild(scenePage);
  });

  // Append container to document body so html2pdf can use it
  document.body.appendChild(printableContainer);

  // Set options for html2pdf
  const opt = {
    margin:       10,
    filename:     'szenen_export.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF from the printable container
  html2pdf().from(printableContainer).set(opt).save().then(() => {
    // Clean up the container after PDF generation
    printableContainer.remove();
  });
}

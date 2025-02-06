// Get references to the video and button elements
const startCameraButton = document.getElementById('start-camera-btn');
const video = document.getElementById('video');
const barcodeResult = document.getElementById('barcode-upc');  // Display scanned barcode
const codeReader = new ZXing.BrowserBarcodeReader();
let isCameraActive = false; // Track camera state
let stream; // To store video stream globally

// Function to add a row to the table with the scanned UPC and other fields (aisle, side, rack, level)
function addScannedItemToTable(upc) {
  const tbody = document.getElementById('scanned-items-body'); // Get the table body
  const row = document.createElement('tr'); // Create a new row
  
  // Create a cell for the UPC and append it to the row
  const upcCell = document.createElement('td');
  const upcInput = document.createElement('input');
  upcInput.type = 'text';
  upcInput.value = upc; // Set the UPC as the value
  upcInput.readOnly = true; // Make it read-only
  upcCell.appendChild(upcInput);
  row.appendChild(upcCell);

  // Add values for Aisle, Side, Rack, Level
  const aisle = document.querySelector(".aisle-btn.selected")?.textContent || "N/A";
  const side = document.querySelector(".side-btn.selected")?.textContent || "N/A";
  const rack = document.querySelector(".rack-btn.selected")?.textContent || "N/A";
  const level = document.querySelector(".level-btn.selected")?.textContent || "N/A";

  const createCell = (value) => {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value; // Set the respective value
    input.readOnly = true; // Make it read-only
    cell.appendChild(input);
    return cell;
  };

  // Add Aisle, Side, Rack, Level to the row
  row.appendChild(createCell(aisle)); // Aisle
  row.appendChild(createCell(side)); // Side
  row.appendChild(createCell(rack)); // Rack
  row.appendChild(createCell(level)); // Level

  // Add Delete Button
  const deleteCell = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    row.remove(); // Remove the row from the table
  });

  deleteCell.appendChild(deleteBtn);
  row.appendChild(deleteCell);

  // Append the new row to the table body
  tbody.appendChild(row);
}

// Function to start scanning
function startScanning() {
  codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
    if (result) {
      console.log('Scanned Barcode:', result.text); // Log the barcode in the console
      barcodeResult.textContent = result.text; // Display the scanned barcode on the webpage

      // Add the scanned UPC to the table
      addScannedItemToTable(result.text);
    } else if (err) {
      console.error('Scanning error:', err);
    }
  });
}

// Start or stop the camera when the button is clicked
startCameraButton.addEventListener('click', async () => {
  try {
    if (isCameraActive) {
      // Camera is active, stop it
      stopCamera();
      startCameraButton.textContent = "Activate Camera";
      isCameraActive = false;
      return;
    }

    // Request the camera if it's not already active
    if (!stream) {
      // Only request permission the first time
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera if available
      });

      video.srcObject = stream;  // Use the same video stream
      video.style.visibility = 'visible';
    }

    startCameraButton.textContent = "Turn Off Camera";
    isCameraActive = true;

    // Start scanning
    startScanning();

  } catch (err) {
    console.error('Camera access failed:', err);
    alert('Unable to access the camera. Please ensure permissions are granted.');
  }
});

// Function to stop the camera (optional)
function stopCamera() {
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop()); // Stop all tracks to turn off the camera
  video.srcObject = null;
  video.style.visibility = 'hidden';
}

// Add selected effect to aisle, side, rack, and level buttons
document.querySelectorAll(".aisle-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".aisle-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.querySelectorAll(".side-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".side-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.querySelectorAll(".rack-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".rack-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.querySelectorAll(".level-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

// Toggle table visibility
document.getElementById('expand-btn').addEventListener('click', () => {
  const table = document.getElementById('scanned-items-table');
  table.style.display = table.style.display === 'none' ? 'table' : 'none'; // Toggle visibility
});

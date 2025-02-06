const startCameraButton = document.getElementById('start-camera-btn');
let isCameraActive = false; // Track camera state
let stream; // Store video stream globally
const video = document.getElementById('video');
const barcodeResult = document.getElementById('barcode-result');
const cameraWindow = document.getElementById('camera-window');
const codeReader = new ZXing.BrowserBarcodeReader();
let scannedItems = []; // Store scanned items temporarily
let lastScannedBarcode = ''; // Store the last scanned barcode
let lastScanTime = 0; // Store the timestamp of the last scan (in milliseconds)

// Function to start continuous scanning and handle duplicates
function startScanning() {
    codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
        if (result) {
            const currentTime = Date.now(); // Get the current timestamp

            // Check if the current barcode is the same as the last scanned one and if it's within 2 seconds
            if (result.text === lastScannedBarcode && currentTime - lastScanTime < 2000) {
                console.log("Duplicate scan detected, ignoring...");
                return; // Ignore duplicate scan if within 2 seconds
            }

            // Otherwise, process the scan and update the table
            console.log("Scanned barcode:", result.text);
            document.getElementById('barcode-upc').textContent = `UPC: ${result.text}`;
            fetchProductDetails(result.text); // Get product details

            // Update the last scanned barcode and timestamp
            lastScannedBarcode = result.text;
            lastScanTime = currentTime;

            // Restart scanning for the next item
            startScanning();
        } else if (err) {
            console.error('Barcode scanning error:', err);
        }
    });
}


// Function to start or stop the camera
startCameraButton.addEventListener('click', async () => {
  try {
    if (isCameraActive) {
      stopCamera();
      startCameraButton.textContent = "Activate Camera";
      isCameraActive = false;
      return;
    }

    // Start the camera
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    video.srcObject = stream;

    // Make video visible
    video.style.visibility = 'visible';
    video.style.position = 'absolute';
    cameraWindow.style.visibility = 'visible';

    startCameraButton.textContent = "Turn Off Camera";
    isCameraActive = true;

    // 🔹 Start continuous scanning
    startScanning();

  } catch (err) {
    console.error('Camera access failed:', err);
    alert('Unable to access the camera. Please ensure permissions are granted.');
  }
});

// Function to fetch product details from Open Food Facts
async function fetchProductDetails(barcode) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    const data = await response.json();
    if (data.status === 1) {
      const productName = data.product.product_name || 'Unknown Product';
      const productBrand = data.product.brands || 'Unknown Brand';

      // Update displayed values
      document.getElementById('product-name').textContent = `Product: ${productName}`;
      document.getElementById('product-brand').textContent = `Brand: ${productBrand}`;

      // Add the entity to the scannedItems array
      const entity = {
        Barcode: barcode,
        Name: productName,
        Brand: productBrand,
        Aisle: document.querySelector(".aisle-btn.selected")?.textContent || "",
        Side: document.querySelector(".side-btn.selected")?.textContent || "",
        Rack: document.querySelector(".rack-btn.selected")?.textContent || "",
        Level: document.querySelector(".level-btn.selected")?.textContent || ""
      };

      scannedItems.push(entity); // Push the new item to scannedItems
      updateScannedItemsTable(); // Update the table with new data
    } else {
      document.getElementById('product-name').textContent = 'Product not found in OpenFoodFacts';
      document.getElementById('product-brand').textContent = '';
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    document.getElementById('product-name').textContent = 'Error fetching product details';
    document.getElementById('product-brand').textContent = '';
  }
}

// Stop the camera and clean up
function stopCamera() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop()); // Stop all tracks to turn off the camera
    video.srcObject = null;
    video.style.visibility = 'hidden';
    cameraWindow.style.visibility = 'visible';
    startCameraButton.textContent = "Activate Camera";
    isCameraActive = false;
  }
}

// Function to update the scanned items table
function updateScannedItemsTable() {
    const tbody = document.getElementById('scanned-items-body');
    tbody.innerHTML = ""; // Clear previous table rows

    console.log(scannedItems);  // Log to check if items are being added

    if (scannedItems.length === 0) {
        console.log("No items to display in the table.");
        return;
    }

    scannedItems.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" value="${item.Barcode}" readonly /></td>
            <td><input type="text" value="${item.Name}" /></td>
            <td><input type="text" value="${item.Brand}" /></td>
            <td><input type="text" value="${item.Aisle}" /></td>
            <td><input type="text" value="${item.Side}" /></td>
            <td><input type="text" value="${item.Rack}" /></td>
            <td><input type="text" value="${item.Level}" /></td>
        `;

        tbody.appendChild(row); // Append the row to the table
    });
}

// Button to toggle table visibility
document.getElementById('expand-btn').addEventListener('click', () => {
    const table = document.getElementById('scanned-items-table');
    table.style.display = table.style.display === 'none' ? 'table' : 'none'; // Toggle visibility
});

// Aisle buttons
document.querySelectorAll(".aisle-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".aisle-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Side buttons
document.querySelectorAll(".side-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".side-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Rack buttons
document.querySelectorAll(".rack-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".rack-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Level buttons
document.querySelectorAll(".level-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".level-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

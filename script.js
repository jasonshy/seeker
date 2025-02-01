const startCameraButton = document.getElementById('start-camera-btn');
const video = document.getElementById('video');
const barcodeResult = document.getElementById('barcode-result');
const cameraWindow = document.getElementById('camera-window');
const codeReader = new ZXing.BrowserBarcodeReader();

startCameraButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    video.srcObject = stream;

    // Hide the grey camera window and show the video
    video.style.visibility = 'visible'; // Make video visible inside the window
    video.style.position = 'absolute'; // Position it correctly inside the window
    cameraWindow.style.visibility = 'visible'; // Make sure the border stays visible

    startCameraButton.style.display = 'none'; // Hide the button after starting the camera

    // Start barcode detection
    codeReader.decodeOnceFromVideoDevice(undefined, 'video')
      .then((result) => {
        document.getElementById('barcode-upc').textContent = `UPC: ${result.text}`;
        fetchProductDetails(result.text); // Call the new function with the detected barcode
        stopCamera(stream);
      })
      .catch((err) => {
        console.error('Barcode detection error:', err);
      });
  } catch (err) {
    console.error('Camera access failed:', err);
    alert('Unable to access the camera. Please ensure permissions are granted.');
  }
});

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
      // Update the next two lines
      document.getElementById('product-name').textContent = `Product: ${productName}`;
      document.getElementById('product-brand').textContent = `Brand: ${productBrand}`;
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
function stopCamera(stream) {
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;
  video.style.visibility = 'hidden'; // Hide the video once detection is done
  cameraWindow.style.visibility = 'visible'; // Show the camera window again
  startCameraButton.style.display = 'block'; // Show the start button again
}

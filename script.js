const startCameraButton = document.getElementById('start-camera-btn');
const video = document.getElementById('video');
const barcodeResult = document.getElementById('barcode-result');
const codeReader = new ZXing.BrowserBarcodeReader();

startCameraButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    video.srcObject = stream;
    video.style.display = 'block';
    startCameraButton.style.display = 'none'; // Hide the button after starting the camera

    // Start barcode detection
    codeReader.decodeOnceFromVideoDevice(undefined, 'video')
      .then((result) => {
        barcodeResult.textContent = `Barcode Detected: ${result.text}`;
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
      barcodeResult.textContent = `Product: ${productName}, Brand: ${productBrand}`;
    } else {
      barcodeResult.textContent = 'Product not found in OpenFoodFacts';
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    barcodeResult.textContent = 'Error fetching product details';
  }
}

// Stop the camera and clean up
function stopCamera(stream) {
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;
  video.style.display = 'none'; // Hide the video once detection is done
  startCameraButton.style.display = 'block'; // Show the start button again
}

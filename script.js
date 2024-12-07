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

// Stop the camera and clean up
function stopCamera(stream) {
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;
  video.style.display = 'none'; // Hide the video once detection is done
  startCameraButton.style.display = 'block'; // Show the start button again
}

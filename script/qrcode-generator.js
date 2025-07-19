function handleFileInput() {
  // Simulate click on file input
  document.getElementById('fileInput').click();

  // Check if 'qrcode-link' is empty
  const qrLink = document.getElementById('qrcode-link');
  if (!qrLink || !qrLink.href || qrLink.href.trim() === "") {
    alert("QR Code link is empty!");
  }
}

// After user selects a file
document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;

    // Clear any previous QR codes
    document.getElementById('qrcode-container').innerHTML = "";

    // Create the QR code
    const qr = new QRCode(document.getElementById("qrcode-container"), {
      text: "https://your-url-or-content.com", // Customize this text
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    // Wait for QR to render, then overlay image
    setTimeout(() => {
      const canvas = document.querySelector("#qrcode-container canvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = function () {
          const size = 50; // Adjust image size
          const x = (canvas.width - size) / 2;
          const y = (canvas.height - size) / 2;
          ctx.drawImage(img, x, y, size, size);

          // Update download link
          document.getElementById("qrcode-link").href = canvas.toDataURL();
          document.getElementById("qrcode-link").download = "qr_with_logo.png";
        };
        img.src = imgSrc;
      }
    }, 100); // Give QRCode a brief moment to render
  };
  reader.readAsDataURL(file);
});

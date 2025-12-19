document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input_text');
    const errorMsg = document.getElementById('error-message');
    const qrImage = document.getElementById('qr-image');
    const btn = document.getElementById('generate-btn');

    btn.addEventListener('click', generateQR);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateQR();
    });

    function generateQR() {
        const text = input.value.trim();
        
        if (!text) {
            showError('भाई text तो डालो पहले! 😅');
            return;
        }

        hideError();
        btn.disabled = true;
        btn.innerHTML = '⏳ Generating...';
        qrImage.innerHTML = '<p style="color:#64748b;">Generating QR...</p>';

        // QR Generate
        try {
            new QRCode(qrImage, {
                text: text,
                width: 280,
                height: 280,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            showError('QR generate में error! Try again.');
            return;
        }

        // Add controls after render
        setTimeout(function() {
            const canvas = qrImage.querySelector('canvas');
            if (canvas) {
                addControls(canvas);
            }
            btn.disabled = false;
            btn.innerHTML = '✨ New QR';
            input.value = '';
        }, 400);
    }

    function addControls(canvas) {
        const downloadUrl = canvas.toDataURL('image/png');
        qrImage.innerHTML = `
            <canvas width="${canvas.width}" height="${canvas.height}"></canvas>
            <div class="controls">
                <a href="${downloadUrl}" download="my-qr-${Date.now()}.png" class="btn-download">⬇️ Download PNG</a>
                <button class="btn-reset" onclick="location.reload()">🔄 New QR</button>
            </div>
        `;
        
        // Copy same canvas
        const newCanvas = qrImage.querySelector('canvas');
        newCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
    }

    function hideError() {
        errorMsg.classList.remove('show');
    }
});

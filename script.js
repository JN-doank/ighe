document.addEventListener('DOMContentLoaded', function() {
    // Elemen input
    const profileNameInput = document.getElementById('profileName');
    const mainTextInput = document.getElementById('mainText');
    const byTextInput = document.getElementById('byText');
    const profileImageInput = document.getElementById('profileImage');
    // Tombol aksi
    const generateBtn = document.getElementById('generateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const backBtn = document.getElementById('backBtn');
    // Elemen preview
    const previewContainer = document.getElementById('previewContainer');
    const previewProfileName = document.getElementById('previewProfileName');
    const previewMainText = document.getElementById('previewMainText');
    const previewByText = document.getElementById('previewByText');
    const previewAvatar = document.getElementById('previewAvatar');
    // Loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    // Container form
    const formContainer = document.getElementById('formContainer');
    // Variabel untuk menyimpan gambar profil
    let profileImageData = null;
    // Background URL dari GitHub
    const backgroundUrl = 'https://raw.githubusercontent.com/rahmat-369/Foto-up/refs/heads/main/Screenshot_2025-12-06-17-40-17-76.png';
    // Avatar default URL
    const defaultAvatarUrl = 'https://e.top4top.io/p_36289l9m80.jpeg';

    // Event listener untuk input gambar profil
    profileImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImageData = e.target.result;
                updateAvatarPreview();
            }
            reader.readAsDataURL(file);
        } else {
            profileImageData = null;
            updateAvatarPreview();
        }
    });

    // Fungsi untuk memperbarui tampilan avatar di preview
    function updateAvatarPreview() {
        if (profileImageData) {
            previewAvatar.innerHTML = `<img src="${profileImageData}" alt="Profile">`;
            previewAvatar.style.backgroundImage = 'none';
        } else {
            previewAvatar.innerHTML = '';
            previewAvatar.style.backgroundImage = `url('${defaultAvatarUrl}')`;
        }
    }

    // Event listener untuk tombol generate
    generateBtn.addEventListener('click', function() {
        // Validasi input
        if (!profileNameInput.value.trim()) {
            alert('Harap masukkan nama profil!');
            profileNameInput.focus();
            return;
        }
        if (!mainTextInput.value.trim()) {
            alert('Harap masukkan isi kata-kata!');
            mainTextInput.focus();
            return;
        }
        // Update preview terlebih dahulu
        updatePreview();
        // Tampilkan loading overlay
        loadingOverlay.classList.add('active');
        // Sembunyikan form
        formContainer.style.display = 'none';
        // Setelah 2 detik, sembunyikan loading dan tampilkan preview
        setTimeout(() => {
            // Sembunyikan loading
            loadingOverlay.classList.remove('active');
            // Tampilkan preview dengan animasi
            previewContainer.classList.add('show');
            downloadBtn.classList.add('show');
            backBtn.style.display = 'block';
        }, 2000);
    });

    // Event listener untuk tombol reset
    resetBtn.addEventListener('click', function() {
        // Reset semua input
        profileNameInput.value = '';
        mainTextInput.value = '';
        byTextInput.value = 'by rhmt'; // Reset ke default
        profileImageInput.value = '';
        profileImageData = null;
        updateAvatarPreview();
        // Kembalikan preview ke nilai default
        previewProfileName.textContent = 'Nama Profil';
        previewMainText.textContent = 'Isi kata kata';
        previewByText.textContent = 'by rhmt';
        // Sembunyikan preview dan tombol aksi
        previewContainer.classList.remove('show');
        downloadBtn.classList.remove('show');
        backBtn.style.display = 'none';
        // Tampilkan form kembali
        formContainer.style.display = 'block';
    });

    // Event listener untuk tombol kembali
    backBtn.addEventListener('click', function() {
        // Sembunyikan preview dan tombol aksi
        previewContainer.classList.remove('show');
        downloadBtn.classList.remove('show');
        backBtn.style.display = 'none';
        // Tampilkan form kembali
        formContainer.style.display = 'block';
    });

    // Event listener untuk tombol download
    downloadBtn.addEventListener('click', downloadImage);

    // Fungsi untuk memperbarui preview - DIPERBAIKI
    function updatePreview() {
        previewProfileName.textContent = profileNameInput.value.trim() || 'Nama Profil';
        
        // Format teks utama dengan line breaks untuk preview
        const mainText = mainTextInput.value.trim() || 'Isi kata kata';
        previewMainText.textContent = mainText;
        
        previewByText.textContent = byTextInput.value.trim() || 'by rhmt';
        updateAvatarPreview();
        
        // Otomatis sesuaikan font size jika teks terlalu panjang
        const textLength = mainText.length;
        if (textLength > 100) {
            previewMainText.style.fontSize = '18px';
        } else if (textLength > 50) {
            previewMainText.style.fontSize = '20px';
        } else {
            previewMainText.style.fontSize = '24px';
        }
    }

    // Fungsi untuk mendownload gambar - TIDAK BERUBAH
    function downloadImage() {
        // Tampilkan loading
        loadingOverlay.classList.add('active');
        // Buat elemen canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Gambar background dari GitHub
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = backgroundUrl;
        bgImg.onload = function() {
            // GUNAKAN UKURAN ASLI BACKGROUND (jaga rasio)
            const bgWidth = bgImg.naturalWidth || bgImg.width;
            const bgHeight = bgImg.naturalHeight || bgImg.height;
            // Set canvas sesuai ukuran background asli
            canvas.width = bgWidth;
            canvas.height = bgHeight;
            // Gambar background dengan ukuran asli
            ctx.drawImage(bgImg, 0, 0, bgWidth, bgHeight);
            // Hitung faktor skala untuk elemen lain
            const scaleX = bgWidth / 360;
            const scaleY = bgHeight / 640;
            // Gambar header profil
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, bgWidth, 50 * scaleY);
            // Gambar avatar
            if (profileImageData) {
                const avatarImg = new Image();
                avatarImg.src = profileImageData;
                avatarImg.onload = function() {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(25 * scaleX, 25 * scaleY, 15 * scaleX, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatarImg, 10 * scaleX, 10 * scaleY, 30 * scaleX, 30 * scaleY);
                    ctx.restore();
                    drawTexts();
                };
                avatarImg.onerror = function() {
                    drawDefaultAvatar();
                    drawTexts();
                };
            } else {
                drawDefaultAvatar();
            }
            function drawDefaultAvatar() {
                // Load avatar default dari URL
                const defaultAvatarImg = new Image();
                defaultAvatarImg.crossOrigin = "anonymous";
                defaultAvatarImg.src = defaultAvatarUrl;
                defaultAvatarImg.onload = function() {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(25 * scaleX, 25 * scaleY, 15 * scaleX, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(defaultAvatarImg, 10 * scaleX, 10 * scaleY, 30 * scaleX, 30 * scaleY);
                    ctx.restore();
                    drawTexts();
                };
                defaultAvatarImg.onerror = function() {
                    // Fallback jika gambar default gagal
                    const gradient = ctx.createLinearGradient(
                        10 * scaleX, 10 * scaleY,
                        40 * scaleX, 40 * scaleY
                    );
                    gradient.addColorStop(0, '#f09433');
                    gradient.addColorStop(0.25, '#e6683c');
                    gradient.addColorStop(0.5, '#dc2743');
                    gradient.addColorStop(0.75, '#cc2366');
                    gradient.addColorStop(1, '#bc1888');
                    ctx.beginPath();
                    ctx.arc(25 * scaleX, 25 * scaleY, 15 * scaleX, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(25 * scaleX, 25 * scaleY, 9 * scaleX, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    drawTexts();
                };
            }
            function drawTexts() {
                // Gambar nama profil
                ctx.fillStyle = '#fff';
                ctx.font = `600 ${14 * scaleY}px Arial`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                const profileName = previewProfileName.textContent;
                ctx.fillText(profileName, 50 * scaleX, 25 * scaleY);
                // Gambar teks utama dengan wrap
                ctx.fillStyle = '#333';
                ctx.font = `500 ${24 * scaleY}px Arial`;
                ctx.textAlign = 'center';
                const mainText = previewMainText.textContent;
                const maxWidth = bgWidth * 0.8;
                const lineHeight = 30 * scaleY;
                // Pisah teks menjadi baris
                const words = mainText.split(' ');
                let line = '';
                let lines = [];
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                // Hitung posisi vertikal teks utama
                const totalTextHeight = lines.length * lineHeight;
                let y = (bgHeight / 2) - (totalTextHeight / 2);
                // HAPUS LATAR BELAKANG untuk teks utama (tidak digambar)
                // Gambar setiap baris teks
                ctx.fillStyle = '#333';
                for (let i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], bgWidth / 2, y);
                    y += lineHeight;
                }
                // Simpan posisi Y terakhir dari teks utama
                const lastTextY = y;
                // Gambar by-text DI BAWAH teks utama dengan jarak 40px
                const byTextY = lastTextY + (40 * scaleY);
                // HAPUS LATAR BELAKANG untuk by-text (tidak digambar)
                // Gambar teks "by" - PERBAIKAN DI SINI
                ctx.fillStyle = '#666';
                ctx.font = `italic ${14 * scaleY}px Arial`;
                ctx.textAlign = 'center';
                // Perbaikan: gunakan previewByText.textContent, bukan elemen byText
                ctx.fillText(previewByText.textContent, bgWidth / 2, byTextY);
                // Konversi canvas ke data URL dan trigger download
                const link = document.createElement('a');
                link.download = 'kata-kata-instagram.png';
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // Sembunyikan loading
                setTimeout(() => {
                    loadingOverlay.classList.remove('active');
                }, 500);
            }
        };
        bgImg.onerror = function() {
            alert('Gagal memuat gambar latar belakang. Silakan coba lagi.');
            loadingOverlay.classList.remove('active');
        };
    }
    // Inisialisasi awal
    updateAvatarPreview();
    byTextInput.value = 'by rhmt';
});

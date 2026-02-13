// ==========================================
// Floating Hearts Generation
// ==========================================
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    const numberOfHearts = 20;

    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Random positioning
        heart.style.left = Math.random() * 100 + '%';

        // Random size
        const size = 1 + Math.random() * 2;
        heart.style.fontSize = size + 'rem';

        // Random animation duration
        const duration = 10 + Math.random() * 15;
        heart.style.animationDuration = duration + 's';

        // Random delay
        heart.style.animationDelay = Math.random() * 5 + 's';

        heartsContainer.appendChild(heart);
    }
}

// ==========================================
// Confetti Animation
// ==========================================
class Confetti {
    constructor() {
        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff1744', '#f50057', '#9c27b0', '#ff4081', '#ffc107', '#ffffff'];

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: 1,
            shape: Math.random() > 0.5 ? 'circle' : 'square'
        };
    }

    start() {
        // Create initial burst
        for (let i = 0; i < 150; i++) {
            this.particles.push(this.createParticle(
                this.canvas.width / 2,
                this.canvas.height / 2
            ));
        }

        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.008;

            // Remove if off screen or faded
            if (p.y > this.canvas.height || p.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw particle
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }

            this.ctx.restore();
        }

        // Continue animation if particles exist
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ==========================================
// Button Interactions
// ==========================================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionSection = document.getElementById('questionSection');
const successSection = document.getElementById('successSection');

let confetti;

// Yes Button - Show success message with confetti
yesBtn.addEventListener('click', () => {
    // Hide question section
    questionSection.classList.add('hidden');

    // Show success section
    successSection.classList.remove('hidden');

    // Start confetti
    if (!confetti) {
        confetti = new Confetti();
    }
    confetti.start();

    // Add more confetti bursts
    setTimeout(() => confetti && confetti.start(), 500);
    setTimeout(() => confetti && confetti.start(), 1000);
});

// No Button - Playful evasion behavior
let noClickCount = 0;

function moveNoButton() {
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate available space
    const maxX = cardRect.width - btnRect.width - 40;
    const maxY = cardRect.height - btnRect.height - 40;

    // Random position
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    // Apply position
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    // Make button smaller each time
    noClickCount++;
    const newScale = Math.max(0.5, 1 - (noClickCount * 0.1));
    noBtn.style.transform = `scale(${newScale})`;

    // Change text after a few attempts
    if (noClickCount === 3) {
        noBtn.textContent = 'Maybe?';
    } else if (noClickCount === 5) {
        noBtn.textContent = 'Are you sure?';
    } else if (noClickCount === 7) {
        noBtn.textContent = 'Really?';
    } else if (noClickCount > 8) {
        noBtn.textContent = '🥺';
    }
}

// Desktop: move on hover
noBtn.addEventListener('mouseenter', moveNoButton);

// Mobile: move on touch
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Also move on click attempt
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Make buttons container relative for absolute positioning
document.querySelector('.buttons').style.position = 'relative';
document.querySelector('.buttons').style.minHeight = '200px';

// ==========================================
// Photo Album Functionality
// ==========================================
const continueBtn = document.getElementById('continueBtn');
const albumSection = document.getElementById('albumSection');
const photoGrid = document.getElementById('photoGrid');
const fileInput = document.getElementById('fileInput');

let currentPhotoSlot = null;
const numberOfPhotos = 6;

// Create photo slots
function createPhotoSlots() {
    for (let i = 0; i < numberOfPhotos; i++) {
        const slot = document.createElement('div');
        slot.className = 'photo-slot';
        slot.innerHTML = '<div class="photo-placeholder">📷</div>';
        slot.dataset.index = i;

        slot.addEventListener('click', () => {
            currentPhotoSlot = slot;
            fileInput.click();
        });

        photoGrid.appendChild(slot);
    }
}

// Handle file selection
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && currentPhotoSlot) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = 'Our memory';

            // Clear placeholder and add image
            currentPhotoSlot.innerHTML = '';
            currentPhotoSlot.appendChild(img);
            currentPhotoSlot.classList.add('has-photo');
        };

        reader.readAsDataURL(file);
    }

    // Reset file input
    fileInput.value = '';
});

// Continue button - Show album section
continueBtn.addEventListener('click', () => {
    successSection.classList.add('hidden');
    albumSection.classList.remove('hidden');
});

// ==========================================
// Music Player Functionality
// ==========================================
const musicBtn = document.getElementById('musicBtn');
const musicPlayer = document.getElementById('musicPlayer');
const closeMusicBtn = document.getElementById('closeMusicBtn');

// Show music player
let videoLoaded = false;
musicBtn.addEventListener('click', () => {
    musicPlayer.classList.remove('hidden');

    // Load the video only when first opened
    if (!videoLoaded) {
        const iframe = document.getElementById('youtubePlayer');
        const videoUrl = 'https://www.youtube.com/embed/OE4jse3CUkI?autoplay=1&mute=0&controls=1&rel=0&enablejsapi=1';
        iframe.src = videoUrl;
        videoLoaded = true;
    }
});

// Close music player
closeMusicBtn.addEventListener('click', () => {
    musicPlayer.classList.add('hidden');

    // Stop the YouTube video by removing the src
    const iframe = document.getElementById('youtubePlayer');
    iframe.src = '';
    videoLoaded = false;
});

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    createPhotoSlots();
});

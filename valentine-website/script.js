// ===== KUZUM & FEYZA — Valentine's Interactive Site =====

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initEnvelope();
    initScrollReveal();
    initDotNav();
    initMouseTilt();
});

// ===== PHOTO CAROUSEL WITH DEPTH =====
function initCarousel() {
    const cards = Array.from(document.querySelectorAll('.photo-card'));
    const dotsContainer = document.getElementById('carouselDots');
    const total = cards.length;
    let current = 2; // start with center photo (photo1 - heart frame)

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === current) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const positions = ['pos-left-2', 'pos-left-1', 'pos-center', 'pos-right-1', 'pos-right-2', 'pos-hidden'];

    function updatePositions() {
        const dots = document.querySelectorAll('.carousel-dot');
        cards.forEach((card, i) => {
            // Clear all position classes
            card.classList.remove(...positions);

            // Calculate relative position
            let relPos = i - current;
            // Wrap around
            if (relPos > Math.floor(total / 2)) relPos -= total;
            if (relPos < -Math.floor(total / 2)) relPos += total;

            // Map to position class
            if (relPos === 0) card.classList.add('pos-center');
            else if (relPos === -1) card.classList.add('pos-left-1');
            else if (relPos === 1) card.classList.add('pos-right-1');
            else if (relPos === -2) card.classList.add('pos-left-2');
            else if (relPos === 2) card.classList.add('pos-right-2');
            else card.classList.add('pos-hidden');
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        updatePositions();
    }

    document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

    // Swipe support
    let startX = 0;
    const stack = document.getElementById('photoStack');
    stack.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    stack.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    });

    // Auto-advance
    let autoTimer = setInterval(() => goTo(current + 1), 4000);
    stack.addEventListener('mouseenter', () => clearInterval(autoTimer));
    stack.addEventListener('mouseleave', () => {
        autoTimer = setInterval(() => goTo(current + 1), 4000);
    });

    updatePositions();
}

// ===== MOUSE TILT ON PHOTO STACK =====
function initMouseTilt() {
    const stack = document.getElementById('photoStack');
    if (!stack) return;

    stack.addEventListener('mousemove', (e) => {
        const rect = stack.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const centerCard = stack.querySelector('.pos-center');
        if (centerCard) {
            centerCard.style.transform = `
                translateX(0) scale(1)
                rotateY(${x * 10}deg)
                rotateX(${-y * 8}deg)
            `;
        }
    });

    stack.addEventListener('mouseleave', () => {
        const centerCard = stack.querySelector('.pos-center');
        if (centerCard) {
            centerCard.style.transform = '';
        }
    });
}

// ===== ENVELOPE & LETTER =====
function initEnvelope() {
    const container = document.getElementById('envelopeContainer');
    const btn = document.getElementById('openLetterBtn');
    const reveal = document.getElementById('letterReveal');
    let isOpen = false;

    function toggle() {
        isOpen = !isOpen;
        container.classList.toggle('opened', isOpen);
        btn.textContent = isOpen ? 'mektubu kapat' : 'mektubu aç';

        if (isOpen) {
            setTimeout(() => {
                reveal.classList.add('show');
            }, 400);
            // Tiny heart burst effect
            spawnHearts(container.getBoundingClientRect());
        } else {
            reveal.classList.remove('show');
        }
    }

    btn.addEventListener('click', toggle);
    container.addEventListener('click', toggle);
}

function spawnHearts(rect) {
    const hearts = ['♥', '❤', '💕', '✦'];
    for (let i = 0; i < 10; i++) {
        const span = document.createElement('span');
        span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (Math.random() - 0.5) * Math.PI;
        const dist = 60 + Math.random() * 60;
        const tx = Math.cos(angle) * dist;
        const ty = -Math.abs(Math.sin(angle) * dist) - 20;
        span.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: ${10 + Math.random() * 10}px;
            color: #d4758c;
            pointer-events: none;
            z-index: 999;
            opacity: 1;
            transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
        `;
        document.body.appendChild(span);

        requestAnimationFrame(() => {
            span.style.transform = `translate(${tx}px, ${ty}px) scale(0.3)`;
            span.style.opacity = '0';
        });

        setTimeout(() => span.remove(), 1100);
    }
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const els = document.querySelectorAll(
        '.gallery-header, .letter-wrapper, .finale-content, .photo-carousel, .tag'
    );

    els.forEach(el => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    els.forEach(el => observer.observe(el));
}

// ===== DOT NAV (active tracking) =====
function initDotNav() {
    const sections = document.querySelectorAll('.section');
    const dots = document.querySelectorAll('#dot-nav .dot');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(d => d.classList.remove('active'));
                const active = document.querySelector(`#dot-nav .dot[data-section="${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
}

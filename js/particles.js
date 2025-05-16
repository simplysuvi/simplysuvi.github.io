// particles.js - Subtle interactive particles with cursor effect (no text)

(function () {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Config
    const PARTICLE_COUNT = 64;
    const PARTICLE_RADIUS = 2.1;
    const PARTICLE_COLOR = "rgba(120,180,255,0.32)";
    const LINE_COLOR = "rgba(120,180,255,0.11)";
    const LINE_COLOR_ACTIVE = "rgba(255,220,120,0.18)";
    const LINE_DISTANCE = 110;
    const CURSOR_LINE_DISTANCE = 120;
    const PARTICLE_SPEED = 0.18;
    const CURSOR_FORCE = 0.13;
    const CURSOR_RADIUS = 90;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle definition
    function randomVel() {
        return (Math.random() - 0.5) * PARTICLE_SPEED;
    }
    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: randomVel(),
            vy: randomVel()
        };
    }
    let particles = [];
    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    // Mouse interaction
    const mouse = { x: width / 2, y: height / 2, active: false };
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw lines between particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DISTANCE) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = LINE_COLOR;
                    ctx.lineWidth = 1;
                    ctx.shadowColor = LINE_COLOR;
                    ctx.shadowBlur = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                }
            }
        }

        // Draw lines from cursor to nearby particles
        if (mouse.active) {
            for (let p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CURSOR_LINE_DISTANCE) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = LINE_COLOR_ACTIVE;
                    ctx.lineWidth = 1.2;
                    ctx.shadowColor = LINE_COLOR_ACTIVE;
                    ctx.shadowBlur = 4;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                }
            }
        }

        // Draw and update particles
        for (let p of particles) {
            // Cursor repulsion
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CURSOR_RADIUS) {
                    const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
                    p.vx += dx / dist * force;
                    p.vy += dy / dist * force;
                }
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.shadowColor = PARTICLE_COLOR;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Canvas styling
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.userSelect = 'none';
    canvas.style.transition = 'opacity 0.3s';
    canvas.style.opacity = '0';
    setTimeout(() => { canvas.style.opacity = '1'; }, 80);
})();

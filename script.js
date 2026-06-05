// --- Navbar & Mobile Menu ---
const navbar = document.querySelector('.header');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.querySelector('i').classList.toggle('fa-times');
        menuBtn.querySelector('i').classList.toggle('fa-bars');
    });
}

// Initialize Three.js Spider-Verse Background
const initSpiderVerseBackground = () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Spider-Verse dimensional sparks (Red, Cyan, Purple)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Dense for multi-verse feel
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    const colors = [
        new THREE.Color('#ff003c'), // Neon Red
        new THREE.Color('#00f3ff'), // Electric Cyan
        new THREE.Color('#bf00ff'), // Glitch Purple
        new THREE.Color('#ffffff')  // White spark
    ];

    for(let i = 0; i < particlesCount * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i+1] = (Math.random() - 0.5) * 15;
        posArray[i+2] = (Math.random() - 0.5) * 10;
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i] = randomColor.r;
        colorsArray[i+1] = randomColor.g;
        colorsArray[i+2] = randomColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending // Gives that glowing neon effect
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Mouse interaction for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Glitchy rotation for the dimensional feel
        particlesMesh.rotation.y += 0.002 * (Math.sin(elapsedTime * 0.5) + 1);
        particlesMesh.rotation.x += 0.001 * Math.cos(elapsedTime * 0.3);
        
        // Parallax reaction to mouse
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ==========================================
// VanillaTilt initialization for 3D card effects
const initTilt = () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }
};

// Project Tabs Logic
const initTabs = () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.project-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.project);
            if(target) target.classList.add('active');
        });
    });
};

// Typewriter effect for Hero
const initTypewriter = () => {
    const textWrapper = document.querySelector('.text-wrapper');
    if (!textWrapper) return;
    
    const roles = ["Android Developer", "Kotlin Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textWrapper.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textWrapper.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    type();
};

// Initialize everything on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initSpiderVerseBackground();
    initTilt();
    initTabs();
    initTypewriter();

    // GSAP Scroll Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        });
    }
});

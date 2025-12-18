// 3D Loading Screen Variables
let loadingScene, loadingCamera, loadingRenderer, loadingAnimationId;
let loadingMesh, loadingParticles;

// Hero 3D Model Variables
let scene, camera, renderer, animationId;
let geometry, material, mesh;
let particles, particleSystem;

// Initialize 3D Loading Screen
function initLoadingScreen() {
    const loadingCanvas = document.getElementById('loading-canvas');
    if (!loadingCanvas) return;

    console.log('Initializing loading screen...');

    // Create loading scene
    loadingScene = new THREE.Scene();
    loadingCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    loadingCamera.position.z = 5;

    // Create loading renderer
    loadingRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    loadingRenderer.setSize(300, 300);
    loadingRenderer.setClearColor(0x000000, 0);
    loadingCanvas.appendChild(loadingRenderer.domElement);

    // Create animated loading geometry - Torus Knot
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    loadingMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    loadingScene.add(loadingMesh);

    // Add particles around the torus
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 8;     // x
        particlePositions[i + 1] = (Math.random() - 0.5) * 8; // y
        particlePositions[i + 2] = (Math.random() - 0.5) * 8; // z
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    loadingParticles = new THREE.Points(particleGeometry, particleMaterial);
    loadingScene.add(loadingParticles);

    // Start loading animation
    animateLoading();
    console.log('Loading screen initialized successfully');
}

// Animate Loading Screen
function animateLoading() {
    loadingAnimationId = requestAnimationFrame(animateLoading);
    
    if (loadingMesh) {
        loadingMesh.rotation.x += 0.01;
        loadingMesh.rotation.y += 0.02;
        loadingMesh.rotation.z += 0.005;
    }
    
    if (loadingParticles) {
        loadingParticles.rotation.y += 0.002;
        const positions = loadingParticles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.001;
        }
        loadingParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    if (loadingRenderer && loadingScene && loadingCamera) {
        loadingRenderer.render(loadingScene, loadingCamera);
    }
}

// Initialize Hero 3D Model
function initHero3D() {
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    console.log('Initializing hero 3D model...');

    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    heroCanvas.appendChild(renderer.domElement);

    // Create main geometry - Icosahedron
    geometry = new THREE.IcosahedronGeometry(1.5, 1);
    material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Create particle system
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 15;     // x
        particlePositions[i + 1] = (Math.random() - 0.5) * 15; // y
        particlePositions[i + 2] = (Math.random() - 0.5) * 15; // z
        
        particleVelocities[i] = (Math.random() - 0.5) * 0.02;
        particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
        particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Add additional geometric shapes
    const shapes = [];
    for (let i = 0; i < 3; i++) {
        const shapeGeometry = new THREE.OctahedronGeometry(0.5, 0);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: [0xa855f7, 0x8b5cf6, 0x6366f1][i],
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
        
        shapeMesh.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        
        shapes.push(shapeMesh);
        scene.add(shapeMesh);
    }

    // Store shapes for animation
    mesh.userData.shapes = shapes;

    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    // Start hero animation
    animateHero();
    console.log('Hero 3D model initialized successfully');
}

// Animate Hero 3D Model
function animateHero() {
    animationId = requestAnimationFrame(animateHero);

    if (mesh) {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        
        // Animate additional shapes
        if (mesh.userData.shapes) {
            mesh.userData.shapes.forEach((shape, index) => {
                shape.rotation.x += 0.01 * (index + 1);
                shape.rotation.y += 0.005 * (index + 1);
                shape.rotation.z += 0.008 * (index + 1);
                
                // Orbital motion
                const time = Date.now() * 0.001;
                shape.position.x = Math.cos(time * 0.5 + index * 2) * 3;
                shape.position.y = Math.sin(time * 0.3 + index * 2) * 2;
                shape.position.z = Math.sin(time * 0.4 + index * 2) * 1;
            });
        }
    }

    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Boundary check and reset
            if (Math.abs(positions[i]) > 8) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 8) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 8) velocities[i + 2] *= -1;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.y += 0.002;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Mouse interaction for hero 3D model
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', function(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (mesh) {
        mesh.rotation.y += mouseX * 0.001;
        mesh.rotation.x += mouseY * 0.001;
    }
}, false);

// Cleanup function
function cleanup() {
    // Stop animations
    if (loadingAnimationId) {
        cancelAnimationFrame(loadingAnimationId);
    }
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Dispose of geometries and materials
    if (loadingRenderer) {
        loadingRenderer.dispose();
    }
    if (renderer) {
        renderer.dispose();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing 3D components...');
    
    // Initialize loading screen immediately
    initLoadingScreen();
    
    // Initialize hero 3D after a short delay
    setTimeout(initHero3D, 100);
});

// Hide loading screen when page is fully loaded
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    setTimeout(() => {
        const loadingPage = document.getElementById('loading-page');
        if (loadingPage) {
            console.log('Hiding loading page');
            loadingPage.classList.add('fade-out');
            
            // Stop loading animation
            if (loadingAnimationId) {
                cancelAnimationFrame(loadingAnimationId);
            }
        }
    }, 2000); // Show loading for 2 seconds minimum
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

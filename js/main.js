//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/controls/OrbitControls.js';


const clock = new THREE.Clock();

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// // Movement variables
let ship = null; // Placeholder for the ship model
let shipSpeed = 0; // Current speed
const maxSpeed = 0.2; // Maximum forward/backward speed
const turnSpeed = 0.05; // Speed of turning
let shipRotation = 0; // Ship's current heading (in radians)


//Store Bounding Box for islands in const
const islandBoundingBoxes = [];


// Load Island 1 Island by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/bzLVwG4AzvA)
const loader2 = new GLTFLoader();
loader2.load('./models/island.glb', (gltf) => {
  const island = gltf.scene;
  island.scale.set(0.1, 0.1, 0.1);
  island.position.set(10, 0.25, -20);
  island.rotation.y = Math.PI / 4;

  scene.add(island);
  console.log('Island 1 loaded and added to the scene!');

    // Create and shrink bounding box
const islandBox = new THREE.Box3().setFromObject(island);
islandBox.expandByScalar(-0.5); // Shrink the box uniformly by 0.5 units , -0.2 allows closer proximity, -1.0 gives more leeway
islandBoundingBoxes.push(islandBox);
}, undefined, (error) => {
  console.error('Error loading the island model:', error);
});


// Load Island 2 Island by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/bzLVwG4AzvA)
const loader3 = new GLTFLoader();
loader3.load('./models/island.glb', (gltf) => {
  const island = gltf.scene;
  island.scale.set(0.1, 0.1, 0.1);
  island.position.set(-15, 0.25, 10);
  island.rotation.y = Math.PI / 6;

  scene.add(island);
  console.log('Island 2 loaded and added to the scene!');
  // Create and shrink bounding box 
const islandBox = new THREE.Box3().setFromObject(island);
islandBox.expandByScalar(-0.5); // Shrink the box uniformly by 0.5 units , -0.2 allows closer proximity, -1.0 gives more leeway
islandBoundingBoxes.push(islandBox);
}, undefined, (error) => {
  console.error('Error loading the island model:', error);
});


// Load Island 3 Island by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/bzLVwG4AzvA)
const loader4 = new GLTFLoader();
loader4.load('./models/island.glb', (gltf) => {
  const island = gltf.scene;
  island.scale.set(0.1, 0.1, 0.1);
  island.position.set(25, 0.25, 40);
  island.rotation.y = Math.PI / 8;

  scene.add(island);
  console.log('Island 3 loaded and added to the scene!');
  // Create and shrink bounding box
const islandBox = new THREE.Box3().setFromObject(island);
islandBox.expandByScalar(-0.5); // Shrink the box uniformly by 0.5 units , -0.2 allows closer proximity, -1.0 gives more leeway
islandBoundingBoxes.push(islandBox);
}, undefined, (error) => {
  console.error('Error loading the island model:', error);
});

// Load Big Rock Island by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/1jUt3HwyHfn)
const loader5 = new GLTFLoader();
loader5.load('./models/big_rock_island.glb', (gltf) => {
  const island = gltf.scene;
  island.scale.set(0.6, 0.6, 0.6);
  island.position.set(0, 0, -100);
  // island.rotation.y = Math.PI / 1;

  scene.add(island);
  console.log('Island 3 loaded and added to the scene!');
  // Create and shrink bounding box
const islandBox = new THREE.Box3().setFromObject(island);
islandBox.expandByScalar(-7.0); // Shrink the box uniformly by 0.5 units , -0.2 allows closer proximity, -1.0 gives more leeway
islandBoundingBoxes.push(islandBox);
}, undefined, (error) => {
  console.error('Error loading the island model:', error);
});

// Add Dialog Boxes
function createDialog(text, position) {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: createTextTexture(text),
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(5, 2.5, 1); // Adjust size
  sprite.position.copy(position).add(new THREE.Vector3(0, 5, 0)); // Position above the island
  scene.add(sprite);

  return sprite;
}

// Helper: Create a text texture for the dialog
function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 128;

  // Draw background
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = '20px Arial';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Show Dialog Box

function showDialog(message, position) {
  const dialog = document.createElement('div');
  dialog.className = 'dialog-box';
  dialog.textContent = message;
  document.body.appendChild(dialog);

  // Update dialog position based on the 3D position
  const vector = position.clone().project(camera); // Convert to 2D
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
  dialog.style.left = `${x}px`;
  dialog.style.top = `${y}px`;
  dialog.style.display = 'block';

  // Hide after a few seconds
  setTimeout(() => dialog.remove(), 3000);
}


//Load Regular Pirate Ship (Cartoon ship in the expanded details)
const loader = new GLTFLoader();
loader.load('./models/pirate_ship.glb', (gltf) => {
  ship = gltf.scene; // Assign the ship variable
  ship.scale.set(0.5, 0.5, 0.5); // Adjust scale
  ship.position.set(0, 1, 45); // Center the ship

// // Cartoon Pirate Ship  ALSO, MOVEMENT INVERTED?
// const loader = new GLTFLoader();
// loader.load('./models/sail_ship.glb', (gltf) => {
//   ship = gltf.scene; // Assign the ship variable
//   ship.scale.set(1.5, 1.5, 1.5); // Adjust scale
//   ship.position.set(0, 0, 45); // Center the ship
//   ship.rotation.y = Math.PI / 1; // Rotation of ship, original model is not straight


  scene.add(ship); // Add ship to the scene
  console.log('Pirate ship loaded and added to the scene!');
  console.log('Ship:', ship); // Debugging
}, undefined, (error) => {
  console.error('Error loading the model:', error);
});

// Movement on the boat 
const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') movement.forward = true;
  if (event.key === 'ArrowUp') movement.backward = true;
  if (event.key === 'ArrowLeft') movement.left = true;
  if (event.key === 'ArrowRight') movement.right = true;
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowDown') movement.forward = false;
  if (event.key === 'ArrowUp') movement.backward = false;
  if (event.key === 'ArrowLeft') movement.left = false;
  if (event.key === 'ArrowRight') movement.right = false;
});

// Resize Event Listener - Used to make the game work when it's on any size screen
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//Bounding Box for the Ship
const shipBoundingBox = new THREE.Box3();

// Update ship's bounding box
function updateShipBoundingBox() {
  if (ship) {
    shipBoundingBox.setFromObject(ship);
  }
}

//Check for collisions
function checkCollisions() {
  for (const islandBox of islandBoundingBoxes) {
    if (shipBoundingBox.intersectsBox(islandBox)) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}

// Ocean Geometry and Shader Material
const oceanGeometry = new THREE.PlaneGeometry(500, 500, 256, 256);
const oceanMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x1ca3ec) },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 0.1 + uTime) * 0.5 + cos(pos.y * 0.1 + uTime) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(uColor, 1.0);
    }
  `,
  wireframe: false,
});

const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2; // Lay the plane flat
scene.add(ocean);

  

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  

    scene.fog = new THREE.Fog(0x87ceeb, 10, 75);



  // Cartoony blue, rather than regular image
  scene.background = new THREE.Color(0x87ceeb);


  const cannonballs = []; // Array to store active cannonballs
  const cannonballSpeed = 15; // Adjust speed of cannonballs
  
  // Fire a cannonball

  function fireCannonball(holdTime) {
    if (!ship) return;

    const cannonballGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const cannonballMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const cannonball = new THREE.Mesh(cannonballGeometry, cannonballMaterial);

    // Set cannonball position to ship's position
    cannonball.position.copy(ship.position);

    // Offset to simulate firing from the cannon
    const cannonOffset = new THREE.Vector3(0, 1, -1);
    cannonball.position.add(cannonOffset.applyQuaternion(ship.quaternion));

    // Set the initial velocity based on ship direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(ship.quaternion);

    // Scale power based on hold time (cap at 3 seconds)
    const chargeTime = Math.min(holdTime, 3); // Max charge time of 3 seconds
    const powerMultiplier = 5 + chargeTime * 10; // Base speed + scaling factor

    // Increase speed and arc height based on hold time
    const initialVelocity = new THREE.Vector3(
        direction.x * powerMultiplier,
        5 + chargeTime * 2, // Higher arc with longer hold
        direction.z * powerMultiplier
    );

    cannonball.userData.velocity = initialVelocity;
    cannonball.userData.gravity = new THREE.Vector3(0, -9.8, 0); // Gravity

    scene.add(cannonball);
    cannonballs.push(cannonball);
}



   // Cannonball space bar hold down time
   let cannonHoldTime = 0;
   let isChargingCannon = false;

  // Add Explosion Effect for Cannonballs  

  function createExplosion(position) {
    const explosionGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const explosionMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
  
    explosion.position.copy(position);
    scene.add(explosion);
  
    // Animate the explosion
    let scale = 1;
    const explosionDuration = 500; // Duration in milliseconds
    const explosionStart = performance.now();
  
    function animateExplosion() {
      const elapsed = performance.now() - explosionStart;
      scale += 0.05; // Increase size
      explosion.scale.set(scale, scale, scale);
      explosion.material.opacity = 1 - elapsed / explosionDuration; // Fade out
  
      if (elapsed < explosionDuration) {
        requestAnimationFrame(animateExplosion);
      } else {
        scene.remove(explosion); // Remove after animation
      }
    }
    animateExplosion();
  }
  
  // Cannon Ball Charge up 

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isChargingCannon) {
        isChargingCannon = true;
        cannonHoldTime = 0; // Reset hold time
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' && isChargingCannon) {
        fireCannonball(cannonHoldTime); // Fire with charge-based power
        isChargingCannon = false;
    }
});


// Game Loop

function gameLoop() {
  requestAnimationFrame(gameLoop);

  const deltaTime = clock.getDelta(); // Get elapsed time
  const elapsedTime = clock.getElapsedTime(); // Get elapsed time

  if (isChargingCannon) {
    cannonHoldTime += deltaTime; // Increase hold time
}
    // Update cannonballs
    updateCannonballs(deltaTime); // Apply gravity & movement

    // Proximity Detection of Ship closing in on dialog boxes
function checkProximity() {
  if (!ship) return; // Exit if the ship is not initialized

  const shipPosition = ship.position;

  for (let i = 0; i < islandBoundingBoxes.length; i++) {
    const islandBox = islandBoundingBoxes[i];
    const islandCenter = new THREE.Vector3();
    islandBox.getCenter(islandCenter);

    const distance = shipPosition.distanceTo(islandCenter);
    if (distance < 50) { // Adjust the threshold as needed
      showDialog(`You found Island ${i + 1}!`, islandCenter);
    }
  }
}
    checkProximity(); // Check for proximity to islands

  // Update the ocean's shader time uniform

 oceanMaterial.uniforms.uTime.value += 0.015; // Wave animation

  if (ship) {
    // Save the ship's previous position
    const previousPosition = ship.position.clone();

    // Turning (left/right)
    if (movement.left) ship.rotation.y += turnSpeed;
    if (movement.right) ship.rotation.y -= turnSpeed;

    // Forward/Backward movement
    if (movement.forward) shipSpeed = Math.min(shipSpeed + 0.01, maxSpeed);
    else if (movement.backward) shipSpeed = Math.max(shipSpeed - 0.01, -maxSpeed);
    else shipSpeed *= 0.98; // Gradual deceleration

    // Update ship's position based on its rotation
    const directionX = Math.sin(ship.rotation.y);
    const directionZ = Math.cos(ship.rotation.y);
    ship.position.x += directionX * shipSpeed;
    ship.position.z += directionZ * shipSpeed;

    // Update ship's bounding box
    updateShipBoundingBox();

    // Check for collisions
    if (checkCollisions()) {
      console.log('Collision detected! Reverting position...');
      ship.position.copy(previousPosition); // Revert to previous position
      shipSpeed = 0; // Stop the ship
    }

    // Calculate wave height and tilt
    function calculateWaveHeight(x, z, time) {
      return Math.sin(x * 0.1 + time) * 0.5 + Math.cos(z * 0.1 + time) * 0.5;
    }

    // Calculate wave slope for tilt
    const waveSlopeX = 0.1 * Math.cos(ship.position.x * 0.1 + elapsedTime);
    const waveSlopeZ = -0.1 * Math.sin(ship.position.z * 0.1 + elapsedTime);

    // Base tilt from waves
    const pitch = waveSlopeZ * 0.5; // Forward/backward tilt
    const roll = waveSlopeX * 0.5; // Side-to-side tilt

    // Add random rocking motion
    const smoothRandomPitch = Math.sin(elapsedTime * 0.5) * 0.03; // Smooth sine wave variation
    const smoothRandomRoll = Math.cos(elapsedTime * 0.5) * 0.03; // Smooth sine wave variation

    // Combine wave tilt and random rocking
    const targetRotation = { x: 0, z: 0 };
    targetRotation.x = pitch + smoothRandomPitch;
    targetRotation.z = roll + smoothRandomRoll;

    const lerpFactor = 0.2; // Adjust for smoothness
    ship.rotation.x += (targetRotation.x - ship.rotation.x) * lerpFactor;
    ship.rotation.z += (targetRotation.z - ship.rotation.z) * lerpFactor;

    // Update camera to follow the ship
    camera.position.set(ship.position.x, ship.position.y + 15, ship.position.z + 15);
    camera.lookAt(ship.position);
  }

// Add Cannonball Movement and Collision in the Game Loop

  function updateCannonballs(deltaTime) {
    for (let i = cannonballs.length - 1; i >= 0; i--) {
        const cannonball = cannonballs[i];

        // Apply gravity to the velocity
        cannonball.userData.velocity.add(cannonball.userData.gravity.clone().multiplyScalar(deltaTime));

        // Update position based on new velocity
        cannonball.position.add(cannonball.userData.velocity.clone().multiplyScalar(deltaTime));

        // Check for collisions with islands
        for (const islandBox of islandBoundingBoxes) {
            if (new THREE.Box3().setFromObject(cannonball).intersectsBox(islandBox)) {
                console.log('Cannonball hit an island!');
                createExplosion(cannonball.position);
                scene.remove(cannonball);
                cannonballs.splice(i, 1);
                break;
            }
        }

        // Remove cannonball if it falls below ocean level
        if (cannonball.position.y < 0) {
            scene.remove(cannonball);
            cannonballs.splice(i, 1);
        }
    }
}

  renderer.render(scene, camera);
}
gameLoop();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ctx.translate(canvas.width / 2, canvas.height / 2);

import { getBodyCollision, setBodyCollision, getBoundaryCollision, setBoundaryCollision } from './constants.js';
import { Body } from './body.js'


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bodies.forEach(body => {
    body.draw(ctx);
    body.update();
    if (getBodyCollision())
      body.checkCollision(bodies);
  })

  // Apply gravity between all pairs of bodies
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      bodies[i].applyGravity(bodies[j]);
    }
  }
  window.requestAnimationFrame(draw);
}

function init() {
  window.requestAnimationFrame(draw);
}

// ---------------------------------

// Form handling
const newBodyForm = document.getElementById('newBodyForm');

newBodyForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Extract values from the form
  const x = parseFloat(document.getElementById('xPosition').value) + centerX;
  const y = parseFloat(document.getElementById('yPosition').value) + centerY;
  const vx = parseFloat(document.getElementById('xVelocity').value);
  const vy = parseFloat(document.getElementById('yVelocity').value);
  const radius = parseFloat(document.getElementById('radius').value);
  const mass = document.getElementById('mass').value;
  const color = document.getElementById('color').value;

  // Create a new body and add it to the simulation
  const newBody = new Body(x, y, vx, vy, radius, color, mass); // Assuming mass is based on radius
  bodies.push(newBody);
  initialBodies.push({ x, y, vx, vy, radius, color, mass });

  // Clear form fields for next input
  // newBodyForm.reset();
});

const bodyCollisionCheckbox = document.getElementById('bodyCollisionCheckbox');
const boundaryCollisionCheckbox = document.getElementById('boundaryCollisionCheckbox');
const resetButton = document.getElementById('resetButton');
const removeAllButton = document.getElementById('removeAllButton');

resetButton.addEventListener('click', () => {
  // Reset the bodies array to the initial state
  bodies = createBodies(initialBodies);
});

randomStateButton.addEventListener('click', () => {
  // Reset the bodies array to the initial state
  initialBodies = createInitialState(100);
  bodies = createBodies(initialBodies);
});

removeAllButton.addEventListener('click', () => {
  // Remove all bodies from the simulation
  bodies = [];
  initialBodies = [];
});

bodyCollisionCheckbox.addEventListener('change',  () => {
  setBodyCollision(bodyCollisionCheckbox.checked);
});

boundaryCollisionCheckbox.addEventListener('change', () => {
  setBoundaryCollision(boundaryCollisionCheckbox.checked);
});

document.addEventListener('DOMContentLoaded', () => {
  // Set the default state of the checkboxes
  document.getElementById('bodyCollisionCheckbox').checked = true; // Default to checked
  document.getElementById('boundaryCollisionCheckbox').checked = false; // Default to unchecked
});
// ---------------------------------

function createBodies(initialData) {
  return initialData.map(data => new Body(data.x, data.y, data.vx, data.vy, data.radius, data.color, data.mass));
}

function createInitialState(n) {
  let initialState = [];

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);
    const mass = Math.floor(Math.random() * 30);

    const vx = Math.random() - 0.5;
    const vy = Math.random() - 0.5;

    const newBody = new Body(x, y, vx, vy, 2, 'black', mass); // Assuming mass is based on radius

    initialState.push(newBody);
  }

  return initialState;
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// To achieve a stable circular orbit (https://en.wikipedia.org/wiki/Circular_orbit)
// orbital velocity of body = v = sqrt( ( g * mass ) / radius)
// So if large body = 50000, radius = 150, g = 0.1 (gravitational constant)
// v = sqrt( (0.1 * 50000) / 150 ) = 5.77

let initialBodies = [
  { x: centerX, y: centerY, vx: 0, vy: 0, radius: 5, color: 'red', mass: 50000 },           // Central body with high mass ("sun")
  { x: centerX, y: centerY - 150, vx: -5.77, vy: 0, radius: 3, color: 'orange', mass: 1 },  // Circular orbit (using formula)
  { x: centerX, y: 750, vx: (-0.45 - 3.5), vy: 0, radius: 2.5, color: 'black', mass: 50 },  // Orbiting "planet" 
  { x: centerX, y: 740, vx: (0.25 - 3.5), vy: 0, radius: 2, color: 'blue', mass: 1 },       // Orbiting "moon" around "planet"
]

// Current bodies array
let bodies = createBodies(initialBodies);

init();



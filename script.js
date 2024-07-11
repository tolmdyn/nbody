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

// let initialBodies = [
//   new Body(380, 380, 0, 0, 20, 'blue', 4000),   // Central body with high mass
//   new Body(380, 550, -1.53, 0, 5, 'black', 1),
//   new Body(380, 100, 1.20, 0, 5, 'black', 1),
// ]

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let initialBodies = [
  { x: centerX, y: centerY, vx: 0, vy: 0, radius: 20, color: 'blue', mass: 4000 },   // Central body with high mass
  { x: centerX, y: 550, vx: -1.53, vy: 0, radius: 5, color: 'black', mass: 1 },
  { x: centerX, y: 100, vx: 1.20, vy: 0, radius: 5, color: 'black', mass: 1 },
]

function createBodies(initialData) {
  return initialData.map(data => new Body(data.x, data.y, data.vx, data.vy, data.radius, data.color, data.mass));
}

function createInitialState(n) {
  let initialState = [];

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);
    const mass = Math.floor(Math.random() * 30);
    const newBody = new Body(x, y, 0, 0, 2, 'black', mass); // Assuming mass is based on radius

    initialState.push(newBody);
  }

  return initialState;
}

// Current bodies array
let bodies = createBodies(initialBodies);

init();



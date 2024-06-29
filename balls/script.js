const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { BODY_C } from './constants.js';
import { Body } from './body.js'

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bodies.forEach(body => {
    body.draw(ctx);
    body.update();
    if (BODY_C)
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

newBodyForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Extract values from the form
  const x = parseFloat(document.getElementById('xPosition').value);
  const y = parseFloat(document.getElementById('yPosition').value);
  const vx = parseFloat(document.getElementById('xVelocity').value);
  const vy = parseFloat(document.getElementById('yVelocity').value);
  const radius = parseFloat(document.getElementById('radius').value);
  const mass = document.getElementById('mass').value; 
  const color = document.getElementById('color').value;

  // Create a new body and add it to the simulation
  const newBody = new Body(x, y, vx, vy, radius, color, mass); // Assuming mass is based on radius
  bodies.push(newBody);

  initialBodies.push({x, y, vx, vy, radius, color, mass});

  // Clear form fields for next input
  // newBodyForm.reset();
});

document.getElementById('resetButton').addEventListener('click', () => {
  // Reset the bodies array to the initial state
  bodies = createBodies(initialBodies);
});

document.getElementById('removeAllButton').addEventListener('click', () => {
  // Reset the bodies array to the initial state
  bodies = []; // createBodies(initialBodies);
  initialBodies = [];
});
// ---------------------------------


// let initialBodies = [
//   new Body(380, 380, 0, 0, 20, 'blue', 4000),   // Central body with high mass
//   new Body(380, 550, -1.53, 0, 5, 'black', 1),
//   new Body(380, 100, 1.20, 0, 5, 'black', 1),
// ]

let initialBodies = [
  {x:380, y:380, vx:0, vy:0, radius:20, color:'blue', mass:4000},   // Central body with high mass
  {x:380, y:550, vx:-1.53, vy:0, radius:5, color:'black', mass:1},
  {x:380, y:100, vx:1.20, vy:0, radius:5, color:'black', mass:1},
]

function createBodies(initialData) {
  return initialData.map(data => new Body(data.x, data.y, data.vx, data.vy, data.radius, data.color, data.mass));
}

// Current bodies array
let bodies = createBodies(initialBodies);

init();



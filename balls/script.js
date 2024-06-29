const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { G, BODY_C, MASS_SCALE, DISTANCE_SCALE, BOUNDARY_C, TRAILS, TRAIL_LENGTH } from './constants.js';
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

let bodies = [
  new Body(380, 380, 0, 0, 20, 'blue', 4000),   // Central body with high mass
  // new Body(380, 200, 1.49, 0, 15, 'red', 100),    // body in orbit
  new Body(380, 550, -1.53, 0, 5, 'black', 1),
  new Body(380, 100, 1.20, 0, 5, 'black', 1),
  //new Body(380, 70, 1.35, 0, 5, 'black', 6, 0.1)

];

// let bodies = [
//   new Body(400, 400, 0, 0, 20, 'yellow', 1.989 * MASS_SCALE), // Sun
//   new Body(400, 250, 0.017, 0, 5, 'blue', 5.972 * MASS_SCALE), // Earth
//   new Body(400, 255, 0.022, 0, 2, 'grey', 0.073 * MASS_SCALE)  // Moon
// ];


init();

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

  // Create a new ball and add it to the simulation
  const newBody = new Body(x, y, vx, vy, radius, color, mass); // Assuming mass is based on radius
  bodies.push(newBody);

  // Clear form fields for next input
  newBallForm.reset();
});

newBodyForm.addEventListener('reset', function(event) {

});

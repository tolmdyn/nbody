const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { getBodyCollision } from './constants.js';
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

export function addBody(x, y, vx, vy, radius, color, mass) {
  // Add the parameters to the initial state
  initialBodies.push({ x, y, vx, vy, radius, color, mass });
  // Add a new body to the live simulation
  const newBody = new Body(x, y, vx, vy, radius, color, mass)
  bodies.push(newBody);
}

function createBodies(initialData) {
  return initialData.map(data => new Body(data.x, data.y, data.vx, data.vy, data.radius, data.color, data.mass, data.fixed));
}

function createRandomState(n) {
  let initialState = [];

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);
    const mass = 1 + Math.floor(Math.random() * 30);

    const vx = Math.random() - 0.5;
    const vy = Math.random() - 0.5;

    const newBody = new Body(x, y, vx, vy, 2, 'black', mass);

    initialState.push(newBody);
  }
  return initialState;
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// To achieve a stable circular orbit (https://en.wikipedia.org/wiki/Circular_orbit)
// orbital velocity of body = v = sqrt( ( g * mass ) / radius)
// e.g. if large body = 50000, radius = 150, g = 0.1 (gravitational constant)
// v = sqrt( (0.1 * 50000) / 150 ) = 5.77

 let initialBodies = [
  // Central body with high mass ("sun")
  { x: centerX, y: centerY, vx: 0, vy: 0, radius: 5, color: 'red', mass: 50000, fixed: true },
  // Orbiting "planet"   
  { x: centerX, y: 750, vx: (0 - 3.78), vy: 0, radius: 2.5, color: 'black', mass: 50 },
  // Orbiting "moon" around "planet"         
  { x: centerX, y: 735, vx: (-0.58 - 3.78), vy: 0, radius: 2, color: 'blue', mass: 1 },         
]



// Current bodies array
let bodies = createBodies(initialBodies);

init();



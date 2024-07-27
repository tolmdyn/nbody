// import { addBody, createBodies, createRandomState } from './script.js';

// const centerX = canvas.width / 2;
// const centerY = canvas.height / 2;

// // Form handling
// const newBodyForm = document.getElementById('newBodyForm');

// newBodyForm.addEventListener('submit', function (event) {
//   event.preventDefault();

//   const x = parseFloat(document.getElementById('xPosition').value) + centerX;
//   const y = parseFloat(document.getElementById('yPosition').value) + centerY;
//   const vx = parseFloat(document.getElementById('xVelocity').value);
//   const vy = parseFloat(document.getElementById('yVelocity').value);
//   const radius = parseFloat(document.getElementById('radius').value);
//   const mass = document.getElementById('mass').value || radius;
//   const color = document.getElementById('color').value;

//   if (radius <= 0 || mass <= 0) {
//     alert("Radius and mass must be greater than 0.");
//     return;
//   }

//   if (radius > 10) {
//     alert("Radius must be less than 10.");
//     return;
//   }

//   // Create a new body and add it to the simulation
//   addBody(x, y, vx, vy, radius, color, mass);

//   // Clear form fields for next input
//   // newBodyForm.reset();
// });

// const bodyCollisionCheckbox = document.getElementById('bodyCollisionCheckbox');
// const boundaryCollisionCheckbox = document.getElementById('boundaryCollisionCheckbox');
// const resetButton = document.getElementById('resetButton');
// const removeAllButton = document.getElementById('removeAllButton');

// resetButton.addEventListener('click', () => {
//   // Reset the bodies array to the initial state
//   bodies = createBodies(initialBodies);
// });

// randomStateButton.addEventListener('click', () => {
//   // Create a new random state of bodies
//   initialBodies = createRandomState(100);
//   bodies = createBodies(initialBodies);
// });

// removeAllButton.addEventListener('click', () => {
//   // Remove all bodies from the simulation
//   bodies = [];
//   initialBodies = [];
// });

// bodyCollisionCheckbox.addEventListener('change',  () => {
//   setBodyCollision(bodyCollisionCheckbox.checked);
// });

// boundaryCollisionCheckbox.addEventListener('change', () => {
//   setBoundaryCollision(boundaryCollisionCheckbox.checked);
// });

// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('bodyCollisionCheckbox').checked = true;
//   document.getElementById('boundaryCollisionCheckbox').checked = false;
// });
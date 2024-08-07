// Parameters for use by the simulation

// Gravitational constant scaled for simulation (Realistic Universal G = 6.67430e-11)
export const G = 0.1;

// Coefficient of Restitution
export const e = 0.9;

// Trail length
export const TRAIL_LENGTH = 250;

// Show trail
export const TRAILS = true;

// Body and boundary collision toggles
let BODY_C = true;
let BOUNDARY_C = false;

export function getBodyCollision() {
  return BODY_C;
}

export function setBodyCollision(value) {
  BODY_C = value;
}

export function getBoundaryCollision() {
  return BOUNDARY_C;
}

export function setBoundaryCollision(value) {
  BOUNDARY_C = value;
}
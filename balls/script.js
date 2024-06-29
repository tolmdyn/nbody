const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { G, BODY_C, BOUNDARY_C, TRAILS, TRAIL_LENGTH } from './constants.js';
import { Ball } from './ball.js'

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ball.draw(ctx);
    ball.update();
    if (BODY_C)
      ball.checkCollision(balls);
  })

  // Apply gravity between all pairs of balls
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].applyGravity(balls[j]);
    }
  }
  window.requestAnimationFrame(draw);
}

function init() {
  window.requestAnimationFrame(draw);
}

// ---------------------------------

let balls = [
  new Ball(380, 380, 0, 0, 20, 'blue', 4000),   // Central ball with high mass
  new Ball(380, 200, 1.49, 0, 15, 'red', 100),    // Ball in orbit
  new Ball(380, 550, -1.53, 0, 5, 'black', 5),
  new Ball(380, 100, 1.20, 0, 5, 'black', 5)
];


init();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let raf;

// -------------------------------

// Gravitational constant
const G = 0.1;

// Body collision
const BODY_C = true;

// Boundary collision
const BOUNDARY_C = true;

// 
// -------------------------------

class Ball {
  constructor(x, y, vx, vy, radius, color, mass) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.mass = mass | radius;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Entropy / resistance
    // this.vx = this.vx * 0.999
    // this.vy = this.vy * 0.999

    this.x += this.vx;
    this.y += this.vy;

    // - Bouncing off walls
    if (BOUNDARY_C) {
      if (this.y + this.vy > canvas.height - this.radius ||
        this.y + this.vy < this.radius
      ) {
        this.vy = -this.vy;
      }
      if (
        this.x + this.vx > canvas.width - this.radius ||
        this.x + this.vx < this.radius
      ) {
        this.vx = -this.vx;
      }
    }
  }

  checkBoundaryCollision() {
    // check if ball is out of bounds, for the ball-ball collision
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    } else if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    } else if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
    }
  }

  isColliding(otherBall) {
    const dx = this.x - otherBall.x;
    const dy = this.y - otherBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.radius + otherBall.radius;
  }

  checkCollision(balls) {
    balls.forEach(ball => {
      if (ball === this) {
        return
      }

      if (this.isColliding(ball)) {
        this.resolveCollision(ball);
      }

    })
  }

  resolveCollision(otherBall) {
    const dx = this.x - otherBall.x;
    const dy = this.y - otherBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return; // Prevent division by zero

    // Minimum distance to keep balls from overlapping
    const minDistance = this.radius + otherBall.radius;
    const overlap = minDistance - distance;

    // Normalize the vector between the balls
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate relative velocity
    const dvx = this.vx - otherBall.vx;
    const dvy = this.vy - otherBall.vy;

    // Calculate relative velocity in terms of the normal direction
    const vn = dvx * nx + dvy * ny;

    // If balls are moving apart, no need to resolve
    if (vn > 0) return;

    // Calculate impulse scalar
    const impulse = (2 * vn) / (this.mass + otherBall.mass);

    // Apply impulse to the balls (scale to mass/radius)
    this.vx -= impulse * nx * otherBall.mass;
    this.vy -= impulse * ny * otherBall.mass;
    otherBall.vx += impulse * nx * this.mass;
    otherBall.vy += impulse * ny * this.mass;

    // Separate the balls to prevent overlap
    this.x += nx * overlap / 2;
    this.y += ny * overlap / 2;
    otherBall.x -= nx * overlap / 2;
    otherBall.y -= ny * overlap / 2;

    // Check we haven't nudged a ball outside of bounds
    if (BOUNDARY_C) {
      this.checkBoundaryCollision();
      otherBall.checkBoundaryCollision();
    }
  }

  applyGravity(otherBall) {
    const dx = otherBall.x - this.x;
    const dy = otherBall.y - this.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);

    if (distanceSquared === 0 || distance < 1) return;

    // Calculate gravitational force magnitude
    const forceMagnitude = (G * this.mass * otherBall.mass) / distanceSquared;

    // Normalize the direction vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate gravitational force components
    const fx = forceMagnitude * nx;
    const fy = forceMagnitude * ny;

    // Apply gravitational force to velocities
    const dt = 1;
    this.vx += fx / this.mass * dt;
    this.vy += fy / this.mass * dt;
    otherBall.vx -= fx / otherBall.mass * dt;
    otherBall.vy -= fy / otherBall.mass * dt;

    // Debugging: Print velocities
    // console.log(`Ball 1: vx=${this.vx.toFixed(2)}, vy=${this.vy.toFixed(2)}`);
    // console.log(`Ball 2: vx=${otherBall.vx.toFixed(2)}, vy=${otherBall.vy.toFixed(2)}`);
  }
}

// let balls = [];
let balls = [
  new Ball(canvas.width / 2, canvas.height / 2, 0, 0, 20, 'yellow', 5000),
  new Ball(canvas.width / 2 + 200, 30, 0, 0, 20, 'blue', 5000),
  new Ball(canvas.width / 2, 10, 0, 0, 8, 'green'),
  new Ball(canvas.width / 2, 700, 0, 0, 8, 'green'),
]

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = 'rgba(225,225,225,0.05)';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);


  balls.forEach(ball => {
    ball.draw();
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

function addBalls() {
  for (let i = 0; i < 50; i++) {
    balls.push(new Ball(5 + i * 10, 100, 0, -5, 5, 'red'));
  }
}

// addBalls();
init();

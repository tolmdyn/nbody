const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let raf;


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
    this.x += this.vx;
    this.y += this.vy;

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

  isColliding(otherBall) {
    // aabb collision
    // return !(this.x + this.radius < otherBall.x - otherBall.radius ||
    //   this.x - this.radius > otherBall.x + otherBall.radius ||
    //   this.y + this.radius < otherBall.y - otherBall.radius ||
    //   this.y - this.radius > otherBall.y + otherBall.radius);

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
    const impulse = 2 * vn / (this.radius + otherBall.radius);

    // Apply impulse to the balls
    this.vx -= impulse * nx * otherBall.radius;
    this.vy -= impulse * ny * otherBall.radius;
    otherBall.vx += impulse * nx * this.radius;
    otherBall.vy += impulse * ny * this.radius;

    // Separate the balls to prevent overlap
    this.x += nx * overlap / 2;
    this.y += ny * overlap / 2;
    otherBall.x -= nx * overlap / 2;
    otherBall.y -= ny * overlap / 2;
  }
}

// let balls = [];
let balls = [
  new Ball(canvas.width/2 - 200, 10, 1.5, 1.5, 8, 'red'),
  new Ball(canvas.width/2 + 200, 10, -1.5, 1.5, 8, 'blue'),
  new Ball(canvas.width/2, 10, 0, -1.5, 8, 'green'),
]

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ball.draw();
    ball.update();
    ball.checkCollision(balls);
  })

  raf = window.requestAnimationFrame(draw);
}

function init() {
  window.requestAnimationFrame(draw);
}

function addBalls() {
  for (let i = 0; i < 50; i++) {
    balls.push(new Ball(5 + i * 10, 100, 0, 5, 5, 'red'));
  }
}

addBalls();
init();

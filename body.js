import { G, e, TRAILS, TRAIL_LENGTH, getBoundaryCollision } from './constants.js';

export class Body {
  constructor(x, y, vx, vy, radius, color, mass, fixed = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.mass = mass;
    this.fixed = fixed;

    this.trail = [];
  }

  draw(ctx) {
    // draw the trail
    if (TRAILS) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
    // draw the body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.fixed) {
      return;
    }
    // Update velocity based on entropy / resistance
    // this.vx = this.vx * 0.999
    // this.vy = this.vy * 0.999

    this.trail.push({ x: this.x, y: this.y });

    if (this.trail.length > TRAIL_LENGTH) {
      this.trail.shift();
    }

    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;

    // - Bouncing off walls
    if (getBoundaryCollision()) {
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
    } else {
      // Possibly check if a body is far outside of bounds,
      // "forget" about it and stop updating to save cpu time.
    }
  }

  // Check collision with edges of the canvas
  resolveBoundaryCollision() {
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

  isColliding(otherBody) {
    const dx = this.x - otherBody.x;
    const dy = this.y - otherBody.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.radius + otherBody.radius;
  }

  checkCollision(bodies) {
    bodies.forEach(body => {
      if (body === this) {
        return
      }

      if (this.isColliding(body)) {
        this.resolveCollision(body);
      }

    })
  }

  // Resolve a collision between two bodies
  resolveCollision(otherBody) {
    const dx = this.x - otherBody.x;
    const dy = this.y - otherBody.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return; // Prevent division by zero

    // Normalize the vector between the bodies
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate relative velocity
    const dvx = this.vx - otherBody.vx;
    const dvy = this.vy - otherBody.vy;

    // Calculate relative velocity in terms of the normal direction
    const vn = dvx * nx + dvy * ny;

    // If bodies are moving apart, no need to resolve
    if (vn > 0) return;

    // Calculate impulse scalar based on masses and coefficient of restitution
    const impulse = (2 * vn * e) / (this.mass + otherBody.mass);

    // Apply impulse to the bodies (scale to mass/radius)
    this.vx -= impulse * nx * otherBody.mass;
    this.vy -= impulse * ny * otherBody.mass;
    otherBody.vx += impulse * nx * this.mass;
    otherBody.vy += impulse * ny * this.mass;

    // Separate the bodies to prevent overlap by moving the smallest
    // NB: This isnt very accurate to real life but prevents glitches

    // Minimum distance to keep bodies from overlapping
    // const minDistance = this.radius + otherBody.radius;
    // const overlap = minDistance - distance;

    // //if (this.mass < otherBody.mass) {
    //   this.x += nx * overlap /2 ;
    //   this.y += ny * overlap /2;
    // //} else {
    //   otherBody.x -= nx * overlap /2;
    //   otherBody.y -= ny * overlap /2;
    // //}

    // Check we haven't nudged a body outside of bounds
    if (getBoundaryCollision()) {
      this.resolveBoundaryCollision();
      otherBody.checkBoundaryCollision();
    }
  }

  applyGravity(otherBody) {
    const dx = otherBody.x - this.x;
    const dy = otherBody.y - this.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);

    if (distanceSquared === 0 || distance < 1) return;

    // Calculate gravitational force magnitude
    const forceMagnitude = (G * this.mass * otherBody.mass) / distanceSquared;

    // Normalize the direction vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate gravitational force components
    const fx = forceMagnitude * nx;
    const fy = forceMagnitude * ny;

    // Apply gravitational force to velocities
    const dt = 1; // timestep
    this.vx += fx / this.mass * dt;
    this.vy += fy / this.mass * dt;
    otherBody.vx -= fx / otherBody.mass * dt;
    otherBody.vy -= fy / otherBody.mass * dt;

    // Debugging: Print velocities
    // console.log(`Body 1: vx=${this.vx.toFixed(2)}, vy=${this.vy.toFixed(2)}`);
    // console.log(`Body 2: vx=${otherbody.vx.toFixed(2)}, vy=${otherbody.vy.toFixed(2)}`);
  }
}

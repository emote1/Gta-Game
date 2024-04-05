const PARTICLE_SIZE_MIN = 2;
const PARTICLE_SIZE_MAX = 6;
const PARTICLE_COLOR = "#920101";
const PARTICLE_FRICTION = 0.99;
const ALPHA_DECREMENT = 0.01;

export class Particle {
  constructor(x, y, context) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.radius = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
    this.color = PARTICLE_COLOR;
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    this.alpha = 1;
    this.friction = PARTICLE_FRICTION;
  }

  draw() {
    this.context.save();
    this.context.globalAlpha = this.alpha;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= ALPHA_DECREMENT;
  }
}

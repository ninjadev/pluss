function ParticleSystem(options) {
  options = options || {};
  this.particles = [];
  this.numParticles = options.numParticles || 256;
  this.colors = options.colors || ['#1C999D', '#FF9A66', '#F778A1', '#65FE65', '#40C6D9', '#FFF768', '#B07FBB'];

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  this.blendMode = options.blendMode || 'source-over';

  this.gravity = options.gravity || {x: 0, y: 0};
  this.friction = options.friction || 0.99;
  this.spawnIndex = 0;
  this.T = options.life || 120;

  this.random = new Random(666);

  this.shapeFunctions = [
    this.renderHalfStrokedArc,
    this.renderHexagon,
    this.renderJaggedLine,
    this.renderPlus,
    this.renderQuarterStrokedArc,
    this.renderSquare,
    this.renderStar,
    this.renderQuarterFilledArc,
    this.renderTriangle,
    this.renderWavyLine,
    this.renderWideRectangle,
    this.renderHalfFilledArc,
  ];

  for (let i = 0; i < this.numParticles; i++) {
    this.particles[i] = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      rotation: 0,
      rotationalSpeed: 0,
      t: 0,
      shapeFunction: this.shapeFunctions[i % this.shapeFunctions.length],
      color: this.colors[i % this.colors.length],
      size: 0.36,
    };
  }
}


ParticleSystem.prototype.update = function() {
  for (let i = 0; i < this.numParticles; i++) {
    const p = this.particles[i];
    if (p.t > 0) {
      p.x += p.dx - this.gravity.x;
      p.y += p.dy - this.gravity.y;
      p.rotation += p.rotationalSpeed;
      p.dx *= this.friction;
      p.dy *= this.friction;
      p.rotationalSpeed *= this.friction;
      p.t--;
    }
  }
};

ParticleSystem.prototype.render = function(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = this.blendMode;
  for (let i = 0; i < this.numParticles; i++) {
    const p = this.particles[i];
    const alpha = Math.min(1, p.t / 20);
    ctx.globalAlpha = Math.pow(alpha, 3);
    p.shapeFunction(ctx, p.x + 0.05, p.y + 0.05, p.size, p.rotation, 'black');
    ctx.globalAlpha = alpha;
    p.shapeFunction(ctx, p.x, p.y, p.size, p.rotation, p.color);
  }
  ctx.restore();
};

ParticleSystem.prototype.spawn = function(x, y, dx=null, dy=null, rotation=null, rotationalSpeed=null, size=0.36) {
  const p = this.particles[this.spawnIndex];
  p.x = x;
  p.y = y;
  if (dx === null || dy === null || rotation === null || rotationalSpeed === null) {
    const randomAngle = this.random() * Math.PI * 2;
    p.dx = 0.04 * Math.cos(randomAngle);
    p.dy = 0.04 * Math.sin(randomAngle);
    p.x += 8 * p.dx;  // offset initial position
    p.y += 8 * p.dy;  // offset initial position
    p.rotation = randomAngle;
    p.rotationalSpeed = 0.05 * (0.5 - this.random());
  } else {
    p.dx = dx;
    p.dy = dy;
    p.rotation = rotation;
    p.rotationalSpeed = rotationalSpeed;
  }
  p.shapeFunction = this.shapeFunctions[Math.floor(this.random() * this.shapeFunctions.length)];
  p.color = this.colors[Math.floor(this.random() * this.colors.length)];
  p.size = size;
  p.t = this.T;
  this.spawnIndex++;
  if (this.spawnIndex >= this.particles.length) {
    this.spawnIndex = 0;
  }
};

ParticleSystem.prototype.renderWideRectangle = function(ctx, x, y, radius, rotation, color) {
  const thickness = radius / 3;
  const diameter = radius * 3;

  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillRect(-diameter / 2, -thickness / 2, diameter, thickness);
  ctx.restore();
};

ParticleSystem.prototype.renderPlus = function(ctx, x, y, radius, rotation, color) {
  const halfThickness = radius / 4;

  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.beginPath();
  ctx.moveTo(-radius, -halfThickness);
  ctx.lineTo(-halfThickness, -halfThickness);
  ctx.lineTo(-halfThickness, -radius);
  ctx.lineTo(halfThickness, -radius);
  ctx.lineTo(halfThickness, -halfThickness);
  ctx.lineTo(radius, -halfThickness);
  ctx.lineTo(radius, halfThickness);
  ctx.lineTo(halfThickness, halfThickness);
  ctx.lineTo(halfThickness, radius);
  ctx.lineTo(-halfThickness, radius);
  ctx.lineTo(-halfThickness, halfThickness);
  ctx.lineTo(-radius, halfThickness);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

function renderPolygon(ctx, x, y, radius, rotation, color, numPoints) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(
    radius * Math.cos(0),
    radius * Math.sin(0)
  );
  for (let j = 0; j < numPoints; j++) {
    ctx.lineTo(
      radius * Math.cos(j * 2 * Math.PI / numPoints),
      radius * Math.sin(j * 2 * Math.PI / numPoints)
    );
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

ParticleSystem.prototype.renderTriangle = function(ctx, x, y, radius, rotation, color) {
  return renderPolygon(ctx, x, y, radius, rotation, color, 3);
};

ParticleSystem.prototype.renderHexagon = function(ctx, x, y, radius, rotation, color) {
  return renderPolygon(ctx, x, y, radius, rotation, color, 6);
};

ParticleSystem.prototype.renderSquare = function(ctx, x, y, radius, rotation, color) {
  return renderPolygon(ctx, x, y, radius, rotation, color, 4);
};

ParticleSystem.prototype.renderStar = function(ctx, x, y, radius, rotation, color, numPoints = 5, insetFactor = 0.5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.moveTo(0, 0 - radius);
  for (let i = 0; i < numPoints; i++) {
    ctx.rotate(Math.PI / numPoints);
    ctx.lineTo(0, 0 - (radius * insetFactor));
    ctx.rotate(Math.PI / numPoints);
    ctx.lineTo(0, 0 - radius);
  }
  ctx.fill();
  ctx.restore();
};

ParticleSystem.prototype.renderJaggedLine = function(ctx, x, y, radius, rotation, color, numPoints = 8) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.12 * radius;

  ctx.moveTo(-2 * radius, 0);
  ctx.beginPath();
  for (let j = 0; j < numPoints; j++) {
    ctx.lineTo(
      -2 * radius + (j - (j % 2 === 1 ? 0.4 : 0)) * 4 * radius / numPoints,
      (0.12 + 0.04 * j) * (j % 2 === 0 ? -1 : 1)
    );
  }
  ctx.stroke();

  ctx.restore();
};

ParticleSystem.prototype.renderWavyLine = function(ctx, x, y, radius, rotation, color, numPoints = 12) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.12 * radius;

  ctx.moveTo(-2 * radius, 0);
  ctx.beginPath();
  for (let j = 0; j < numPoints; j++) {
    ctx.lineTo(
      -2 * radius + j * 4 * radius / numPoints,
      0.08 * Math.sin(4 * Math.PI * j / numPoints)
    );
  }
  ctx.stroke();

  ctx.restore();
};

ParticleSystem.prototype.renderHalfFilledArc = function(ctx, x, y, radius, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI);
  ctx.fill();
  ctx.restore();
};

ParticleSystem.prototype.renderHalfStrokedArc = function(ctx, x, y, radius, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.lineWidth = 0.24 * radius;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
};

ParticleSystem.prototype.renderQuarterFilledArc = function(ctx, x, y, radius, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, 0, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

ParticleSystem.prototype.renderQuarterStrokedArc = function(ctx, x, y, radius, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.lineWidth = 0.24 * radius;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI / 2);
  ctx.stroke();
  ctx.restore();
};

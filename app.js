// app.js

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SOURCE_POINT_RADIUS = 7;
const MAX_RADIANS = Math.PI * 2;
const state = {
  sourcePoint: { x: 50, y: 100 },
  mousePoint: { x: 0, y: 0 },
  circles: [
    { x: 400, y: 400, r: 100 },
    { x: 200, y: 300, r: 70 },
    { x: 600, y: 180, r: 130 }
  ],
  boxes: [
    { x: 600, y: 450, halfSize: { x: 40, y: 80 } }
  ]
};

const update = (time, prevTime) => {
  const timeDiff = time - prevTime;
};

const MAX_DISTANCE = 500;
const signedDistanceToScene = pt => {
  let distanceToScene = MAX_DISTANCE;
  for (circle of state.circles) {
    const distanceToCircle = signedDistanceToCircle(pt, circle, circle.r);
    distanceToScene = Math.min(distanceToCircle, distanceToScene);
  }
  for (box of state.boxes) {
    const distanceToBox = signedDistanceToBox(pt, box, box.halfSize);
    distanceToScene = Math.min(distanceToBox, distanceToScene);
  }
  return distanceToScene;
};

const clearBackground = () => {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSourcePoint = () => {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(state.sourcePoint.x, state.sourcePoint.y, SOURCE_POINT_RADIUS, 0, MAX_RADIANS);
  ctx.fill();
};

const drawCircles = () => {
  ctx.fillStyle = 'black';
  for ({ x, y, r} of state.circles) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, MAX_RADIANS);
    ctx.fill();
  }
};

const drawBoxes = () => {
  ctx.fillStyle = 'black';
  for ({ x, y, halfSize} of state.boxes) {
    ctx.fillRect(x - halfSize.x, y - halfSize.y, halfSize.x * 2, halfSize.y * 2);
  }
}

const drawLine = () => {
  ctx.strokeStyle = 'rgb(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(state.sourcePoint.x, state.sourcePoint.y);
  ctx.lineTo(state.mousePoint.x, state.mousePoint.y);
  ctx.stroke();

  const yDiff = state.sourcePoint.y - state.mousePoint.y;
  const xDiff = state.sourcePoint.x - state.mousePoint.x;
  const angleInRads = Math.atan(yDiff / xDiff);
  const angleOffset = (state.mousePoint.x <= state.sourcePoint.x ? -1 : 1);

  let nextPoint = Object.assign({}, state.sourcePoint);
  let radius = signedDistanceToScene(nextPoint);
  const isNextPointIsOnScreen = () => (
    (nextPoint.x >= 0) && (nextPoint.x < canvas.width) &&
    (nextPoint.y >= 0) && (nextPoint.y < canvas.height)
  );
  do {
    if (radius >= 1) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(nextPoint.x, nextPoint.y, radius, 0, MAX_RADIANS);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(nextPoint.x, nextPoint.y, radius, 0, MAX_RADIANS);
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // next point
    nextPoint = {
      x: nextPoint.x + angleOffset * (Math.cos(angleInRads) * radius),
      y: nextPoint.y + angleOffset * (Math.sin(angleInRads) * radius)
    };
    radius = signedDistanceToScene(nextPoint);
  } while (radius > 1 && isNextPointIsOnScreen());

  // draw white line to next point
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(state.sourcePoint.x, state.sourcePoint.y);
  ctx.lineTo(nextPoint.x, nextPoint.y);
  ctx.stroke();
};

const draw = time => {
  clearBackground();
  drawCircles();
  drawBoxes();
  drawSourcePoint();
  drawLine();
};

let prevTime = 0;
const loop = time => {
  update(time, prevTime);
  draw(time, prevTime);
  prevTime = time;
  requestAnimationFrame(loop);
};

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const mousemove = ({ clientX, clientY }) => {
  state.mousePoint = { x: clientX, y: clientY };
};

const mouseup = ({ clientX, clientY }) => {
  state.sourcePoint = { x: clientX, y: clientY };
}

const init = () => {
  resize();
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
  state.sourcePoint = { x: canvas.width / 2, y: canvas.height / 2 };
  window.addEventListener('resize', resize);

  const NUM_CIRCLES = 5;
  const BUFFER = 50;
  const MIN_RADIUS = 30;
  const MAX_RADIUS = 100;
  const randomCircles = new Array(NUM_CIRCLES).fill().map(() => ({
    x: (Math.random() * (canvas.width - BUFFER - BUFFER)) + BUFFER,
    y: (Math.random() * (canvas.height - BUFFER - BUFFER)) + BUFFER,
    r: (Math.random() * (MAX_RADIUS - MIN_RADIUS)) + MIN_RADIUS
  }));
  state.circles = randomCircles;

  const NUM_BOXES = 5;
  const MIN_BOX_SIZE = 10;
  const MAX_BOX_SIZE = 100;
  const randomBoxes = new Array(NUM_BOXES).fill().map(() => ({
    x: (Math.random() * (canvas.width - BUFFER - BUFFER)) + BUFFER,
    y: (Math.random() * (canvas.height - BUFFER - BUFFER)) + BUFFER,
    halfSize: {
      x: (Math.random() * (MAX_BOX_SIZE - MIN_BOX_SIZE)) + MIN_BOX_SIZE,
      y: (Math.random() * (MAX_BOX_SIZE - MIN_BOX_SIZE)) + MIN_BOX_SIZE
    }
  }));
  state.boxes = randomBoxes;

  requestAnimationFrame(loop);
};
init();
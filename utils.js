// utils.js

// calculate the length of a line segment (pythagorean theorem)
const length = (xLength, yLength) => Math.sqrt(xLength * xLength + yLength * yLength);

// returns negative numbers when inside the circle
const signedDistanceToCircle = (pt, center, radius) =>
  length(center.x - pt.x, center.y - pt.y) - radius;

// returns negative numbers when inside the box
const signedDistanceToBox = (pt, center, halfSize) => {
  const offset = {
    x: Math.abs(pt.x - center.x) - halfSize.x,
    y: Math.abs(pt.y - center.y) - halfSize.y
  }
  const unsignedDst = length(Math.max(offset.x, 0), Math.max(offset.y, 0));
  const dstInsideBox = Math.min(Math.max(offset.x, offset.y), 0);
  return unsignedDst + dstInsideBox;
}


'use strict';

class Cramer {
  constructor(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.x4 = x4;
    this.y4 = y4;
  }

  getA(x1, y1, x2, y2) {
    if (x2 - x1) {
      return (y1 - y2) / (x2 - x1);
    }

    return false;
  };

  getC(x1, y1, x2, y2) {
    if (x2 - x1) {
      return ((y2 - y1) / (x2 - x1)) * x1 - y1;
    }

    return false;
  };

  getDelta() {
    return this.getA(this.x1, this.y1, this.x2, this.y2)
    - this.getA(this.x3, this.y3, this.x4, this.y4);
  }

  getDelta1() {
    return this.getC(this.x1, this.y1, this.x2, this.y2)
    - this.getC(this.x3, this.y3, this.x4, this.y4);
  }

  getDelta2() {
    return this.getA(this.x1, this.y1, this.x2, this.y2)
    * this.getC(this.x3, this.y3, this.x4, this.y4)
    - this.getA(this.x3, this.y3, this.x4, this.y4)
    * this.getC(this.x1, this.y1, this.x2, this.y2);
  }

  getResolve() {
    if (this.getDelta()) {
      return {
        x: (this.getDelta1() / this.getDelta()) * -1,
        y: (this.getDelta2() / this.getDelta()) * -1,
      };
    }

    return false;
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let startXY = {};
let isStart = true;
const coordsAllLines = [];
const allPointsCross = [];
const canvasWidth = 750;
const canvasHeight = 450;

canvas.onclick = (event) => {
  if (isStart) {
    ctx.moveTo(event.offsetX, event.offsetY);

    startXY = {
      x: event.offsetX,
      y: event.offsetY,
    };

    isStart = false;
  } else {
    const endXY = {
      x: event.offsetX,
      y: event.offsetY,
    };

    coordsAllLines.push([startXY, endXY]);
    isStart = true;
    findAllCroosPoints();
    drawPoint();
  }
};

canvas.oncontextmenu = (event) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawLine();
  drawPoint();
  isStart = true;
};

canvas.onmousemove = (event) => {
  const dynamicPoints = [];

  if (!isStart) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.moveTo(startXY.x, startXY.y);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    drawLine();
    drawPoint();

    for (let i = 0; i < coordsAllLines.length; i++) {
      const cramer = new Cramer(
        startXY.x,
        startXY.y,
        event.offsetX,
        event.offsetY,
        coordsAllLines[i][0].x,
        coordsAllLines[i][0].y,
        coordsAllLines[i][1].x,
        coordsAllLines[i][1].y,
      );

      const temp = cramer.getResolve();
     
      if (((temp.x >= coordsAllLines[i][0].x
        && temp.x <= coordsAllLines[i][1].x)
      || (temp.x <= coordsAllLines[i][0].x
        && temp.x >= coordsAllLines[i][1].x))

        && ((temp.x >= startXY.x
          && temp.x <= event.offsetX)
        || (temp.x <= startXY.x
          && temp.x >= event.offsetX))) {
        dynamicPoints.push(temp);
      }
    }

    dynamicPoints.map(point => {
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(point.x, point.y, 3, 0, 360, false);
      ctx.stroke();
      ctx.fill();
    });
  }
};

const drawLine = () => {
  coordsAllLines.map(line => {
    ctx.moveTo(line[0].x, line[0].y);
    ctx.lineTo(line[1].x, line[1].y);
  });

  ctx.stroke();
};

const drawPoint = () => {
  allPointsCross.map(point => {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(point.x, point.y, 3, 0, 360, false);
    ctx.stroke();
    ctx.fill();
  });
};

const findAllCroosPoints = () => {
  if (coordsAllLines.length > 1) {
    for (let i = 0; i < coordsAllLines.length; i++) {
      for (let j = 0; j < coordsAllLines.length; j++) {
        const cramer = new Cramer(
          coordsAllLines[i][0].x,
          coordsAllLines[i][0].y,
          coordsAllLines[i][1].x,
          coordsAllLines[i][1].y,
          coordsAllLines[j][0].x,
          coordsAllLines[j][0].y,
          coordsAllLines[j][1].x,
          coordsAllLines[j][1].y);

        const resolve = cramer.getResolve();

        if (resolve) {
          if (((resolve.x >= coordsAllLines[i][0].x
            && resolve.x <= coordsAllLines[i][1].x)
          || (resolve.x <= coordsAllLines[i][0].x
            && resolve.x >= coordsAllLines[i][1].x))

            && ((resolve.x >= coordsAllLines[j][0].x
              && resolve.x <= coordsAllLines[j][1].x)
            || (resolve.x <= coordsAllLines[j][0].x
              && resolve.x >= coordsAllLines[j][1].x))) {
            allPointsCross.push(resolve);
          }
        }
      }
    }
  }
};

const button = document.getElementById('btn');

const animation = () => {
  const quantity = 200;
  let pct = 0;

  window.requestAnimationFrame(animate);

  function animate() {
    if (++pct > quantity) {
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    coordsAllLines.map(line => {
      const startX = line[0].x;
      const startY = line[0].y;
      const endX = line[1].x;
      const endY = line[1].y;
      const xMiddle = (startX + endX) / 2;
      const yMiddle = (startY + endY) / 2;
      const dx = endX - startX;
      const dy = endY - startY;
      const x = startX + dx * pct / (2 * quantity);
      const y = startY + dy * pct / (2 * quantity);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xMiddle, yMiddle);

      ctx.moveTo(
        endX - dx * pct / (2 * quantity),
        endY - dy * pct / (2 * quantity)
      );
      ctx.lineTo(xMiddle, yMiddle);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(xMiddle, yMiddle, 5, 0, 360, false);
      ctx.fill();
    });

    window.requestAnimationFrame(animate);
  };
};

button.onclick = () => {
  animation();
};

let blob;
const mouseHandler = onMouseMove()

self.onmessage = function(event) {
    switch (event.data.type) {
        case "init": return init(event.data.data);
        case "resize": return onResize(event.data.data);
        case "mousemove": return mouseHandler(event.data.data);
        case "exploded": return console.log("worker explode");
        case "end": return null;
    }
};

function init({ canvasWidth, canvasHeight }) {
  blob = new Blob;
  blob.init();
  onResize({ canvasWidth, canvasHeight })

  initClient();
  run();
}

function run () {
  blob.render(sendUpdate)
  setTimeout(run, 15)
}

function initClient() {
  blob.render((toDraw) => sendUpdate(toDraw, 'init'))
}

function sendUpdate(toDraw, type='tick') {
  postMessage({
    type: type,
    data: {
      toDraw
    }
  })
}

function onResize({ canvasWidth, canvasHeight }) {
  if (blob) blob.center = { x: canvasWidth * blob.position.x, y: canvasHeight * blob.position.y };
}

function onMouseMove () {
  let oldMousePoint = { x: 0, y: 0 };
  let hover = false;

  return function ({mouse}) {
    let pos = blob.center;
    let diff = { x: mouse.x - pos.x, y: mouse.y - pos.y };
    let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    let angle = null;
    
    blob.mousePos = { x: pos.x - mouse.x, y: pos.y - mouse.y };
    
    if(dist < blob.radius && hover === false) {
      let vector = { x: mouse.x - pos.x, y: mouse.y - pos.y };
      angle = Math.atan2(vector.y, vector.x);
      hover = true;
    } else if(dist > blob.radius && hover === true){ 
      let vector = { x: mouse.x - pos.x, y: mouse.y - pos.y };
      angle = Math.atan2(vector.y, vector.x);
      hover = false;
    }
    
    if(typeof angle == 'number') {
      
      let nearestPoint = null;
      let distanceFromPoint = 100;
      
      blob.points.forEach((point)=> {
        if(Math.abs(angle - point.azimuth) < distanceFromPoint) {
          nearestPoint = point;
          distanceFromPoint = Math.abs(angle - point.azimuth);
        }
        
      });
      
      if(nearestPoint) {
        let strength = { x: oldMousePoint.x - mouse.x, y: oldMousePoint.y - mouse.y };
        strength = Math.sqrt((strength.x * strength.x) + (strength.y * strength.y)) * 10;
        if(strength > 100) strength = 100;
        nearestPoint.acceleration = strength / 100 * (hover ? -1 : 1);
      }
    }
    
    oldMousePoint.x = mouse.x;
    oldMousePoint.y = mouse.y;
  }  
}


class Blob {
  constructor() {
    this.points = [];
  }
  
  init () {
    for(let i = 0; i < this.numPoints; i++) {
      let point = new Point(this.divisional * ( i + 1 ), this);
      this.push(point);
    }
  }
  
  render(postUpdateCanvasMessage) {
    let pointsArray = this.points;
    let K = this.numPoints;
    let center = this.center;

    pointsArray[0].solveWith(pointsArray[K-1], pointsArray[1]);

    let p0 = pointsArray[K-1].position;
    let p1 = pointsArray[0].position;
    let _p2 = p1;

    let toDraw = [
      { curve: 'linear', x: center.x, y: center.y },
      { curve: 'linear', x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
    ]

    for(let i = 1; i < K; i++) {
      pointsArray[i].solveWith(pointsArray[i-1], pointsArray[i+1] || pointsArray[0]);
      let p2 = pointsArray[i].position;
      var xc = (p1.x + p2.x) / 2;
      var yc = (p1.y + p2.y) / 2;

      toDraw.push({ curve: 'quadratic', x: p1.x, y: p1.y, xc, yc })

      p1 = p2;
    }

    var xc = (p1.x + _p2.x) / 2;
    var yc = (p1.y + _p2.y) / 2;

    toDraw.push({ curve: 'quadratic', x: p1.x, y: p1.y, xc, yc })

    postUpdateCanvasMessage(toDraw)
  }
  
  push(item) {
    if(item instanceof Point) {
      this.points.push(item);
    }
  }
  
  set color(value) {
    this._color = value;
  }
  get color() {
        return this._color || '#286EEB';
  }
  
  set numPoints(value) {
    if(value > 2) {
      this._points = value;
    }
  }
  get numPoints() {
    return this._points || 32;
  }
  
  set radius(value) {
    if(value > 0) {
      this._radius = value;
    }
  }
  get radius() {
    return this._radius || 300;
  }
  
  set position(value) {
    if(typeof value == 'object' && value.x && value.y) {
      this._position = value;
    }
  }
  get position() {
    return this._position || { x: 0.5, y: 0.5 };
  }
  
  get divisional() {
    return Math.PI * 2 / this.numPoints;
  }
  
  set center(value) {
    if(typeof value == 'object' && value.x && value.y) {
      this._center = value;
    }
  }
  get center() {
    return this._center || { x: 0.5, y: 0.5 };
  }
  
  set running(value) {
    this._running = value === true;
  }
  get running() {
    return this.running !== false;
  }
}

class Point {
  constructor(azimuth, parent) {
    this.parent = parent;
    this.azimuth = Math.PI - azimuth;
    this._components = { 
      x: Math.cos(this.azimuth),
      y: Math.sin(this.azimuth)
    };
    
    this.acceleration = -0.3 + Math.random() * 0.6;
  }
  
  solveWith(leftPoint, rightPoint) {
    this.acceleration = (-0.3 * this.radialEffect + ( leftPoint.radialEffect - this.radialEffect ) + ( rightPoint.radialEffect - this.radialEffect )) * this.elasticity - this.speed * this.friction;
  }
  
  set acceleration(value) {
    if(typeof value == 'number') {
      this._acceleration = value;
      this.speed += this._acceleration * 2;
    }
  }
  get acceleration() {
    return this._acceleration || 0;
  }
  
  set speed(value) {
    if(typeof value == 'number') {
      this._speed = value;
      this.radialEffect += this._speed * 5;
    }
  }
  get speed() {
    return this._speed || 0;
  }
  
  set radialEffect(value) {
    if(typeof value == 'number') {
      this._radialEffect = value;
    }
  }
  get radialEffect() {
    return this._radialEffect || 0;
  }
  
  get position() {
    return { 
      x: this.parent.center.x + this.components.x * (this.parent.radius + this.radialEffect), 
      y: this.parent.center.y + this.components.y * (this.parent.radius + this.radialEffect) 
    }
  }
  
  get components() {
    return this._components;
  }

  set elasticity(value) {
    if(typeof value === 'number') {
      this._elasticity = value;
    }
  }
  get elasticity() {
    return this._elasticity || 0.001;
  }
  set friction(value) {
    if(typeof value === 'number') {
      this._friction = value;
    }
  }
  get friction() {
    return this._friction || 0.0085;
  }
}

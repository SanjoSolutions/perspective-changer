import * as THREE from "three";

const imageInput = document.getElementById("image-input");
let image = null;
const setAxis = document.getElementById("setAxis");
const setOrigin = document.getElementById("setOrigin");
const setXAxis = document.getElementById("setXAxis");
const setYAxis = document.getElementById("setYAxis");
const setZAxis = document.getElementById("setZAxis");
let isSettingOrigin = false;
let isSettingXAxis = false;
let isSettingYAxis = false;
let isSettingZAxis = false;
let origin = null;
let xAxisPoint = null;
let yAxisPoint = null;
let zAxisPoint = null;
const radius = 5

setOrigin.addEventListener("click", () => {
  activateSettingOrigin()
});

function activateSettingOrigin() {
  isSettingOrigin = true;
  isSettingXAxis = false;
  isSettingYAxis = false;
  isSettingZAxis = false;
}

setXAxis.addEventListener("click", () => {
  activateSettingXAxisPoint();
});

function activateSettingXAxisPoint() {
  isSettingOrigin = false;
  isSettingXAxis = true;
  isSettingYAxis = false;
  isSettingZAxis = false;
}

setYAxis.addEventListener("click", () => {
  activateSettingYAxisPoint();
});

function activateSettingYAxisPoint() {
  isSettingOrigin = false;
  isSettingXAxis = false;
  isSettingYAxis = true;
  isSettingZAxis = false;
}

setZAxis.addEventListener("click", () => {
  activateSettingZAxisPoint();
});

function activateSettingZAxisPoint() {
  isSettingOrigin = false;
  isSettingXAxis = false;
  isSettingYAxis = false;
  isSettingZAxis = true;
}

const imageCanvas = document.getElementById("image");
let imageContext = null;

const transformedImageCanvas = document.getElementById("transformedImage");
let transformedImageContext = null;

const transformedImage2Canvas = document.getElementById("transformedImage2");
let transformedImage2Context = null;

const transformedImage3Canvas = document.getElementById("transformedImage3");
let transformedImage3Context = null;

let isPointerDown = false

imageCanvas.addEventListener("pointerdown", (event) => {
  isPointerDown = true
  const position = { x: event.offsetX, y: event.offsetY }
  if (origin && calculateDistance(position, origin) <= Math.max(radius, 48 / 2)) {
    activateSettingOrigin()
  } else if (xAxisPoint && calculateDistance(position, xAxisPoint) <= Math.max(radius, 48 / 2)) {
    activateSettingXAxisPoint()
  } else if (yAxisPoint && calculateDistance(position, yAxisPoint) <= Math.max(radius, 48 / 2)) {
    activateSettingYAxisPoint()
  } else if (zAxisPoint && calculateDistance(position, zAxisPoint) <= Math.max(radius, 48 / 2)) {
    activateSettingZAxisPoint()
  }
  setPoint(event)
});

imageCanvas.addEventListener("pointermove", (event) => {
  if (isPointerDown) {
    setPoint(event)
  }
});

window.addEventListener("pointerup", (event) => {
  isPointerDown = false
});

function setPoint(event) {
  const position = { x: event.offsetX, y: event.offsetY }
  if (isSettingOrigin) {
    origin = position;
    renderImage();
  } else if (isSettingXAxis) {
    xAxisPoint = position;
    renderImage();
  } else if (isSettingYAxis) {
    yAxisPoint = position;
    renderImage();
  } else if (isSettingZAxis) {
    zAxisPoint = position;
    renderImage();
  }

  if (origin && zAxisPoint && xAxisPoint) {
    transformedImageCanvas.width = Math.abs(xAxisPoint.x - origin.x);
    transformedImageCanvas.height = calculateDistance(origin, zAxisPoint);
    transformedImageContext = transformedImageCanvas.getContext("2d");

    let angle = Math.atan2(
      image.height - xAxisPoint.y - (image.height - origin.y),
      xAxisPoint.x - origin.x,
    );
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // b * x + y = y'
    // x = xAxisPoint.x - origin.x
    // y = xAxisPoint.y - origin.y
    // y' = 0
    // b = (y' - y) / x
    const b = (0 - (xAxisPoint.y - origin.y)) / (xAxisPoint.x - origin.x);
    drawTransformed(b);

    imageTexture = new THREE.CanvasTexture(transformedImageCanvas);
    imageTexture.colorSpace = THREE.SRGBColorSpace
  }

  if (origin && zAxisPoint && yAxisPoint) {
    transformedImage2Canvas.width = calculateDistance(origin, yAxisPoint);
    transformedImage2Canvas.height = calculateDistance(origin, zAxisPoint);
    transformedImage2Context = transformedImage2Canvas.getContext("2d");

    let angle = Math.atan2(
      image.height - yAxisPoint.y - (image.height - origin.y),
      yAxisPoint.x - origin.x,
    );
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // b * x + y = y'
    // x = yAxisPoint.x - origin.x
    // y = yAxisPoint.y - origin.y
    // y' = 0
    // b = (y' - y) / x
    const b = (0 - (yAxisPoint.y - origin.y)) / (yAxisPoint.x - origin.x);
    drawTransformed2(b);

    imageTexture2 = new THREE.CanvasTexture(transformedImage2Canvas);
    imageTexture2.colorSpace = THREE.SRGBColorSpace
  }

  if (origin && xAxisPoint && yAxisPoint) {
    transformedImage3Canvas.width = calculateDistance(origin, xAxisPoint);
    transformedImage3Canvas.height = calculateDistance(origin, yAxisPoint);
    transformedImage3Context = transformedImage3Canvas.getContext("2d");

    let angle1 = Math.atan2(
      image.height - xAxisPoint.y - (image.height - origin.y),
      xAxisPoint.x - origin.x,
    );
    if (angle1 < 0) {
      angle1 += 2 * Math.PI;
    }

    let angle2 = Math.atan2(
      image.height - yAxisPoint.y - (image.height - origin.y),
      yAxisPoint.x - origin.x,
    );
    if (angle2 < 0) {
      angle2 += 2 * Math.PI;
    }

    // b * x + y = y'
    // x = yAxisPoint.x - origin.x
    // y = yAxisPoint.y - origin.y
    // y' = 0
    // b = (y' - y) / x
    const b = (0 - (xAxisPoint.y - origin.y)) / (xAxisPoint.x - origin.x);

    // c * y + x = x'
    // y = origin.y - yAxisPoint.y
    // x = origin.x - yAxisPoint.x
    // x' = 0
    // c = (x' - x) / y
    const c = (0 - (origin.x - yAxisPoint.x)) / ( origin.y - yAxisPoint.y);
    drawTransformed3(b, c);

    imageTexture3 = new THREE.CanvasTexture(transformedImage3Canvas);
    imageTexture3.colorSpace = THREE.SRGBColorSpace
  }

  if (origin && xAxisPoint && yAxisPoint && zAxisPoint) {
    updateImageMesh();

    document.querySelector('.preview-and-save').style.display = null
  }
}

function drawTransformed(b) {
  transformedImageContext.clearRect(
    0,
    0,
    transformedImageCanvas.width,
    transformedImageCanvas.height,
  );
  transformedImageContext.save();
  transformedImageContext.setTransform(1, b, 0, 1, 0, 0);
  transformedImageContext.translate(-origin.x, -origin.y);
  transformedImageContext.drawImage(image, 0, 0);
  transformedImageContext.restore();
  transformedImageCanvas.style.display = null
}

function calculateDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function drawTransformed2(b) {
  transformedImage2Context.clearRect(
    0,
    0,
    transformedImage2Canvas.width,
    transformedImage2Canvas.height,
  );
  transformedImage2Context.save();
  transformedImage2Context.setTransform(1, b, 0, 1, 0, 0);
  transformedImage2Context.translate(-yAxisPoint.x, -yAxisPoint.y);
  transformedImage2Context.drawImage(image, 0, 0);
  transformedImage2Context.restore();
  transformedImage2Canvas.style.display = null
}

function drawTransformed3(b, c) {
  transformedImage3Context.clearRect(
    0,
    0,
    transformedImage2Canvas.width,
    transformedImage2Canvas.height,
  );
  transformedImage3Context.save();
  transformedImage3Context.setTransform(1, b, c, 1, 0, 0);
  transformedImage3Context.translate(-yAxisPoint.x, -yAxisPoint.y);
  transformedImage3Context.drawImage(image, 0, 0);
  transformedImage3Context.restore();
  transformedImage3Canvas.style.display = null
}

function renderImage() {
  imageContext.drawImage(image, 0, 0);
  if (origin) {
    if (xAxisPoint) {
      drawLine(origin, xAxisPoint);
    }
    if (yAxisPoint) {
      drawLine(origin, yAxisPoint);
    }
    if (zAxisPoint) {
      drawLine(origin, zAxisPoint);
    }
    if (xAxisPoint && yAxisPoint) {
      const point = {x: xAxisPoint.x + (yAxisPoint.x - origin.x), y: xAxisPoint.y + (yAxisPoint.y - origin.y)}
      drawLine(xAxisPoint, point, 'lightskyblue')
      drawLine(point, yAxisPoint, 'lightskyblue')
    }
    if (xAxisPoint && zAxisPoint) {
      const point = {x: zAxisPoint.x + (xAxisPoint.x - origin.x), y: zAxisPoint.y + (xAxisPoint.y - origin.y)}
      drawLine(zAxisPoint, point, 'lightskyblue')
      drawLine(point, xAxisPoint, 'lightskyblue')
    }
    if (yAxisPoint && zAxisPoint) {
      const point = {x: zAxisPoint.x + (yAxisPoint.x - origin.x), y: zAxisPoint.y + (yAxisPoint.y - origin.y)}
      drawLine(zAxisPoint, point, 'lightskyblue')
      drawLine(point, yAxisPoint, 'lightskyblue')
    }
  }
  if (origin) {
    drawPoint(origin);
  }
  if (xAxisPoint) {
    drawPoint(xAxisPoint);
  }
  if (yAxisPoint) {
    drawPoint(yAxisPoint);
  }
  if (zAxisPoint) {
    drawPoint(zAxisPoint);
  }
}

function drawLine(from, to, color = 'blue') {
  imageContext.save();
  imageContext.lineWidth = 2;
  imageContext.strokeStyle = color;
  imageContext.beginPath();
  imageContext.moveTo(from.x, from.y);
  imageContext.lineTo(to.x, to.y);
  imageContext.stroke();
  imageContext.restore();
}

function drawPoint(point) {
  imageContext.strokeStyle = "black";
  imageContext.fillStyle = "blue";
  imageContext.beginPath();
  imageContext.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  imageContext.fill();
  imageContext.stroke();
}

const threeDCanvas = document.getElementById("threeD");
const saveButton = document.getElementById("save-button");
const renderer = new THREE.WebGLRenderer({ canvas: threeDCanvas, preserveDrawingBuffer: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -2, 2);
window.camera = camera
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const axes = {
  x: { start: null, end: null },
  y: { start: null, end: null },
  z: { start: null, end: null },
};
let imageTexture = null;
let imageTexture2 = null;
let imageTexture3 = null;
let imageMesh = null;

// Load the image and create a texture from it
function loadImage() {
  const file = imageInput.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const image2 = new Image();
    image2.src = event.target.result;
    image2.onload = function () {
      image = image2;
      imageCanvas.width = image.width;
      imageCanvas.height = image.height;
      imageContext = imageCanvas.getContext("2d");
      imageCanvas.style.display = null;
      setAxis.style.display = "block";
      renderImage();
    };
  };
  reader.readAsDataURL(file);

  origin = null
  xAxisPoint = null
  yAxisPoint = null
  zAxisPoint = null
  transformedImageCanvas.style.display = 'none'
  transformedImage2Canvas.style.display = 'none'
  transformedImage3Canvas.style.display = 'none'
  document.querySelector('.preview-and-save').style.display = 'none'
}

// Create a mesh with the image texture
function updateImageMesh() {
  const width = calculateDistance(origin, xAxisPoint);
  const height = calculateDistance(origin, zAxisPoint);
  const depth = calculateDistance(origin, yAxisPoint);

  renderer.setSize(height + depth, height + depth)

  const maxLength = Math.max(width, height, depth);
  const geometry = new THREE.BoxGeometry(
    width / maxLength,
    height / maxLength,
    depth / maxLength,
  );
  const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const materialX = new THREE.MeshBasicMaterial({ map: imageTexture, reflectivity: 0, lightMapIntensity: 0, fog: 0 });
  const materialY = new THREE.MeshBasicMaterial({
    map: imageTexture2,
  });
  const materialTop = new THREE.MeshBasicMaterial({
    map: imageTexture3
  })
  if (imageMesh) {
    scene.remove(imageMesh)
  }
  imageMesh = new THREE.Mesh(geometry, [
    whiteMaterial,
    materialY,
    materialTop,
    whiteMaterial,
    materialX,
    whiteMaterial,
  ]);
  imageMesh.position.set(0, 0, 0);
  imageMesh.rotateX(convertDegreeToRadian(60));

  scene.add(imageMesh);

  renderer.render(scene, camera);

  var boundingSphere = imageMesh.geometry.boundingSphere

  camera.zoom = (camera.right - camera.left) / ( boundingSphere.radius * 2 )

  camera.updateProjectionMatrix()

  renderer.render(scene, camera);
}

function convertDegreeToRadian(value) {
  return value * 360 / (2 * Math.PI);
}

// Handle button clicks
function onSaveButtonClick() {
  const dataUrl = threeDCanvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "render.png";
  link.href = dataUrl;
  link.click();
}

// Add event listeners
imageInput.addEventListener("change", loadImage);
saveButton.addEventListener("click", onSaveButtonClick);

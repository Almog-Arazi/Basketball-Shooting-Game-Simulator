import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x0020);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - standard 28x15 meters, with parquet texture
  const courtWidth = 30;
  const courtLength = 15;
  const parquetTextureUrl = 'https://media.istockphoto.com/id/577965322/photo/hardwood-maple-basketball-court-floor-viewed-from-above.jpg?s=612x612&w=0&k=20&c=bTGbrTkgwj1rkMLQtjG-YUyivXSVfA_pMdw_4EWWLd0=';
  const loader = new THREE.TextureLoader();
  loader.load(parquetTextureUrl, function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1.5);
    texture.anisotropy = 8;
    const courtGeometry = new THREE.BoxGeometry(courtWidth, 0.2, courtLength);
    const courtMaterial = new THREE.MeshPhongMaterial({ 
      map: texture,
      shininess: 50
    });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.receiveShadow = true;
    scene.add(court);
  
    // Court lines - white material for all lines
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
    // Center line
    const centerLineGeometry = new THREE.BoxGeometry(0.1, 0.01, 15);
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.position.y = 0.11; 
    scene.add(centerLine);
  
    // Center circle
    const centerCircleGeometry = new THREE.RingGeometry(1.8, 2, 32);
    const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial);
    centerCircle.rotation.x = degrees_to_radians(-90);
    centerCircle.position.y = 0.11;
    scene.add(centerCircle);
  
    // Paint areas (key)
    const paintGeometry = new THREE.RingGeometry(6, 6.1, 32, 1, -Math.PI/2, Math.PI);
  
    // Left paint area
    const leftPaint = new THREE.Mesh(paintGeometry, lineMaterial);
    leftPaint.rotation.x = degrees_to_radians(-90);
    leftPaint.position.set(-15, 0.11, 0);
    scene.add(leftPaint);
  
    // Right paint area
    const rightPaint = new THREE.Mesh(paintGeometry, lineMaterial);
    rightPaint.rotation.x = degrees_to_radians(-90);
    rightPaint.rotation.z = degrees_to_radians(180);
    rightPaint.position.set(15, 0.11, 0);
    scene.add(rightPaint);
  
    // Three-point lines
    const createThreePointLine = (posX) => {
      // Create the arc part of the three-point line
      const arcRadius = 6.75;
      const arcThickness = 0.1;
      
      // Create points for the arc
      const arcPoints = [];
      const arcSegments = 32;
      
      if (posX < 0) {
        // Left side - arc opens to the right
        for (let i = 0; i <= arcSegments; i++) {
          const theta = (Math.PI / 2) - (i / arcSegments) * Math.PI;
          arcPoints.push(
            new THREE.Vector3(
              posX + arcRadius * Math.cos(theta),
              0.11,
              arcRadius * Math.sin(theta)
            )
          );
        }
      } else {
        // Right side - arc opens to the left
        for (let i = 0; i <= arcSegments; i++) {
          const theta = (Math.PI / 2) + (i / arcSegments) * Math.PI;
          arcPoints.push(
            new THREE.Vector3(
              posX + arcRadius * Math.cos(theta),
              0.11,
              arcRadius * Math.sin(theta)
            )
          );
        }
      }
      
    };
    
    // Add three-point lines on both sides
    createThreePointLine(-14);  // Left side
    createThreePointLine(14);   // Right side
    
    // Sidelines
    const sidelineGeometry = new THREE.BoxGeometry(30, 0.2, 0.05);
    
    // Top sideline
    const topSideline = new THREE.Mesh(sidelineGeometry, lineMaterial);
    topSideline.position.set(0, 0, 7.5);
    scene.add(topSideline);
    
    // Bottom sideline
    const bottomSideline = new THREE.Mesh(sidelineGeometry, lineMaterial);
    bottomSideline.position.set(0, 0, -7.5);
    scene.add(bottomSideline);
    
    // Left and right sidelines
    const endlineGeometry = new THREE.BoxGeometry(0.05, 0.2, 15);
    
    // Left sideline
    const leftSideline = new THREE.Mesh(endlineGeometry, lineMaterial);
    leftSideline.position.set(-15, 0, 0);
    scene.add(leftSideline);
    
    // Right sideline
    const rightSideline = new THREE.Mesh(endlineGeometry, lineMaterial);
    rightSideline.position.set(15, 0, 0);
    scene.add(rightSideline);
    
    // Create basketball hoops
    createBasketballHoop(-16, 0, 'left');  // Left hoop - moved further left
    createBasketballHoop(16, 0, 'right');  // Right hoop - moved further right
  });
}

// Store rim mesh references for glow effect
let leftRimMesh = null;
let rightRimMesh = null;

// Create basketball hoop
function createBasketballHoop(posX, posZ, side) {
  // Backboard - standard 1.8m x 1.05m
  const backboardGeometry = new THREE.BoxGeometry(0.1, 1.05, 1.8);
  const backboardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true,
    opacity: 1,
    shininess: 100
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  // Position backboard at the end of the court (top at 3.65m, bottom at 2.6m)
  backboard.position.set(posX, 3.125, posZ); // 3.125 = (3.65+2.6)/2
  backboard.castShadow = true;
  scene.add(backboard);

  // Target rectangle (inner box)
  const targetInteriorGeometry = new THREE.BoxGeometry(0.11, 0.45, 0.59); // 0.59x0.45m
  const targetInteriorMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    shininess: 10
  });
  const targetInterior = new THREE.Mesh(targetInteriorGeometry, targetInteriorMaterial);
  targetInterior.position.set(posX + (side === 'left' ? 0.06 : -0.06), 3.05, posZ); // Centered at rim height
  scene.add(targetInterior);

  // Black border frame for target
  const borderThickness = 0.05;
  const createBorder = (offsetY, offsetZ, width, height) => {
    const borderGeometry = new THREE.BoxGeometry(0.01, height, width);
    const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 10 });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(posX + (side === 'left' ? 0.07 : -0.07), 3.05 + offsetY, posZ + offsetZ);
    border.castShadow = true;
    scene.add(border);
  };
  // Top border
  createBorder(0.225, 0, 0.59, borderThickness);
  // Bottom border
  createBorder(-0.225, 0, 0.59, borderThickness);
  // Left border
  createBorder(0, 0.295, borderThickness, 0.45);
  // Right border
  createBorder(0, -0.295, borderThickness, 0.45);

  // Rim - always in front of the backboard, above the net
  const rimDistance = 0.1 / 2 + 0.225 + 0.01; // חצי עובי הקרש + רדיוס הטבעת + מרווח קטן
  const rimHeight = 2.825; // כמו קודם
  const rimGeometry = new THREE.TorusGeometry(0.225, 0.018, 16, 32);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500, shininess: 100 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  if (side === 'left') {
    rim.position.set(posX + rimDistance, rimHeight, posZ);
    rim.rotation.x = degrees_to_radians(90);
    leftRimMesh = rim;
  } else {
    rim.position.set(posX - rimDistance, rimHeight, posZ);
    rim.rotation.x = degrees_to_radians(90);
    rightRimMesh = rim;
  }
  rim.castShadow = true;
  scene.add(rim);

  // Net
  const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const netPoints = [];
  const netSegments = 16;
  const netHeight = 0.45; // גובה רשת סטנדרטי
  const topRadius = 0.225;
  const bottomRadius = 0.12;
  for (let i = 0; i <= netSegments; i++) {
    const angle = (i / netSegments) * Math.PI * 2;
    netPoints.push({
      x: Math.cos(angle) * topRadius,
      y: 0,
      z: Math.sin(angle) * topRadius
    });
    netPoints.push({
      x: Math.cos(angle) * bottomRadius,
      y: -netHeight,
      z: Math.sin(angle) * bottomRadius
    });
  }
  for (let i = 0; i <= netSegments; i++) {
    const verticalGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(netPoints[i*2].x, netPoints[i*2].y, netPoints[i*2].z),
      new THREE.Vector3(netPoints[i*2+1].x, netPoints[i*2+1].y, netPoints[i*2+1].z)
    ]);
    const verticalLine = new THREE.Line(verticalGeometry, netMaterial);
    if (side === 'left') {
      verticalLine.position.set(posX + rimDistance, rimHeight, posZ);
    } else {
      verticalLine.position.set(posX - rimDistance, rimHeight, posZ);
    }
    scene.add(verticalLine);
  }
  for (let level = 0; level < netSegments; level++) {
    const levelY = -(level / netSegments) * netHeight;
    const levelRadius = topRadius - (level / netSegments) * (topRadius - bottomRadius);
    for (let i = 0; i < netSegments; i++) {
      const angle1 = (i / netSegments) * Math.PI * 2;
      const angle2 = ((i + 1) / netSegments) * Math.PI * 2;
      const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle1) * levelRadius, levelY, Math.sin(angle1) * levelRadius),
        new THREE.Vector3(Math.cos(angle2) * levelRadius, levelY, Math.sin(angle2) * levelRadius)
      ]);
      const horizontalLine = new THREE.Line(horizontalGeometry, netMaterial);
      if (side === 'left') {
        horizontalLine.position.set(posX + rimDistance, rimHeight, posZ);
      } else {
        horizontalLine.position.set(posX - rimDistance, rimHeight, posZ);
      }
      scene.add(horizontalLine);
    }
  }

  // Support structure (pole and arms)
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 30 });
  // Main pole - taller, connects to top of backboard
  const poleHeight = 3.65; 
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, poleHeight, 16);
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  if (side === 'left') {
    pole.position.set(posX - 0.7, poleHeight / 2, posZ);
  } else {
    pole.position.set(posX + 0.7, poleHeight / 2, posZ);
  }
  pole.castShadow = true;
  scene.add(pole);

  // Add a round, professional base under the pole (blue and yellow)
  const baseRadius = 0.7;
  const baseHeight = 0.15;
  const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 48);
  const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 60 }); // כחול כהה
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  if (side === 'left') {
    base.position.set(posX - 0.7, baseHeight / 2, posZ);
  } else {
    base.position.set(posX + 0.7, baseHeight / 2, posZ);
  }
  base.receiveShadow = true;
  base.castShadow = true;
  scene.add(base);

  // Add a beveled top for the base (yellow)
  const bevelRadius = 0.5;
  const bevelHeight = 0.05;
  const bevelGeometry = new THREE.CylinderGeometry(bevelRadius, bevelRadius, bevelHeight, 48);
  const bevelMaterial = new THREE.MeshPhongMaterial({ color: 0xffeb3b, shininess: 80 }); // צהוב
  const bevel = new THREE.Mesh(bevelGeometry, bevelMaterial);
  if (side === 'left') {
    bevel.position.set(posX - 0.7, baseHeight + bevelHeight / 2, posZ);
  } else {
    bevel.position.set(posX + 0.7, baseHeight + bevelHeight / 2, posZ);
  }
  bevel.receiveShadow = true;
  bevel.castShadow = true;
  scene.add(bevel);

  // Support arm - adjust to new pole height and rim position
  const armGeometry = new THREE.BoxGeometry(0.55, 0.08, 0.08);
  const arm = new THREE.Mesh(armGeometry, poleMaterial);
  if (side === 'left') {
    arm.position.set(posX - 0.425, 3.4, posZ);
  } else {
    arm.position.set(posX + 0.425, 3.4, posZ);
  }
  arm.castShadow = true;
  scene.add(arm);
}

// Create a realistic basketball
function createBasketball() {
    // Standard basketball radius
    const radius = 0.12;
    const widthSegments = 32;
    const heightSegments = 16;
    const ballGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const ballMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe95800,  // Orange basketball color
        shininess: 15,
        specular: 0x111111,
        bumpScale: 0.01
    });
    const basketball = new THREE.Mesh(ballGeometry, ballMaterial);
    basketball.castShadow = true;
    basketball.receiveShadow = true;
    basketball.position.set(0, 0.5, 0);
    addBasketballSeams(basketball, radius);
    scene.add(basketball);
    return basketball;
}

// Add seams to the basketball
function addBasketballSeams(basketball, radius) {
    // Create seams geometry and material
    const seamMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.5,
        metalness: 0.2
    });
    
    // Create the main seams
    const seams = [];
    
    // Horizontal seam
    seams.push(createSeam(radius, 0, 0));
    
    // Vertical seams (create 2 perpendicular to each other)
    seams.push(createSeam(radius, Math.PI/2, 0));
    seams.push(createSeam(radius, 0, Math.PI/2));
    
    // Add diagonal seams for more realism
    seams.push(createSeam(radius, Math.PI/4, Math.PI/4));
    seams.push(createSeam(radius, -Math.PI/4, Math.PI/4));
    
    // Add all seams to the basketball
    seams.forEach(seam => {
        seam.material = seamMaterial;
        basketball.add(seam);
    });
}

// Helper function to create a seam
function createSeam(radius, rotationX, rotationZ) {
    // Create a thinner torus for the seam
    const seamRadius = radius * 1.001; // Slightly larger than the ball
    const tubeRadius = 0.008; 
    const seamGeometry = new THREE.TorusGeometry(seamRadius, tubeRadius, 8, 64);
    const seam = new THREE.Mesh(seamGeometry);
    seam.rotation.x = rotationX;
    seam.rotation.z = rotationZ;
    return seam;
}

// Create all elements
let basketball; // Make basketball global
function setupScene() {
  createBasketballCourt();
  basketball = createBasketball();
}
setupScene();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '32px';
instructionsElement.style.left = '32px';
instructionsElement.style.background = 'linear-gradient(135deg, rgba(10,20,40,0.98) 50%, rgba(0,70,160,0.92) 100%)';
instructionsElement.style.color = '#fff';
instructionsElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
instructionsElement.style.fontSize = '18px';
instructionsElement.style.textAlign = 'left';
instructionsElement.style.padding = '14px 32px 14px 24px';
instructionsElement.style.borderRadius = '20px';
instructionsElement.style.boxShadow = '0 6px 32px #00aaff55, 0 2px 12px #000a';
instructionsElement.style.border = '2.5px solid #00aaff';
instructionsElement.style.letterSpacing = '0.5px';
instructionsElement.style.userSelect = 'none';
instructionsElement.innerHTML = `
  <h3 style="margin:0 0 5px 0; font-size:16px;">Controls:</h3>
  <ul style="margin:0 0 0 16px; padding:0; list-style:disc;">
    <li>Arrow keys – Move the ball on the court</li>
    <li>W/S – Change shot power</li>
    <li>Spacebar – Shoot</li>
    <li>O – Toggle free camera control</li>
    <li>R – Reset ball to center court</li>
  </ul>
`;
document.body.appendChild(instructionsElement);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Shot power system
let shotPower = 50; // percent, default 50
const minPower = 0;
const maxPower = 100;

function updatePowerUI() {
  let powerBar = document.getElementById('power-bar');
  let powerText = document.getElementById('power-text');
  if (!powerBar) {
    // Create power bar UI if not present
    const powerContainer = document.createElement('div');
    powerContainer.id = 'power-container';
    powerContainer.style.position = 'absolute';
    powerContainer.style.bottom = '40px';
    powerContainer.style.left = '50%';
    powerContainer.style.transform = 'translateX(-50%)';
    powerContainer.style.background = 'linear-gradient(135deg, rgba(10,20,40,0.98) 50%, rgba(0,70,160,0.92) 100%)';
    powerContainer.style.padding = '12px 36px';
    powerContainer.style.borderRadius = '18px';
    powerContainer.style.color = '#fff';
    powerContainer.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    powerContainer.style.fontSize = '20px';
    powerContainer.style.textAlign = 'center';
    powerContainer.style.boxShadow = '0 6px 32px #00aaff55, 0 2px 12px #000a';
    powerContainer.style.border = '2.5px solid #00aaff';
    powerContainer.style.userSelect = 'none';
    powerContainer.innerHTML = `
      <div style="margin-bottom:4px; font-size:18px; letter-spacing:0.5px;">Shot Power</div>
      <div id="power-bar-bg" style="width: 220px; height: 22px; background: #222b; border-radius: 10px; display: inline-block; border: 1.5px solid #00aaff; box-shadow: 0 2px 8px #00aaff44;">
        <div id="power-bar" style="height: 22px; background: linear-gradient(90deg, #00aaff, #4caf50, #ffeb3b, #f44336); border-radius: 10px; width: 50%; transition: width 0.2s;"></div>
      </div>
      <div id="power-text" style="margin-top: 2px; font-size:18px;">50%</div>
    `;
    document.body.appendChild(powerContainer);
    powerBar = document.getElementById('power-bar');
    powerText = document.getElementById('power-text');
  }
  // Update bar width and text
  powerBar.style.width = `${shotPower}%`;
  powerText.textContent = `${shotPower}%`;
}

updatePowerUI();

// --- PHYSICS & SHOOTING SYSTEM ---
let ballVelocity = new THREE.Vector3(0, 0, 0);
let ballInFlight = false;
const gravity = -9.8; // m/s^2 (scaled)
const timeStep = 1 / 60; // 60 FPS
const ballRadius = 0.12;
const courtTopY = 0.1; // top of the wooden court
const groundY = courtTopY + ballRadius; // 0.22
const readyY = courtTopY + ballRadius + 0.48; // 0.7, so ball is above court when ready to shoot

// Bounce parameters
const groundRestitution = 0.65; // energy loss on ground bounce
const rimRestitution = 0.5; // energy loss on rim bounce
const minBounceVelocity = 1.2; // below this, stop bouncing

// Rim parameters (match createBasketballHoop)
const rimRadius = 0.225;
const rimThickness = 0.018;
const rimDistance = 0.1 / 2 + 0.225 + 0.01; // same as in createBasketballHoop
const leftRim = new THREE.Vector3(-16 + rimDistance, 2.825, 0);
const rightRim = new THREE.Vector3(16 - rimDistance, 2.825, 0);

// Hoop positions (match createBasketballHoop)
const leftHoop = new THREE.Vector3(-16, 2.825, 0);
const rightHoop = new THREE.Vector3(16, 2.825, 0);

// --- Shot Guide Line ---
let shotGuideLine = null;
function updateShotGuide() {
  if (!basketball || ballInFlight) {
    if (shotGuideLine) {
      scene.remove(shotGuideLine);
      shotGuideLine = null;
    }
    return;
  }
  const ballPos = basketball.position.clone();
  ballPos.y = readyY;
  const rimTarget = getNearestRim(ballPos);
  const offsetX = 0.0, offsetY = 0.0, offsetZ = 0.0;
  const target = rimTarget.clone();
  target.x += offsetX;
  target.y += offsetY;
  target.z += offsetZ;
  const dir = new THREE.Vector3(target.x - ballPos.x, 0, target.z - ballPos.z);
  const dist = dir.length();
  dir.normalize();
  const minV = 7.5, maxV = 18;
  const v = minV + (maxV - minV) * (shotPower / 100);
  const g = -gravity;
  const h0 = ballPos.y;
  const h1 = target.y;
  const dx = dist;
  let angleRad;
  let canShoot = true;
  const v2 = v * v;
  const root = v2 * v2 - g * (g * dx * dx + 2 * (h1 - h0) * v2);
  if (root < 0) {
    canShoot = false;
    angleRad = Math.PI / 4; // fallback
  } else {
    angleRad = Math.atan((v2 + Math.sqrt(root)) / (g * dx));
  }
  const vx = v * Math.cos(angleRad) * dir.x;
  const vz = v * Math.cos(angleRad) * dir.z;
  const vy = v * Math.sin(angleRad);
  let t_total = (vx !== 0 || vz !== 0) ? dx / (v * Math.cos(angleRad)) : 1;
  const points = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * t_total;
    const x = ballPos.x + vx * t;
    const z = ballPos.z + vz * t;
    const y = ballPos.y + vy * t + 0.5 * gravity * t * t;
    if (y < groundY) break;
    points.push(new THREE.Vector3(x, y, z));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  if (shotGuideLine) scene.remove(shotGuideLine);
  shotGuideLine = new THREE.Line(
    geometry,
    new THREE.LineDashedMaterial({ color: 0x00ffcc, dashSize: 0.5, gapSize: 0.2, linewidth: 2 })
  );
  shotGuideLine.computeLineDistances();
  scene.add(shotGuideLine);
}

function getNearestRim(pos) {
  return (pos.x < 0) ? leftRim : rightRim;
}

// --- SCORING SYSTEM ---
let score = 0;
let shotsAttempted = 0;
let shotsMade = 0;
let lastShotSuccess = null; // true/false/null
let feedbackTimeout = null;
let scoredThisFlight = false;

function updateScoreUI() {
  let scoreBox = document.getElementById('score-box');
  if (!scoreBox) {
    scoreBox = document.createElement('div');
    scoreBox.id = 'score-box';
    scoreBox.style.position = 'absolute';
    scoreBox.style.top = '32px';
    scoreBox.style.right = '32px';
    scoreBox.style.background = 'linear-gradient(135deg, rgba(10,20,40,0.98) 50%, rgba(0,70,160,0.92) 100%)';
    scoreBox.style.color = '#fff';
    scoreBox.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    scoreBox.style.fontSize = '22px';
    scoreBox.style.padding = '18px 36px 18px 28px';
    scoreBox.style.borderRadius = '22px';
    scoreBox.style.textAlign = 'center';
    scoreBox.style.zIndex = 1000;
    scoreBox.style.boxShadow = '0 6px 32px #00aaff55, 0 2px 12px #000a';
    scoreBox.style.border = '2.5px solid #00aaff';
    scoreBox.style.letterSpacing = '0.5px';
    scoreBox.style.userSelect = 'none';
    // Always set the required innerHTML structure
    scoreBox.innerHTML = `
      <div id="score-main"></div>
      <div id="score-stats"></div>
      <div id="score-feedback" style="margin-top:8px;font-size:22px;font-weight:bold;"></div>
    `;
    document.body.appendChild(scoreBox);
  }
  document.getElementById('score-main').textContent = `Score: ${score}`;
  document.getElementById('score-stats').textContent = `Shots: ${shotsMade}/${shotsAttempted} | Accuracy: ${shotsAttempted ? ((shotsMade/shotsAttempted)*100).toFixed(0) : 0}%`;
  // Feedback
  const feedback = document.getElementById('score-feedback');
  if (lastShotSuccess === true) {
    feedback.textContent = 'Great Shot!';
    feedback.style.color = '#fff';
    feedback.style.background = '#1fc900';
    feedback.style.fontSize = '40px';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '14px 36px';
    feedback.style.borderRadius = '20px';
    feedback.style.boxShadow = '0 4px 24px #1fc900cc, 0 2px 8px #0008';
    feedback.style.textShadow = '0 2px 8px #0008, 0 0 16px #1fc900';
    feedback.style.transition = 'all 0.2s';
  } else if (lastShotSuccess === false) {
    feedback.textContent = 'MISS';
    feedback.style.color = '#f44336';
    feedback.style.background = 'none';
    feedback.style.fontSize = '26px';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '0';
    feedback.style.borderRadius = '0';
    feedback.style.boxShadow = 'none';
    feedback.style.textShadow = '0 2px 8px #0008';
    feedback.style.transition = 'all 0.2s';
  } else {
    feedback.textContent = '';
    feedback.style.background = 'none';
    feedback.style.color = '';
    feedback.style.fontSize = '';
    feedback.style.fontWeight = '';
    feedback.style.padding = '';
    feedback.style.borderRadius = '';
    feedback.style.boxShadow = '';
    feedback.style.textShadow = '';
    feedback.style.transition = '';
  }
}
updateScoreUI();

// Preload net sound effect only after first interaction
let netSound = null;
let netSoundLoaded = false;
function loadNetSound() {
  if (!netSoundLoaded) {
    netSound = new Audio('src/mixkit-basketball-ball-hitting-the-net-2084.wav');
    netSound.volume = 1.0;
    netSoundLoaded = true;
  }
}

// Bonus sound effect for made basket
let bonusTimeout = null;
function playBonusSound() {
  const bonus = new Audio('src/mixkit-arcade-bonus-229.wav');
  bonus.volume = 1.0;
  bonus.play();
}

// Helper to glow the rim
function glowRim(rimMesh) {
  if (!rimMesh) return;
  const origEmissive = rimMesh.material.emissive ? rimMesh.material.emissive.clone() : new THREE.Color(0x000000);
  const origIntensity = rimMesh.material.emissiveIntensity || 0;
  const origScale = rimMesh.scale.clone();
  if (!rimMesh.material.emissive) rimMesh.material.emissive = new THREE.Color(0x00aaff);
  rimMesh.material.emissive.set(0x00aaff); 
  rimMesh.material.emissiveIntensity = 5.0;
  
  let pulse = 0;
  const pulseSteps = 10;
  const pulseInterval = 30; // ms
  function doPulse() {
    if (pulse < pulseSteps) {
      const scale = 1.0 + 0.35 * Math.sin((pulse / pulseSteps) * Math.PI); // up to 1.35x
      rimMesh.scale.set(origScale.x * scale, origScale.y * scale, origScale.z * scale);
      pulse++;
      setTimeout(doPulse, pulseInterval);
    } else {
      rimMesh.scale.copy(origScale);
    }
  }
  doPulse();
  setTimeout(() => {
    rimMesh.material.emissive.copy(origEmissive);
    rimMesh.material.emissiveIntensity = origIntensity;
    rimMesh.scale.copy(origScale);
  }, 800);
}

// High score and best streak
let highScore = parseInt(localStorage.getItem('highScore') || '0', 10);
let bestStreak = parseInt(localStorage.getItem('bestStreak') || '0', 10);
let currentStreak = 0;

function updateHighScoreUI() {
  let highScoreBox = document.getElementById('high-score-box');
  if (!highScoreBox) {
    highScoreBox = document.createElement('div');
    highScoreBox.id = 'high-score-box';
    highScoreBox.style.position = 'absolute';
    highScoreBox.style.top = '32px';
    highScoreBox.style.left = '32px';
    highScoreBox.style.background = 'linear-gradient(135deg, rgba(10,20,40,0.98) 50%, rgba(0,70,160,0.92) 100%)';

    highScoreBox.style.color = '#fff';
    highScoreBox.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    highScoreBox.style.fontSize = '20px';
    highScoreBox.style.padding = '14px 32px 14px 24px';
    highScoreBox.style.borderRadius = '20px';
    highScoreBox.style.textAlign = 'center';
    highScoreBox.style.zIndex = 1000;
    highScoreBox.style.boxShadow = '0 6px 32px #00aaff55, 0 2px 12px #000a';
    highScoreBox.style.border = '2.5px solid #00aaff';
    highScoreBox.style.letterSpacing = '0.5px';
    highScoreBox.style.userSelect = 'none';
    document.body.appendChild(highScoreBox);
  }
  highScoreBox.textContent = `High Score: ${highScore} | Best Streak: ${bestStreak}`;
}
updateHighScoreUI();

function showFeedback(success) {
  lastShotSuccess = success;
  updateScoreUI();
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  if (bonusTimeout) { clearTimeout(bonusTimeout); bonusTimeout = null; }
  const feedback = document.getElementById('score-feedback');
  if (success) {
    currentStreak++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      localStorage.setItem('bestStreak', bestStreak);
    }
    updateHighScoreUI();
    loadNetSound();
    if (netSound) {
      netSound.currentTime = 0;
      netSound.play();
    }
    // Play bonus sound after 1 second
    bonusTimeout = setTimeout(playBonusSound, 1000);
    // Visual rim glow
    const ballX = basketball.position.x;
    if (ballX < 0) {
      glowRim(leftRimMesh);
    } else {
      glowRim(rightRimMesh);
    }
    feedback.textContent = 'סל!';
    feedback.style.color = '#fff';
    feedback.style.background = '#1fc900';
    feedback.style.fontSize = '40px';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '14px 36px';
    feedback.style.borderRadius = '20px';
    feedback.style.boxShadow = '0 4px 24px #1fc900cc, 0 2px 8px #0008';
    feedback.style.textShadow = '0 2px 8px #0008, 0 0 16px #1fc900';
    feedback.style.transition = 'all 0.2s';
  } else {
    currentStreak = 0;
    updateHighScoreUI();
    feedback.textContent = 'MISS';
    feedback.style.color = '#f44336';
    feedback.style.background = 'none';
    feedback.style.fontSize = '26px';
    feedback.style.fontWeight = 'bold';
    feedback.style.padding = '0';
    feedback.style.borderRadius = '0';
    feedback.style.boxShadow = 'none';
    feedback.style.textShadow = '0 2px 8px #0008';
    feedback.style.transition = 'all 0.2s';
  }
  feedbackTimeout = setTimeout(() => {
    lastShotSuccess = null;
    updateScoreUI();
    if (bonusTimeout) { clearTimeout(bonusTimeout); bonusTimeout = null; }
  }, 1500);
}

// --- SHOT DETECTION ---
function detectScore(ball, rim) {
  // Check if the ball crossed the rim plane from above to below, within the rim XZ radius, and is moving down
  if (typeof ball.prevY !== 'number') return false;
  const ballXZ = new THREE.Vector2(ball.position.x, ball.position.z);
  const rimXZ = new THREE.Vector2(rim.x, rim.z);
  const distXZ = ballXZ.distanceTo(rimXZ);
  const withinRim = distXZ < rimRadius * 0.98;
  const crossedPlane = ball.prevY > rim.y && ball.position.y <= rim.y - 0.05;
  const vy = ballVelocity.y;
  if (withinRim && crossedPlane && vy < 0) {
    return true;
  }
  return false;
}

// Add prevY to basketball for shot detection
if (basketball) basketball.prevY = basketball.position.y;

function shootBall() {
  if (ballInFlight || !basketball) return;
  shotsAttempted++;
  updateScoreUI();
  scoredThisFlight = false; // Reset at start of each shot
  const ballPos = basketball.position.clone();
  ballPos.y = readyY;
  basketball.position.y = readyY;
  const rimTarget = getNearestRim(ballPos);
  const offsetX = 0.0, offsetY = 0.0, offsetZ = 0.0;
  const target = rimTarget.clone();
  target.x += offsetX;
  target.y += offsetY;
  target.z += offsetZ;
  const dir = new THREE.Vector3(target.x - ballPos.x, 0, target.z - ballPos.z);
  const dist = dir.length();
  dir.normalize();
  const minV = 7.5, maxV = 18;
  const v = minV + (maxV - minV) * (shotPower / 100);
  const g = -gravity;
  const h0 = ballPos.y;
  const h1 = target.y;
  const dx = dist;
  let angleRad;
  let canShoot = true;
  const v2 = v * v;
  const root = v2 * v2 - g * (g * dx * dx + 2 * (h1 - h0) * v2);
  if (root < 0) {
    canShoot = false;
    angleRad = Math.PI / 4; // fallback
  } else {
    angleRad = Math.atan((v2 + Math.sqrt(root)) / (g * dx));
  }
  const vx = v * Math.cos(angleRad) * dir.x;
  const vz = v * Math.cos(angleRad) * dir.z;
  const vy = v * Math.sin(angleRad);
  ballVelocity.set(vx, vy, vz);
  ballInFlight = true;
  updateShotGuide();
}

// Court dimensions (match createBasketballCourt)
const courtWidth = 30;
const courtLength = 15;
const minX = -courtWidth / 2 + 0.12; // add ball radius
const maxX = courtWidth / 2 - 0.12;
const minZ = -courtLength / 2 + 0.12;
const maxZ = courtLength / 2 - 0.12;

// Background music setup
let bgMusic = null;
let bgMusicStarted = false;
function startBgMusic() {
  if (!bgMusicStarted) {
    bgMusic = new Audio('src/(HQ-Audio) שיר האליפות - המנון של מכבי תל אביב בכדורסל - ג\'קי אלקיים 1977.mp3');
    bgMusic.volume = 0.10;
    bgMusic.loop = true;
    bgMusic.play();
    bgMusicStarted = true;
  }
}

// Handle key events
function handleKeyDown(e) {
  startBgMusic();
  console.log('KeyDown event:', e.code, e.key);
  // Use event.code for robust key detection
  let handled = false;
  if (e.code === "KeyO") {
    isOrbitEnabled = !isOrbitEnabled;
    handled = true;
  } else if (basketball) {
    // Movement step size
    const moveStep = 0.3;
    let moved = false;
    switch (e.code) {
      case "ArrowLeft": // Move left
        basketball.position.x = Math.max(minX, basketball.position.x - moveStep);
        moved = true;
        handled = true;
        break;
      case "ArrowRight": // Move right
        basketball.position.x = Math.min(maxX, basketball.position.x + moveStep);
        moved = true;
        handled = true;
        break;
      case "ArrowUp": // Move forward (decrease z)
        basketball.position.z = Math.max(minZ, basketball.position.z - moveStep);
        moved = true;
        handled = true;
        break;
      case "ArrowDown": // Move backward (increase z)
        basketball.position.z = Math.min(maxZ, basketball.position.z + moveStep);
        moved = true;
        handled = true;
        break;
      case "KeyW": // Increase shot power
        shotPower = Math.min(maxPower, shotPower + 5);
        updatePowerUI();
        updateShotGuide(); // Always update guide after W/S
        handled = true;
        break;
      case "KeyS": // Decrease shot power
        shotPower = Math.max(minPower, shotPower - 5);
        updatePowerUI();
        updateShotGuide(); // Always update guide after W/S
        handled = true;
        break;
      case "Space": // Shoot (main case)
        console.log('Spacebar pressed (code)');
        shootBall();
        handled = true;
        break;
      case "KeyR": // Reset ball to center
        ballInFlight = false;
        ballVelocity.set(0, 0, 0);
        basketball.position.set(0, readyY, 0);
        currentStreak = 0;
        updateHighScoreUI();
        updateShotGuide();
        handled = true;
        break;
    }
    // Fallback for browsers where e.key is ' '
    if (!handled && e.key === ' ') {
      console.log('Spacebar pressed (key fallback)');
      shootBall();
      handled = true;
    }
    if (moved) {
      if (!ballInFlight) basketball.position.y = readyY;
      updateShotGuide();
    }
  }
  if (handled) e.preventDefault();
}
window.addEventListener('keydown', handleKeyDown, false);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  // --- Ball physics update ---
  if (ballInFlight && basketball) {
    // Save previous position for rotation calculation
    const prevPos = basketball.position.clone();
    // --- update prevY for robust score detection ---
    basketball.prevY = basketball.position.y;
    // Update position
    basketball.position.x += ballVelocity.x * timeStep;
    basketball.position.y += ballVelocity.y * timeStep;
    basketball.position.z += ballVelocity.z * timeStep;
    // Update vertical velocity (gravity)
    ballVelocity.y += gravity * timeStep;

    // --- Ball rotation animation ---
    // Only rotate if ball is moving
    const velocity = ballVelocity.clone();
    const speed = velocity.length();
    if (speed > 0.01) {
      // Calculate movement direction (ignore y for rolling on ground, use full for flight)
      const moveDir = velocity.clone().normalize();
      // Axis of rotation: perpendicular to movement (right-hand rule, for a sphere use axis = dir x up)
      // For ground: axis = dir x (0,1,0); for flight: axis = dir x (0,0,1) or similar
      // We'll use axis = dir x (0,1,0) for a rolling effect
      const up = new THREE.Vector3(0, 1, 0);
      const axis = new THREE.Vector3().crossVectors(moveDir, up).normalize();
      // Distance moved this frame
      const dist = speed * timeStep;
      // For a sphere, angle = dist / radius
      const angle = dist / ballRadius;
      basketball.rotateOnWorldAxis(axis, angle);
    }

    // --- Rim collision detection ---
    // Check both rims
    [leftHoop, rightHoop].forEach((rimCenter) => {
      // Rim is a torus in XZ plane at rimCenter.y
      const ballXZ = new THREE.Vector2(basketball.position.x, basketball.position.z);
      const rimXZ = new THREE.Vector2(rimCenter.x, rimCenter.z);
      const distXZ = ballXZ.distanceTo(rimXZ);
      const yDist = Math.abs(basketball.position.y - rimCenter.y);
      // Only check rim collision if ball is at or below rim height (plus a small margin)
      // Fine-tuned: ball visually touches rim
      if (
        basketball.position.y <= rimCenter.y + rimThickness &&
        yDist < ballRadius + rimThickness &&
        Math.abs(distXZ - rimRadius) < ballRadius * 0.95 + rimThickness * 0.8
      ) {
        // Reflect velocity in XZ plane away from rim
        const away = new THREE.Vector2(ballXZ.x - rimXZ.x, ballXZ.y - rimXZ.y).normalize();
        // Project ballVelocity to XZ
        const vXZ = new THREE.Vector2(ballVelocity.x, ballVelocity.z);
        const dot = vXZ.dot(away);
        if (dot < 0) { // Only if moving toward rim
          // Reflect
          const vRef = vXZ.clone().sub(away.clone().multiplyScalar(2 * dot));
          ballVelocity.x = vRef.x * rimRestitution;
          ballVelocity.z = vRef.y * rimRestitution;
          ballVelocity.y *= rimRestitution;
          // Move ball just outside rim to prevent sticking
          const newXZ = rimXZ.clone().add(away.multiplyScalar(rimRadius + ballRadius + rimThickness));
          basketball.position.x = newXZ.x;
          basketball.position.z = newXZ.y;
        }
      }
    });

    // --- Wall collision ---
    // Allow ball to cross court boundaries near the baskets, but not at the arena walls
    const underBasketZone = 2.5; // meters from each basket where crossing is allowed
    // Left wall (only block if not near left basket)
    if (basketball.position.x < minX && Math.abs(basketball.position.x + 16) > underBasketZone) {
      basketball.position.x = minX;
      if (ballVelocity.x < 0) ballVelocity.x = -ballVelocity.x * 0.7;
      ballVelocity.z *= 0.85;
    }
    // Right wall (only block if not near right basket)
    if (basketball.position.x > maxX && Math.abs(basketball.position.x - 16) > underBasketZone) {
      basketball.position.x = maxX;
      if (ballVelocity.x > 0) ballVelocity.x = -ballVelocity.x * 0.7;
      ballVelocity.z *= 0.85;
    }
    // Top/bottom walls (always block)
    if (basketball.position.z < minZ) {
      basketball.position.z = minZ;
      if (ballVelocity.z < 0) ballVelocity.z = -ballVelocity.z * 0.7;
      ballVelocity.x *= 0.85;
    }
    if (basketball.position.z > maxZ) {
      basketball.position.z = maxZ;
      if (ballVelocity.z > 0) ballVelocity.z = -ballVelocity.z * 0.7;
      ballVelocity.x *= 0.85;
    }

    // --- Backboard collision ---
    // Only check if ball is behind the backboard and not above the rim
    // Fine-tuned: ball visually touches backboard
    // Left backboard
    if (
      basketball.position.x < -16 + ballRadius * 0.95 &&
      basketball.position.x > -16 - 0.2 &&
      basketball.position.y > 2.6 && basketball.position.y < 3.65 &&
      Math.abs(basketball.position.z) < 1.8 / 2 &&
      basketball.position.y <= leftHoop.y + rimThickness
    ) {
      basketball.position.x = -16 + ballRadius * 0.95;
      if (ballVelocity.x < 0) ballVelocity.x = -ballVelocity.x * 0.6;
      ballVelocity.y *= 0.85;
      ballVelocity.z *= 0.85;
    }
    // Right backboard
    if (
      basketball.position.x > 16 - ballRadius * 0.95 &&
      basketball.position.x < 16 + 0.2 &&
      basketball.position.y > 2.6 && basketball.position.y < 3.65 &&
      Math.abs(basketball.position.z) < 1.8 / 2 &&
      basketball.position.y <= rightHoop.y + rimThickness
    ) {
      basketball.position.x = 16 - ballRadius * 0.95;
      if (ballVelocity.x > 0) ballVelocity.x = -ballVelocity.x * 0.6;
      ballVelocity.y *= 0.85;
      ballVelocity.z *= 0.85;
    }

    // --- Ground collision and bounce ---
    if (basketball.position.y <= groundY) {
      basketball.position.y = groundY;
      if (Math.abs(ballVelocity.y) > minBounceVelocity) {
        ballVelocity.y = -ballVelocity.y * groundRestitution;
        // Apply friction to horizontal velocity
        ballVelocity.x *= 0.85;
        ballVelocity.z *= 0.85;
      } else {
        basketball.position.y = readyY;
        ballInFlight = false;
        ballVelocity.set(0, 0, 0);
        updateShotGuide(); // Always update guide when ball comes to rest
      }
    }

    // --- SHOT DETECTION ---
    // Check for score at both rims
    let scored = false;
    [leftRim, rightRim].forEach((rim) => {
      if (!scored && !scoredThisFlight && detectScore(basketball, rim)) {
        scored = true;
        scoredThisFlight = true;
        score += 2;
        shotsMade++;
        showFeedback(true);
        updateScoreUI();
      }
    });
    // When the ball lands, show feedback and reset flag
    if (basketball.position.y <= groundY && ballVelocity.y === 0) {
      showFeedback(scoredThisFlight);
      scoredThisFlight = false;
    }
  } else {
    // If not in flight, always update the guide (in case power changed)
    updateShotGuide();
  }
  renderer.render(scene, camera);
}
animate();

function addArenaWalls() {
    
    const courtWidth = 22;
    const courtLength = 15;
    const wallWidth = courtWidth * 2;   
    const wallHeight = 24;             
    const wallDistanceZ = courtLength;  
    const wallDistanceX =22;  
    const sideWallLength = courtLength * 2.5; 
    const sideWallOffset = 1; 

    const textureUrl = 'https://media.istockphoto.com/id/1472168138/photo/professional-basketball-arena-in-3d.jpg?s=612x612&w=0&k=20&c=5VOeYebDtHlGBShcCGjzcWRToQhsHCewaM-gjSXwP3c=';

    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, function(texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;

        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

       
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), material);
        backWall.position.set(0, wallHeight / 2, -wallDistanceZ);
        scene.add(backWall);

        
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(sideWallLength, wallHeight), material);
        leftWall.position.set(-wallDistanceX, wallHeight / 2, -sideWallOffset);
        leftWall.rotation.y = Math.PI / 2;
        scene.add(leftWall);

        
        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(sideWallLength, wallHeight), material);
        rightWall.position.set(wallDistanceX, wallHeight / 2, -sideWallOffset);
        rightWall.rotation.y = -Math.PI / 2;
        scene.add(rightWall);
    });
}

function addArenaFloorZone() {
    const zoneWidth = 44; 
    const zoneLength = 30; 
    const zoneColor = 0xc68642; 

    const geometry = new THREE.PlaneGeometry(zoneWidth, zoneLength);
    const material = new THREE.MeshBasicMaterial({ color: zoneColor });
    const zone = new THREE.Mesh(geometry, material);
    zone.position.set(0, -0.1, 0); 
    zone.rotation.x = -Math.PI / 2;
    scene.add(zone);
}

function addCourtLogoOnWall() {
    const logoUrl = 'https://upload.wikimedia.org/wikipedia/he/thumb/1/14/MaccabiLogo.png/250px-MaccabiLogo.png';
    const logoWidth = 8;
    const logoHeight = 8;
    const wallHeight = 24; 
    const wallDistanceZ = 15; 

    const loader = new THREE.TextureLoader();
    loader.load(logoUrl, function(texture) {
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
        const logoMesh = new THREE.Mesh(geometry, material);
       
        logoMesh.position.set(0, wallHeight / 2, -wallDistanceZ + 0.1); 
        scene.add(logoMesh);
    });
}

function addCourtLogoOnFloor() {
    const logoUrl = 'https://upload.wikimedia.org/wikipedia/he/thumb/1/14/MaccabiLogo.png/250px-MaccabiLogo.png';
    const logoWidth = 8;
    const logoHeight = 8;
    const loader = new THREE.TextureLoader();
    loader.load(logoUrl, function(texture) {
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.5 
        });
        const geometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
        const logoMesh = new THREE.Mesh(geometry, material);
        logoMesh.position.set(0, 0.15, 0); 
        logoMesh.rotation.x = -Math.PI / 2;
        scene.add(logoMesh);
    });
}


addArenaWalls();
addArenaFloorZone();
addCourtLogoOnWall();
addCourtLogoOnFloor();

const wallX = 22; 
const wallZ = 15; 


if (basketball.position.x < -wallX + ballRadius) {
  basketball.position.x = -wallX + ballRadius;
  if (ballVelocity.x < 0) ballVelocity.x = -ballVelocity.x * 0.7;
  ballVelocity.z *= 0.85;
}
if (basketball.position.x > wallX - ballRadius) {
  basketball.position.x = wallX - ballRadius;
  if (ballVelocity.x > 0) ballVelocity.x = -ballVelocity.x * 0.7;
  ballVelocity.z *= 0.85;
}
if (basketball.position.z < -wallZ + ballRadius) {
  basketball.position.z = -wallZ + ballRadius;
  if (ballVelocity.z < 0) ballVelocity.z = -ballVelocity.z * 0.7;
  ballVelocity.x *= 0.85;
}
if (basketball.position.z > wallZ - ballRadius) {
  basketball.position.z = wallZ - ballRadius;
  if (ballVelocity.z > 0) ballVelocity.z = -ballVelocity.z * 0.7;
  ballVelocity.x *= 0.85;
}
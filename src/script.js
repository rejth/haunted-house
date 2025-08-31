import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import random from 'canvas-sketch-util/random';
import GUI from 'lil-gui';

/**
 * Base
 */

const gui = new GUI();

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

/**
 * Textures
 */
const textureLoadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(textureLoadingManager);

// Ground
const groundAlphaTexture = textureLoader.load('/textures/floor/alpha.webp');
const groundColorTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_diff_1k.webp');
const groundNormalTexture = textureLoader.load(
  '/textures/floor/coast_sand_rocks_02_nor_gl_1k.webp',
);
const groundRoughnessTexture = textureLoader.load(
  '/textures/floor/coast_sand_rocks_02_arm_1k.webp',
);
const groundDisplacementTexture = textureLoader.load(
  '/textures/floor/coast_sand_rocks_02_disp_1k.webp',
);

// House
const houseColorTexture = textureLoader.load('/textures/wall/castle_brick_broken_06_diff_1k.webp');
const houseNormalTexture = textureLoader.load(
  '/textures/wall/castle_brick_broken_06_nor_gl_1k.webp',
);
const houseRoughnessTexture = textureLoader.load(
  '/textures/wall/castle_brick_broken_06_arm_1k.webp',
);

// Roof
const roofColorTexture = textureLoader.load('/textures/roof/roof_slates_02_diff_1k.webp');
const roofNormalTexture = textureLoader.load('/textures/roof/roof_slates_02_nor_gl_1k.webp');
const roofRoughnessTexture = textureLoader.load('/textures/roof/roof_slates_02_arm_1k.webp');

// Door
const doorColorTexture = textureLoader.load('/textures/door/color.webp');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.webp');
const doorHeightTexture = textureLoader.load('/textures/door/height.webp');
const doorNormalTexture = textureLoader.load('/textures/door/normal.webp');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.webp');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.webp');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.webp');

// Bush
const bushColorTexture = textureLoader.load('/textures/bush/leaves_forest_ground_diff_1k.webp');
const bushNormalTexture = textureLoader.load('/textures/bush/leaves_forest_ground_nor_gl_1k.webp');
const bushRoughnessTexture = textureLoader.load('/textures/bush/leaves_forest_ground_arm_1k.webp');

// Grave
const graveColorTexture = textureLoader.load('/textures/grave/plastered_stone_wall_diff_1k.webp');
const graveNormalTexture = textureLoader.load(
  '/textures/grave/plastered_stone_wall_nor_gl_1k.webp',
);
const graveRoughnessTexture = textureLoader.load(
  '/textures/grave/plastered_stone_wall_arm_1k.webp',
);

// Brick
const brickColorTexture = textureLoader.load('/textures/brick/weathered_planks_diff_1k.jpg');
const brickRoughnessTexture = textureLoader.load('/textures/brick/weathered_planks_arm_1k.jpg');
const brickNormalTexture = textureLoader.load('/textures/brick/weathered_planks_nor_gl_1k.jpg');

/**
 * Objects
 */
const groundWidth = 20;
const groundHeight = 20;
const houseHeight = 2.5;
const houseWidth = 4;
const roofHeight = 2;
const roofSegments = 4;
const doorWidth = 2;
const doorHeight = 2;

// Ground
groundColorTexture.colorSpace = THREE.SRGBColorSpace;

groundColorTexture.wrapS = THREE.RepeatWrapping;
groundColorTexture.wrapT = THREE.RepeatWrapping;
groundNormalTexture.wrapS = THREE.RepeatWrapping;
groundNormalTexture.wrapT = THREE.RepeatWrapping;
groundRoughnessTexture.wrapS = THREE.RepeatWrapping;
groundRoughnessTexture.wrapT = THREE.RepeatWrapping;
groundDisplacementTexture.wrapS = THREE.RepeatWrapping;
groundDisplacementTexture.wrapT = THREE.RepeatWrapping;

groundColorTexture.repeat.set(8, 8);
groundNormalTexture.repeat.set(8, 8);
groundRoughnessTexture.repeat.set(8, 8);
groundDisplacementTexture.repeat.set(8, 8);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(groundWidth, groundHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: groundAlphaTexture, // opacity of the material
    map: groundColorTexture, // the actual color of the material
    normalMap: groundNormalTexture, // fake orientation to create details not to make texture flat
    aoMap: groundRoughnessTexture, // how rough or smooth the material is
    roughnessMap: groundRoughnessTexture,
    metalnessMap: groundRoughnessTexture,
    displacementMap: groundDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
);
ground.rotation.x = -Math.PI * 0.5;
gui
  .add(ground.material, 'displacementScale')
  .min(0)
  .max(1)
  .step(0.01)
  .name('Ground Displacement Scale');
gui
  .add(ground.material, 'displacementBias')
  .min(-1)
  .max(1)
  .step(0.01)
  .name('Ground Displacement Bias');
gui.add(ground.material, 'roughness').min(0).max(1).step(0.01).name('Ground Roughness');
gui.add(ground.material, 'metalness').min(0).max(1).step(0.01).name('Ground Metalness');
gui.add(ground.material, 'aoMapIntensity').min(0).max(1).step(0.01).name('Ground AO Map Intensity');

// House
const houseGroup = new THREE.Group();
houseGroup.position.set(0, 0, 0);

houseColorTexture.colorSpace = THREE.SRGBColorSpace;

const house = new THREE.Mesh(
  new THREE.BoxGeometry(houseWidth, houseHeight, houseWidth),
  new THREE.MeshStandardMaterial({
    map: houseColorTexture,
    normalMap: houseNormalTexture,
    normalScale: new THREE.Vector2(1, 1),
    aoMap: houseRoughnessTexture,
    roughnessMap: houseRoughnessTexture,
    metalnessMap: houseRoughnessTexture,
  }),
);
house.position.set(0, houseHeight * 0.5, 0);
houseGroup.add(house);
gui.add(house.material, 'roughness').min(0).max(1).step(0.01).name('House Roughness');
gui.add(house.material, 'metalness').min(0).max(1).step(0.01).name('House Metalness');
gui.add(house.material, 'aoMapIntensity').min(0).max(1).step(0.01).name('House AO Map Intensity');
gui.add(house.material.normalScale, 'x').min(0).max(1).step(0.01).name('House Normal Scale X');
gui.add(house.material.normalScale, 'y').min(0).max(1).step(0.01).name('House Normal Scale Y');

// Roof
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(3, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

roofRoughnessTexture.repeat.set(3, 1);
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, roofSegments),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    normalMap: roofNormalTexture,
    aoMap: roofRoughnessTexture,
    roughnessMap: roofRoughnessTexture,
    metalnessMap: roofRoughnessTexture,
  }),
);
roof.position.set(0, houseHeight + roofHeight * 0.5, 0);
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);
gui.add(roof.material, 'roughness').min(0).max(1).step(0.01).name('Roof Roughness');
gui.add(roof.material, 'metalness').min(0).max(1).step(0.01).name('Roof Metalness');
gui.add(roof.material, 'aoMapIntensity').min(0).max(1).step(0.01).name('Roof AO Map Intensity');

// Door
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorWidth, doorHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    map: doorColorTexture,
    normalMap: doorNormalTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  }),
);
door.position.set(0, 1, 2 + 0.001);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);

houseGroup.add(door, doorLight);

// Bush
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushColorTexture.wrapT = THREE.RepeatWrapping;

bushNormalTexture.repeat.set(2, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapT = THREE.RepeatWrapping;

bushRoughnessTexture.repeat.set(2, 1);
bushRoughnessTexture.wrapS = THREE.RepeatWrapping;
bushRoughnessTexture.wrapT = THREE.RepeatWrapping;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  normalMap: bushNormalTexture,
  aoMap: bushRoughnessTexture,
  roughnessMap: bushRoughnessTexture,
  metalnessMap: bushRoughnessTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.rotation.x = -0.75;
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.rotation.x = -0.75;
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.rotation.x = -0.75;
bush3.position.set(-0.8, 0.05, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.15);
bush4.rotation.x = -0.75;
bush4.position.set(-1.5, 0.05, 2.6);

houseGroup.add(bush1, bush2, bush3, bush4);
bushGeometry.dispose();
bushMaterial.dispose();
gui.add(bushMaterial, 'roughness').min(0).max(1).step(0.01).name('Bush Roughness');
gui.add(bushMaterial, 'metalness').min(0).max(1).step(0.01).name('Bush Metalness');
gui.add(bushMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('Bush AO Map Intensity');

// Grave
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  aoMap: graveRoughnessTexture,
  roughnessMap: graveRoughnessTexture,
  metalnessMap: graveRoughnessTexture,
});

const graves = new THREE.Group();
random.setSeed(34);

for (let i = 0; i < 30; i++) {
  const angle = random.value() * Math.PI * 2;
  const radius = 3.5 + random.value() * 4;
  const x = Math.sin(angle) * radius;
  const y = random.value() * 0.3;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, y, z);
  grave.rotation.x = (random.value() - 0.5) * 0.4;
  grave.rotation.y = (random.value() - 0.5) * 0.4;
  grave.rotation.z = (random.value() - 0.5) * 0.4;

  graves.add(grave);
}

graveGeometry.dispose();
graveMaterial.dispose();
gui.add(graveMaterial, 'roughness').min(0).max(1).step(0.01).name('Grave Roughness');
gui.add(graveMaterial, 'metalness').min(0).max(1).step(0.01).name('Grave Metalness');
gui.add(graveMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('Grave AO Map Intensity');

// Brick
brickColorTexture.colorSpace = THREE.SRGBColorSpace;
random.setSeed(20);

const brickGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const brickMaterial = new THREE.MeshStandardMaterial({
  map: brickColorTexture,
  normalMap: brickNormalTexture,
  aoMap: brickRoughnessTexture,
  roughnessMap: brickRoughnessTexture,
  metalnessMap: brickRoughnessTexture,
});

const bricks = new THREE.Group();

for (let i = 0; i < 3; i++) {
  const angle = random.value() * Math.PI * 2;
  const radius = 4 + random.value() * 5;
  const x = Math.sin(angle) * radius;
  const y = random.value() * 0.3;
  const z = Math.cos(angle) * radius;

  const brick = new THREE.Mesh(brickGeometry, brickMaterial);

  brick.position.set(x, y, z);
  brick.rotation.x = (random.value() - 0.5) * 0.4;
  brick.rotation.y = (random.value() - 0.5) * 0.4;
  brick.rotation.z = (random.value() - 0.5) * 0.4;

  bricks.add(brick);
}

brickGeometry.dispose();
brickMaterial.dispose();

gui.add(brickMaterial, 'roughness').min(0).max(1).step(0.01).name('Brick Roughness');
gui.add(brickMaterial, 'metalness').min(0).max(1).step(0.01).name('Brick Metalness');
gui.add(brickMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('Brick AO Map Intensity');

// Ghost
const ghosts = new THREE.Group();

const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);

ghosts.add(ghost1, ghost2, ghost3);

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.add(ground, houseGroup, graves, bricks, ghosts);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(100);

scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#02343f', 0.1);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Window
 */
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
house.castShadow = true;
roof.castShadow = true;

house.receiveShadow = true;
ground.receiveShadow = true;

ghosts.children.forEach((ghost) => {
  ghost.castShadow = true;
});

graves.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

bricks.children.forEach((brick) => {
  brick.castShadow = true;
  brick.receiveShadow = true;
});

// Mapping shadows
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Animate
 */
const timer = new Timer();

const changeYPosition = (angle) => {
  return Math.sin(angle) * Math.sin(angle * 2.5) * Math.sin(angle * 3.5);
};

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  const ghost1Angle = elapsedTime * 0.5;
  const ghost1Radius = 4;
  ghost1.position.x = Math.cos(ghost1Angle) * ghost1Radius;
  ghost1.position.y = changeYPosition(ghost1Angle);
  ghost1.position.z = Math.sin(ghost1Angle) * ghost1Radius;

  const ghost2Angle = -elapsedTime * 0.38;
  const ghost2Radius = 5;
  ghost2.position.x = Math.cos(ghost2Angle) * ghost2Radius;
  ghost2.position.y = changeYPosition(ghost2Angle);
  ghost2.position.z = Math.sin(ghost2Angle) * ghost2Radius;

  const ghost3Angle = elapsedTime * 0.23;
  const ghost3Radius = 6;
  ghost3.position.x = Math.cos(ghost3Angle) * ghost3Radius;
  ghost3.position.y = changeYPosition(ghost3Angle);
  ghost3.position.z = Math.sin(ghost3Angle) * ghost3Radius;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

gui.close();

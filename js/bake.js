import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadGLTFModel } from './model.js';

let stats;
let camera;
let scene;
let renderer;
let controls;

init();
animate();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    50000
  );
  camera.position.y = 20;
  camera.position.x = 20 * Math.sin(0.2 * Math.PI);
  camera.position.z = 20 * Math.cos(0.2 * Math.PI);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  console.log('camera:', camera);

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // helpers
  const axesHelper = new THREE.AxesHelper(500);
  // scene.add(axesHelper);
  stats = Stats();
  container.appendChild(stats.dom);
  controls = new OrbitControls(camera, renderer.domElement);

  // loadGLTFModel function might need to be imported or defined here
  loadGLTFModel(scene, 'models/model1-baked.glb', {
    receiveShadow: false,
    castShadow: false,
    x: 0,
    y: 0 
  });
  // loadGLTFModel(scene, 'models/model1-baked.glb', {
  //   receiveShadow: false,
  //   castShadow: false,
  //   x: 0,
  //   y: 2.5
  // });
  // loadGLTFModel(scene, 'models/model1-baked.glb', {
  //   receiveShadow: false,
  //   castShadow: false,
  //   x: 0,
  //   y: -2.5
  // });
  // loadGLTFModel(scene, 'models/model1-baked.glb', {
  //   receiveShadow: false,
  //   castShadow: false,
  //   x: 0,
  //   y: 2.5*2
  // });
  // loadGLTFModel(scene, 'models/model1-baked.glb', {
  //   receiveShadow: false,
  //   castShadow: false,
  //   x: 0,
  //   y: -2.5*2
  // });
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();
  controls.update();

  renderer.render(scene, camera);
}

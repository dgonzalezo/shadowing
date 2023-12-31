import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadGLTFModel } from './model.js';
import { PCSS, PCSSGetShadow } from './percentage-closer-soft-shadows.js';

let stats;
let camera;
let scene;
let renderer;
let light;
let frame = 0;

init();

function init() {
  const container = document.createElement('div');
  container.classList.add('pcss');
  document.body.appendChild(container);

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.x = 7;
  camera.position.y = 13;
  camera.position.z = 7;
  scene.add(camera);

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  light = new THREE.DirectionalLight(0xffffff, 1.4);
  light.position.set(4, 7, 4);

  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.far = 20;

  scene.add(light);

  scene.add(new THREE.DirectionalLightHelper(light));
  
  // ground
  const groundMaterial = new THREE.ShadowMaterial({
    color: 0x000b0b,
    transparent: true,
    opacity: 1.0
  });
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // overwrite shadowmap code
  let shader = THREE.ShaderChunk.shadowmap_pars_fragment;
  shader = shader.replace('#ifdef USE_SHADOWMAP', '#ifdef USE_SHADOWMAP' + PCSS);
  shader = shader.replace(
    '#if defined( SHADOWMAP_TYPE_PCF )',
    PCSSGetShadow + '#if defined( SHADOWMAP_TYPE_PCF )'
  );
  THREE.ShaderChunk.shadowmap_pars_fragment = shader;

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.4;
  controls.minDistance = 10;
  controls.maxDistance = 75;
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();

  loadGLTFModel(scene, 'models/model1.glb').then(dog => {
    light.target = dog;
  });

  // loadGLTFModel(scene, 'models/model1.glb', {
  //   receiveShadow: true,
  //   castShadow: true,
  //   x: 0,
  //   y: 1.5
  // }).then(dog1 => {
  //   // light.target = dog1;
  // });
  // loadGLTFModel(scene, 'models/model1.glb', {
  //   receiveShadow: true,
  //   castShadow: true,
  //   x: 0,
  //   y: -1.5
  // }).then(dog1 => {
  //   // light.target = dog1;
  // });

  // loadGLTFModel(scene, 'models/model1.glb', {
  //   receiveShadow: true,
  //   castShadow: true,
  //   x: 0,
  //   y: 1.5*2
  // }).then(dog1 => {
  //   // light.target = dog1;
  // });
  // loadGLTFModel(scene, 'models/model1.glb', {
  //   receiveShadow: true,
  //   castShadow: true,
  //   x: 0,
  //   y: -1.5*2
  // }).then(dog1 => {
  //   // light.target = dog1;
  // });
  // performance monitor
  stats = Stats();
  container.appendChild(stats.dom);
  animate();

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    frame += 0.001;
    const r = 4;
    light.position.set(
      // r * Math.sin(frame * Math.PI),
      4,
      4,
      4
      // r * Math.cos(frame * Math.PI)
    );

    renderer.render(scene, camera);
    stats.update();
    controls.update();

    requestAnimationFrame(animate);
  }
}

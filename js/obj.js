import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { loadObjModel } from './model.js';

let camera;
let scene;
let renderer;
let controls;

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    50000
  )
  camera.position.y = 20
  camera.position.x = 20 * Math.sin(0.2 * Math.PI)
  camera.position.z = 20 * Math.cos(0.2 * Math.PI)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  // console.log('camera:', camera)

  scene = new THREE.Scene()

  const groundMaterial = new THREE.ShadowMaterial({
    transparent: true,
    color: 0x3c3c3c
  })
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)
  
  const light = new THREE.DirectionalLight(0xdfebff, 5)
  light.position.set(10, 30, 10)
  light.castShadow = true
  const d = 5
  light.shadow.camera.visible = true
  light.shadow.camera.left = -d
  light.shadow.camera.right = d
  light.shadow.camera.top = d
  light.shadow.camera.bottom = -d
  light.shadow.radius = 5
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  // light.shadow.camera.near = 0.5
  light.shadow.camera.far = 2000
  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.1)
  scene.add(ambientLight)

  const axesHelper = new THREE.AxesHelper(500)
  scene.add(axesHelper)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  document.body.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  // loadObjModel(scene, 'models/model1.mtl', 'models/model1.obj')

  const mtlLoader = new MTLLoader()
  mtlLoader.load('models/model1.mtl', (materials) => {
    materials.preload();
    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.load('models/model1.obj', obj => {
      // console.log(`${objPath}:`, obj)
      obj.position.y = 0
      obj.position.x = 0
      obj.receiveShadow = true
      obj.castShadow = true
      scene.add(obj)

      obj.traverse(function (child) {
        if (child.isMesh) {
          // console.log('mesh child:', child)
          child.castShadow = true;
          child.receiveShadow = true;
          const smooth = false;
          // console.log('child.geometry:', child.geometry)

          if (smooth && child.geometry instanceof THREE.BufferGeometry) {
            child.geometry.deleteAttribute('normal');
            child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
            child.geometry.computeVertexNormals(child.geometry);
          }
        }
      })
    })
  })

}

function animate() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

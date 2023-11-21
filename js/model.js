import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

export function loadObjModel(
  scene,
  mtlPath,
  objPath,
  options = { smooth: false, receiveShadow: true, castShadow: true }
) {
  const { smooth, receiveShadow, castShadow } = options;
  return new Promise(resolve => {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(mtlPath, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load(objPath, obj => {
        console.log(`${objPath}:`, obj)
        obj.position.y = 0
        obj.position.x = 0
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        scene.add(obj)

        obj.traverse(function (child) {
          if (child.isMesh) {
            console.log('mesh child:', child)
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
            console.log('child.geometry:', child.geometry)

            if (smooth && child.geometry instanceof THREE.BufferGeometry) {
              child.geometry.deleteAttribute('normal');
              child.geometry = mergeVertices(child.geometry);
              child.geometry.computeVertexNormals(child.geometry);
            }
          }
        })

        resolve(obj)
      })
    })
  })
}

export function loadGLTFModel(
  scene,
  glbPath,
  options = { receiveShadow: true, castShadow: true, x: 0, y: 0 }
) {
  const { receiveShadow, castShadow, x, y } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      glbPath,
      gltf => {
        // console.log('gltf:', gltf);
        const obj = gltf.scene;
        obj.name = 'dog';
        obj.position.y = x;
        obj.position.x = y;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        // console.log('model:', obj);

        obj.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
            child.material.transparent = true;
          }
        });
        resolve(obj);
      },
      undefined,
      function(error) {
        console.error('An error happened:', error);
        reject(error);
      }
    );
  });
}

// Ahora, puedes usar estas funciones loadObjModel y loadGLTFModel en tu código JavaScript.

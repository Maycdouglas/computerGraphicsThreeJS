import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import GUI from '../libs/util/dat.gui.module.js'
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a sphere
let sphereGeometry = new THREE.SphereGeometry(1);
let sphere = new THREE.Mesh(sphereGeometry, material);
let sphere2 = new THREE.Mesh(sphereGeometry, material);

sphere.position.set(-8.0, 1, -5.0);
sphere2.position.set(-8.0, 1, 5.0);

scene.add(sphere);
scene.add(sphere2);

// Configurações de Movimento
const movementConfigSphere1 = {
  velocity: new THREE.Vector3(0.2, 0, 0),
  destination: new THREE.Vector3(8.0, 1, -5.0),
  moving: false
};

const movementConfigSphere2 = {
  velocity: new THREE.Vector3(0.1, 0, 0),
  destination: new THREE.Vector3(8.0, 1, 5.0),
  moving: false
};

function buildInterface() {
  var controls = new function () {
     this.moveSphere1 = function () {
      movementConfigSphere1.moving = true;
      console.log(movementConfigSphere1.moving)
     };
     this.moveSphere2 = function () {
      movementConfigSphere2.moving = true;
     };
     this.resetSpheres = function () {
      movementConfigSphere1.moving = false;
      sphere.position.set(-8.0, 1, -5.0)

      movementConfigSphere2.moving = false;
      sphere2.position.set(-8.0, 1, 5.0)
     }
  };

  let gui = new GUI();
  let folder = gui.addFolder("Exercise 01");
  folder.open();  // permite que a janelinha inicie aberta
  folder.add(controls, 'moveSphere1').name(" ESFERA 1 ");
  folder.add(controls, 'moveSphere2').name(" ESFERA 2 ");
  folder.add(controls, 'resetSpheres').name(" RESET ");
}

function updatePosition(object, config) {
  if(config.moving) {
    const direction = new THREE.Vector3().subVectors(config.destination, object.position).normalize();
    const step = direction.multiply(config.velocity)

    if(object.position.distanceTo(config.destination) > step.length()) {
      object.position.add(step);
    } else {
      object.position.copy(config.destination); // Snap to destination
      config.moving = false; // para movimento
    }
  }
}

buildInterface();
render();
function render()
{
  updatePosition(sphere, movementConfigSphere1);
  updatePosition(sphere2, movementConfigSphere2);
     
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
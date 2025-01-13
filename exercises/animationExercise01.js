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
// position the cube
sphere.position.set(-8.0, 1, -5.0);
sphere2.position.set(-8.0, 1, 5.0);
// add the cube to the scene
scene.add(sphere);
scene.add(sphere2);

// Variables that will be used for linear interpolation
const lerpConfigSphere1 = {
  destination: new THREE.Vector3(8.0, 1, -5.0),
  alpha: 0.02,
  move: false
}

const lerpConfigSphere2 = {
   destination: new THREE.Vector3(8.0, 1, 5.0),
   alpha: 0.01,
   move: false
 }

function buildInterface() {
   var controls = new function () {
      this.onMoveSphere1 = function () {
         lerpConfigSphere1.move = true;
      };
      this.onMoveSphere2 = function () {
         lerpConfigSphere2.move = true;
      };
      this.resetSpheres = function () {
         lerpConfigSphere1.move = false;
         sphere.position.set(-8.0, 1, -5.0)

         lerpConfigSphere2.move = false;
         sphere2.position.set(-8.0, 1, 5.0)
      }
   };

   let gui = new GUI();
   let folder = gui.addFolder("Exercise 01");
   folder.open();  // permite que a janelinha inicie aberta
   folder.add(controls, 'onMoveSphere1').name(" ESFERA 1 ");
   folder.add(controls, 'onMoveSphere2').name(" ESFERA 2 ");
   folder.add(controls, 'resetSpheres').name(" RESET ");
}

buildInterface();
render();
function render()
{
   if(lerpConfigSphere1.move) sphere.position.lerp(lerpConfigSphere1.destination, lerpConfigSphere1.alpha);
   
   if(lerpConfigSphere2.move) sphere2.position.lerp(lerpConfigSphere2.destination, lerpConfigSphere2.alpha);
   
   requestAnimationFrame(render);
   renderer.render(scene, camera) // Render scene
}
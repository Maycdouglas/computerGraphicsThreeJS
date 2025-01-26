import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";
import { SpotLight } from '../build/three.module.js';

let scene, renderer, camera, orbit, materialRed, materialGreen, materialYellow, materialMagenta;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
materialRed = setDefaultMaterial("red"); // create a basic material and set color
materialGreen = setDefaultMaterial("lightgreen"); // create a basic material and set color
materialYellow = setDefaultMaterial("yellow"); // create a basic material and set color
materialMagenta = setDefaultMaterial("magenta"); // create a basic material and set color

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
scene.add(dirLight);  

let positionSpotlight =  new THREE.Vector3(1.5, 3, 0);
let lightColor = "rgb(255,255,255)";
let spotlight = new THREE.SpotLight(lightColor, 10)
spotlight.position.copy(positionSpotlight);
spotlight.angle = THREE.MathUtils.degToRad(45);

spotlight.castShadow = true
spotlight.shadow.mapSize.width = 512;
spotlight.shadow.mapSize.height = 512;
spotlight.shadow.camera.near = 0.1;
spotlight.shadow.camera.far = 6;
spotlight.shadow.camera.left = -2.5;
spotlight.shadow.camera.right = 2.5;
spotlight.shadow.camera.bottom = -2.5;
spotlight.shadow.camera.top = 2.5;



// spotlight.target.position.set(1.5, 1.8, 0)
spotlight.target.position.set(2.7, 0, 0)
scene.add(spotlight)
scene.add(spotlight.target)

// Load default scene
loadLightPostScene(scene)

let lightSphere = createLightSphere(scene, 0.05, 10, 10, positionSpotlight);

// create Rectangles
let rectangleGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
let rectangleRed = new THREE.Mesh(rectangleGeometry, materialRed);
// position the Rectangles
rectangleRed.position.set(3.0, 0.5, 0.0);
rectangleRed.castShadow = true;


// add the rectangle to the scene
scene.add(rectangleRed);

let rectangleGreen = new THREE.Mesh(rectangleGeometry, materialGreen);
rectangleGreen.position.set(3.0, 0.5, 2.0)
rectangleGreen.castShadow = true;
scene.add(rectangleGreen)

// create Cylinders
let cylinderGeometry = new THREE.CylinderGeometry(0.2,0.2,1)
let cylinderYellow = new THREE.Mesh(cylinderGeometry, materialYellow);
cylinderYellow.position.set(1.5, 0.5, -2.0);
cylinderYellow.castShadow = true;
scene.add(cylinderYellow);

let cylinderMagenta = new THREE.Mesh(cylinderGeometry, materialMagenta);
cylinderMagenta.position.set(0, 0.5, 3.0);
cylinderMagenta.castShadow = true;
scene.add(cylinderMagenta);

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
//initDefaultBasicLight(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}

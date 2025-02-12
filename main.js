import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);
camera.lookAt(0, 0, 0);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 0,);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = 1;
scene.add(spotLight);

let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(2, 10, 100);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

const ambientLight = new THREE.AmbientLight(0xffffff, 18); // Brighter white light
scene.add(ambientLight);

let mixer;
let currentModel = null;

function myFunction() {
    console.log("Function called!");

    if (currentModel) {
        scene.remove(currentModel); // Remove from scene
    }

    let value = document.getElementById("model").value;

    if (value === "diancie-rumble") {
        const loader = new GLTFLoader().setPath('public/diancie/diancie-rumble/');
        loader.load('diancie_spin.gltf', (gltf) => {
            const mesh = gltf.scene;
            mesh.scale.set(5, 5, 5);
            mesh.position.set(0, 0, 0);
            scene.add(mesh);
            currentModel = mesh; // Store reference

            mixer = new THREE.AnimationMixer(mesh);
            const clips = gltf.animations;
            const clip = THREE.AnimationClip.findByName(clips, 'Spin');
            const action = mixer.clipAction(clip);
            action.play();
        });
    } else if (value === "diancie-sv") {
        const loader = new GLTFLoader().setPath('public/diancie/diancie-sv/');
        loader.load('diancie.gltf', (gltf) => {
            const mesh = gltf.scene;
            mesh.scale.set(5, 5, 5);
            mesh.position.set(0, 0, 0);
            scene.add(mesh);
            currentModel = mesh; // Store reference
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('model');
    selectElement.addEventListener('change', myFunction);
});


const clock = new THREE.Clock();
function animate() {
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
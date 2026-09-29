import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function mountIronViewer(host, modelUrl = '/products/RE-3-065/assets/RE-3-065.glb', label = 'كاوية ريبون') {
  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const longest = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longest) || longest <= 0) {
    environment.dispose(); renderer.dispose();
    throw new Error('Invalid model bounds');
  }
  model.position.sub(center);
  model.scale.setScalar(2 / longest);
  model.position.multiplyScalar(2 / longest);
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x77614b, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(-3, 5, 4); scene.add(key);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 1.4;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;
  controls.target.set(0, 0, 0);
  const render = () => renderer.render(scene, camera);
  const reset = () => {
    const distance = host.clientWidth < 500 ? 4.6 : 3.6;
    camera.position.copy(new THREE.Vector3(-1, 0.55, 1.5).normalize().multiplyScalar(distance));
    controls.update(); render();
  };
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', `نموذج تفاعلي ${label}؛ استخدم أزرار التحكم للدوران والتكبير`);
  renderer.domElement.setAttribute('aria-describedby', 'viewer-help');
  host.replaceChildren(renderer.domElement);
  controls.addEventListener('change', render);
  const resize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix(); render();
  };
  const observer = new ResizeObserver(resize); observer.observe(host);
  resize(); reset();
  document.querySelector('#viewer-controls').addEventListener('click', (event) => {
    const action = event.target.closest('[data-view]')?.dataset.view;
    if (!action) return;
    if (action === 'reset') return reset();
    const spherical = new THREE.Spherical().setFromVector3(camera.position);
    if (action === 'left') spherical.theta -= Math.PI / 6;
    if (action === 'right') spherical.theta += Math.PI / 6;
    if (action === 'top') spherical.phi = 0.02;
    if (action === 'bottom') spherical.phi = Math.PI - 0.02;
    if (action === 'in') spherical.radius *= 0.8;
    if (action === 'out') spherical.radius *= 1.25;
    spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance);
    camera.position.setFromSpherical(spherical);
    controls.update(); render();
  });
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    document.querySelector('#viewer-status').textContent = 'توقف العرض. أعد تحميل الصفحة للمحاولة مجددًا.';
  });
}

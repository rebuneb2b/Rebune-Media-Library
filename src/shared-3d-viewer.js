import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

async function mountUnifiedViewer(host) {
  const modelUrl = host.dataset.model;
  if (!modelUrl) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();

  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const longest = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longest) || longest <= 0) throw new Error('Invalid model bounds');

  model.position.sub(center);
  const targetSize = 2.25;
  model.scale.setScalar(targetSize / longest);
  model.position.multiplyScalar(targetSize / longest);
  scene.add(model);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a7b61, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff1e4, 1.8);
  fill.position.set(4, 2, -3);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 2.35;
  controls.maxDistance = 7.5;
  controls.maxPolarAngle = Math.PI - 0.06;
  controls.minPolarAngle = 0.06;
  controls.target.set(0, 0, 0);
  camera.position.copy(new THREE.Vector3(-1.1, 0.38, 1.7).normalize().multiplyScalar(3.65));
  controls.update();

  const poster = host.querySelector('.unified-3d-poster');
  host.prepend(renderer.domElement);
  host.dataset.ready = 'true';
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', host.dataset.label || 'عرض ثلاثي الأبعاد للمنتج');

  let raf = 0;
  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  };

  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  render();

  const stop = () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
    controls.dispose();
    renderer.dispose();
    env.dispose();
  };
  window.addEventListener('pagehide', stop, { once: true });
  poster?.setAttribute('aria-hidden', 'true');
}

for (const host of document.querySelectorAll('.unified-3d-stage[data-model]')) {
  mountUnifiedViewer(host).catch((error) => {
    console.error('Unified 3D viewer:', error);
    host.dataset.ready = 'error';
    const loading = host.querySelector('.unified-3d-loading');
    if (loading) loading.textContent = 'تعذّر تشغيل العرض ثلاثي الأبعاد. يمكنك الاستمرار بمشاهدة صور المنتج.';
  });
}

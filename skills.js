// Respect reduced motion by default
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fxToggle = document.getElementById('fx');
const cards = [...document.querySelectorAll('[data-tilt]')];

// Default: enable effects unless user prefers reduced motion
let effectsOn = !reduceMotion;
if (fxToggle) fxToggle.checked = effectsOn;

function handleMove(e, card){
  const rect = card.getBoundingClientRect();
  const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
  const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const rx = ((y / rect.height) - 0.5) * -8; // tilt up/down
  const ry = ((x / rect.width) - 0.5) * 12;  // tilt left/right
  card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
}

function reset(card){
  card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
}

function bindCard(card){
  card.addEventListener('mousemove', (e)=> effectsOn && handleMove(e, card));
  card.addEventListener('mouseleave', ()=> reset(card));
  card.addEventListener('touchmove', (e)=> { if(!effectsOn) return; handleMove(e, card); }, { passive: true });
  card.addEventListener('touchend', ()=> reset(card));
}

cards.forEach(bindCard);

if (fxToggle){
  fxToggle.addEventListener('change', ()=>{
    effectsOn = fxToggle.checked;
    cards.forEach(reset);
  });
}

/* ---------- Optional: Tiny Three.js flourish ----------
   1) In skills.html, uncomment the <section> with the #threeDemo canvas.
   2) Uncomment the <script> tag for three.min.js in skills.html.
   3) Uncomment this block to render a lightweight wireframe sphere.
*/
// (() => {
//   const threeCanvas = document.getElementById('threeDemo');
//   if (!threeCanvas || !window.THREE) return;
//
//   const { Scene, PerspectiveCamera, WebGLRenderer,
//           SphereGeometry, MeshStandardMaterial, Mesh,
//           DirectionalLight } = THREE;
//
//   const scene = new Scene();
//   const camera = new PerspectiveCamera(60, threeCanvas.clientWidth / 260, 0.1, 100);
//   const renderer = new WebGLRenderer({ canvas: threeCanvas, antialias: true, alpha: true });
//   renderer.setSize(threeCanvas.clientWidth, 260, false);
//
//   const geo = new SphereGeometry(1, 24, 16);
//   const mat = new MeshStandardMaterial({ wireframe: true });
//   const mesh = new Mesh(geo, mat);
//   scene.add(mesh);
//
//   const light = new DirectionalLight(0xffffff, 1); light.position.set(1,1,1); scene.add(light);
//   camera.position.z = 3;
//
//   function animate(){ mesh.rotation.y += 0.01; renderer.render(scene, camera); requestAnimationFrame(animate); }
//   animate();
//
//   window.addEventListener('resize', ()=>{
//     renderer.setSize(threeCanvas.clientWidth, 260, false);
//     camera.aspect = threeCanvas.clientWidth / 260;
//     camera.updateProjectionMatrix();
//   });
// })();

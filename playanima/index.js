const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const frameDisplay = document.getElementById('frameDisplay');
const frameSlider = document.getElementById('frameSlider');
const layerInfo = document.getElementById('layerInfo');
const playPauseBtn = document.getElementById('playPauseBtn');

let animationData;
let fps = 24;
let frameCount = 0;
let currentFrame = 0;
let isPlaying = false;
let intervalId = null;

fetch('stage_ready.json')
  .then(res => res.json())
  .then(data => {
    animationData = data;
    fps = data.fps;
    frameCount = data.frames;
    canvas.width = data.canva.weight;
    canvas.height = data.canva.height;
    frameSlider.max = frameCount;
    renderFrame();
  })
  .catch(err => console.error('Ошибка загрузки JSON:', err));

function renderFrame() {
  if (!animationData) return;

  const meta = animationData.meta['latvia'];
  const events = animationData.e;
  const width = animationData.canva.weight;
  const height = animationData.canva.height;

  ctx.clearRect(0, 0, width, height);

  const activeEvents = events.filter(e =>
    currentFrame >= e.frame.start && currentFrame <= e.frame.end
  );

  const currentLayers = [];

  activeEvents.forEach(e => {
    e.layers.forEach(layer => {
      renderLayer(layer, meta);
      currentLayers.push(layer);
    });
  });

  updateInfo(currentLayers, meta);
  frameDisplay.textContent = currentFrame;
  frameSlider.value = currentFrame;
}

function renderLayer(layer, meta) {
  const text = resolveVariable(layer.text, meta);
  const x = layer.coords.x;
  const y = layer.coords.y;
  const size = layer.size || 32;
  const color = resolveVariable(layer.color, meta);
  // если weight = 'regular' — заменить на 'normal'
  let weight = layer.weight || 'normal';
  if (weight.toLowerCase() === 'regular') weight = 'normal';

  ctx.font = `${weight} ${size}px sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  if (layer.outline) {
    const outlineColor = resolveVariable(layer.outline.color, meta);
    const outlineWidth = parseInt(layer.outline.px) || 2;
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = outlineColor;
    ctx.strokeText(text, x, y);
  }

  ctx.fillText(text, x, y);
}

function resolveVariable(str, meta) {
  if (!str.startsWith('--')) return str;
  if (str.includes(':firstletter')) {
    const key = str.replace('--', '').split(':')[0];
    return meta[key]?.charAt(0) ?? '';
  }
  const key = str.replace('--', '');
  return meta[key] || str;
}

function updateInfo(layers, meta) {
  layerInfo.innerHTML = '';
  layers.forEach((l, i) => {
    const text = resolveVariable(l.text, meta);
    const color = resolveVariable(l.color, meta);
    layerInfo.innerHTML += `
      <div><b>Слой ${i + 1}</b></div>
      <div>Текст: ${text}</div>
      <div>Цвет: ${color}</div>
      <div>Координаты: (${l.coords.x}, ${l.coords.y})</div>
      <div>Размер: ${l.size}, Вес: ${l.weight}</div>
      <hr>`;
  });
}

// Контроль

function togglePlay() {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';

  if (isPlaying) {
    intervalId = setInterval(() => {
      if (currentFrame < frameCount) {
        currentFrame++;
        renderFrame();
      } else {
        togglePlay(); // остановка
      }
    }, 1000 / fps);
  } else {
    clearInterval(intervalId);
  }
}

function goToFrame(frame) {
  currentFrame = parseInt(frame);
  renderFrame();
}

function nextFrame() {
  if (currentFrame < frameCount) currentFrame++;
  renderFrame();
}

function prevFrame() {
  if (currentFrame > 0) currentFrame--;
  renderFrame();
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // чтобы не мешать ввод в поля

  switch(e.code) {
    case 'Space':
      e.preventDefault(); // чтобы не сдвигался скролл страницы
      togglePlay();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prevFrame();
      break;
    case 'ArrowRight':
      e.preventDefault();
      nextFrame();
      break;
  }
});

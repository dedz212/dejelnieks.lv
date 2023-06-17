// renderer.js
window.addEventListener('DOMContentLoaded', () => {
  // Отправляем сообщение в главный процесс, чтобы скрыть preloader
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('hide-preloader');
});

window.addEventListener('DOMContentLoaded', () => {
  const Store = require('electron-store');
  const store = new Store();

  const screenSizes = [
    [1920, 1080],
    [1280, 720],
    [800, 600],
    [640, 480]
  ];

  let currentSizeIndex = store.get('currentSizeIndex') || 0;
  const currentSizeElement = document.getElementById('current-size');

  // Инициализируем текущий размер экрана
  setSize(screenSizes[currentSizeIndex]);

  // Обработчики кликов на кнопках переключения размера экрана
  document.getElementById('prev-size').addEventListener('click', () => {
    currentSizeIndex--;
    if (currentSizeIndex < 0) {
      currentSizeIndex = screenSizes.length - 1;
    }
    setSize(screenSizes[currentSizeIndex]);
  });

  document.getElementById('next-size').addEventListener('click', () => {
    currentSizeIndex++;
    if (currentSizeIndex >= screenSizes.length) {
      currentSizeIndex = 0;
    }
    setSize(screenSizes[currentSizeIndex]);
  });

  function setSize(size) {
    const [width, height] = size;
    const currentWindow = require('electron').remote.getCurrentWindow();
    currentWindow.setSize(width, height);
    currentSizeElement.textContent = `${width}x${height}`;

    // Сохраняем текущий размер экрана в файле конфигурации
    store.set('currentSizeIndex', currentSizeIndex);
  }
});

/*
const { remote } = require('electron');
const { globalShortcut } = remote;
const mainWindow = remote.getCurrentWindow();

globalShortcut.register('Esc', () => {
  mainWindow.webContents.executeJavaScript(`document.querySelector('.bg.content').classList.contains('active')`)
    .then(hasActiveClass => {
      if (hasActiveClass) {
        
      } else {
        remote.app.quit();
      }
    })
    .catch(error => console.error(error));
});
*/
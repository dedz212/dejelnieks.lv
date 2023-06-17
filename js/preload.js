// preload.js
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  // Отображаем preloader
  ipcRenderer.send('show-preloader');

  // Скрываем preloader после загрузки страницы
  ipcRenderer.on('hide-preloader', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
  });
});

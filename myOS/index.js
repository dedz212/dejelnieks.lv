const app = document.getElementById('app');

const bgw = document.getElementById("bg-wrap");

async function loadJSON(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading JSON:', error);
      return null;
    }
}

let vv;
function getWindDirection(veja_virziens) {
    switch (true) {
      case (veja_virziens >= 0 && veja_virziens <= 22.5):
        vv = "Z";
        break;
      case (veja_virziens >= 22.5 && veja_virziens <= 67.5):
        vv = "ZA";
        break;
      case (veja_virziens >= 67.5 && veja_virziens <= 112.5):
        vv = "A";
        break;
      case (veja_virziens >= 112.5 && veja_virziens <= 157.5):
        vv = "DA";
        break;
      case (veja_virziens >= 157.5 && veja_virziens <= 202.5):
        vv = "D";
        break;
      case (veja_virziens >= 202.5 && veja_virziens <= 247.5):
        vv = "DR";
        break;
      case (veja_virziens >= 247.5 && veja_virziens <= 292.5):
        vv = "R";
        break;
      case (veja_virziens >= 292.5 && veja_virziens <= 337.5):
        vv = "ZR";
        break;
      case (veja_virziens >= 337.5 && veja_virziens <= 360.1):
        vv = "Z";
        break;
      default:
        vv = "?";
    }
  
    return vv;
}

function updateSpeedDisplay(veja_atrums, brazmas, vaD, vbD) {
    let vtof = parseFloat(veja_atrums);
    let vt;
    if (localStorage.getItem("kmh") === 'true') {
        vt = `${Math.round(vtof*3.6)} km/h`
    } else {
        vt = `${Math.round(vtof)} m/s`
    }
    vaD.innerHTML = `Vējš: ${vt} ${vv}`;
    let btof = parseFloat(brazmas);
    let bt;
    if (localStorage.getItem("kmh") === 'true') {
        bt = `${Math.round(btof*3.6)} km/h`
    } else {
        bt = `${Math.round(btof)} m/s`
    }
    vbD.innerHTML = `Vējš brāzmās: ${bt}`;
}

function updateBGDisplay() {
  if (localStorage.getItem("bg") === 'true') {
    bgw.style.display = "block";
    document.getElementById("date").style.color = "var(--c0)";
    document.getElementById("time").style.color = "var(--c0)";
    document.getElementById("t").style.color = "var(--c0)";
    document.getElementById("st").style.color = "var(--c0)";
    document.getElementById("status").style.color = "var(--c0)";
  } else {
    bgw.style.display = "none";
    document.getElementById("date").style.color = "var(--c1)";
    document.getElementById("time").style.color = "var(--c1)";
    document.getElementById("t").style.color = "var(--c1)";
    document.getElementById("st").style.color = "var(--c1)";
    document.getElementById("status").style.color = "var(--c1)";
  }
}

function updateClockSize() {
  if (localStorage.getItem("bc") === 'true') {
    if (window.matchMedia("(max-width: 750px) and (max-height: 1280px)").matches) {
      document.getElementById("time").style.fontSize = "15vh";
    } else if (window.matchMedia("(max-width: 1120px) and (max-height: 1280px)").matches){
      document.getElementById("time").style.fontSize = "20vh";
    } else {
      document.getElementById("time").style.fontSize = "30vh";
    }
  } else {
    if (window.matchMedia("(max-width: 750px) and (max-height: 1280px)").matches) {
      document.getElementById("time").style.fontSize = "10vh";
    } else if (window.matchMedia("(max-width: 1120px) and (max-height: 1280px)").matches){
      document.getElementById("time").style.fontSize = "15vh";
    } else {
      document.getElementById("time").style.fontSize = "20vh";
    }
  }
}
window.addEventListener("resize", updateClockSize);
function backgroundShow() {
  updateBGDisplay();
  if (!localStorage.getItem("bg_c")) {
    const div = document.createElement('div');
    div.id = "ch"

    const left = document.createElement('div');
    left.textContent = "ies."
    const center = document.createElement('div');
    center.style.display = "flex"
    const right = document.createElement('div');
    right.textContent = "izs."

    const label = document.createElement('label');
    label.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = localStorage.getItem("bg") === 'true';
    input.addEventListener('change', () => {
      localStorage.setItem('bg', input.checked);
      updateBGDisplay();
    });

    const span = document.createElement('span');
    span.className = 'slider';

    label.appendChild(input);
    label.appendChild(span);

    div.appendChild(left);
    center.appendChild(label);
    div.appendChild(center);
    div.appendChild(right);
    document.getElementById("dropbox").appendChild(div);
  }
  localStorage.setItem('bg_c', true);
}

function setBigClock() {
  updateClockSize();
  if (!localStorage.getItem("bc_c")) {
    const div = document.createElement('div');
    div.id = "bc"

    const left = document.createElement('div');
    left.textContent = "ies."
    const center = document.createElement('div');
    center.style.display = "flex"
    const right = document.createElement('div');
    right.textContent = "izs."

    const label = document.createElement('label');
    label.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = localStorage.getItem("bc") === 'true';
    input.addEventListener('change', () => {
      localStorage.setItem('bc', input.checked);
      updateClockSize();
    });

    const span = document.createElement('span');
    span.className = 'slider';

    label.appendChild(input);
    label.appendChild(span);

    div.appendChild(left);
    center.appendChild(label);
    div.appendChild(center);
    div.appendChild(right);
    document.getElementById("dropbox").appendChild(div);
  }
  localStorage.setItem('bc_c', true);
}

function createSlider(veja_atrums, brazmas, vaD, vbD) {
    const div = document.createElement('div');
    div.id = "ch"

    const left = document.createElement('div');
    left.textContent = "m/s"
    const center = document.createElement('div');
    center.style.display = "flex"
    const right = document.createElement('div');
    right.textContent = "km/h"

    const label = document.createElement('label');
    label.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = localStorage.getItem("kmh") === 'true';
    input.addEventListener('change', () => {
        localStorage.setItem('kmh', input.checked);
        updateSpeedDisplay(veja_atrums, brazmas, vaD, vbD);
    });

    const span = document.createElement('span');
    span.className = 'slider';

    label.appendChild(input);
    label.appendChild(span);

    div.appendChild(left);
    center.appendChild(label);
    div.appendChild(center);
    div.appendChild(right);
    document.getElementById("dropbox").appendChild(div);
}

async function updateWeather(div , test = null) {
    div.innerHTML = "";

    const statusIS = document.createElement('div');
    statusIS.id = "status";
    statusIS.innerHTML = "šobrīd"
    div.appendChild(statusIS);

    const div2 = document.createElement('div');
    div2.id = "tt";
    div2.innerHTML = "";
    div.appendChild(div2);
    document.getElementById("divr").appendChild(div)

    const dH = await loadJSON('https://videscentrs.lvgmc.lv/data/weather_forecast_for_location_hourly?punkts=P52');
    const dD = await loadJSON('https://videscentrs.lvgmc.lv/data/weather_forecast_for_location_daily?punkts=P52');
    if (!dH && !dD) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDateString = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    let closestWeather = dH[0];
    for (const entry of dH) {
        const forecastDate = entry.laiks.slice(0, 8);
        const forecastHour = parseInt(entry.laiks.slice(8, 10), 10);
        if (forecastDate === currentDateString && forecastHour <= currentHour) {
          closestWeather = entry;
        }
    }

    const {
        temperatura, sajutu_temperatura, veja_atrums, nokrisni_1h,
        relativais_mitrums, veja_virziens, brazmas
    } = closestWeather;

    vv = getWindDirection(veja_virziens);

    const tD = document.createElement('div');
    tD.textContent = `${Math.round(temperatura)}°C`;
    tD.id = "t";
    div2.appendChild(tD);

    const stD = document.createElement('div');
    stD.innerHTML = `${Math.round(sajutu_temperatura)}°C`;
    stD.id = "st";
    div2.appendChild(stD);

    backgroundShow();
    setBigClock();

    if (test === 1) {
      console.log('Check')
    }
/*
    const vaD = document.createElement('div');
    div.appendChild(vaD);
    const vbD = document.createElement('div');
    div.appendChild(vbD);
    updateSpeedDisplay(veja_atrums, brazmas, vaD, vbD);
    createSlider(veja_atrums, brazmas, vaD, vbD);
    
    const nD = document.createElement('div');
    let ntof = parseFloat(nokrisni_1h);
    let nis = ntof === 0 ? 0 : ntof.toFixed(1);
    nD.innerHTML = `Nokrišņi: ${nis} mm`;
    nD.id = "n";
    div.appendChild(nD);

    const rmD = document.createElement('div');
    rmD.innerHTML = `Mitrums: ${Math.round(relativais_mitrums)}%`;
    rmD.id = "rm";
    div.appendChild(rmD);
*/
}

function createDate(div, weatherD) {
    const dateD = document.createElement('div');
    dateD.id = "date";
    div.appendChild(dateD);

    const timeD = document.createElement('div');
    timeD.id = "time";
    div.appendChild(timeD);

    setInterval(() => updateTime(timeD, weatherD, dateD), 1000);
    updateTime(timeD, weatherD, dateD);
}

function updateTime(timeD, weatherD, dateD) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeD.textContent = `${hours}:${minutes}:${seconds}`;
    if (minutes === '00' && seconds === '00') {
      updateWeather(weatherD);
    }

    const dayOfWeek = now.toLocaleString('lv-LV', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleString('lv-LV', { month: 'long' });
    dateD.textContent = `${dayOfWeek}, ${day}. ${month}`
}

let menudrop;
function settings() {
  const dropbox = document.getElementById('dropbox');
  const menuclick = document.getElementById('si');
  if (dropbox) {
    dropbox.style.display = 'none';
    menuclick.style.display = 'flex'
    if(menuclick) {
        menuclick.addEventListener('click', function() {
        if (!menudrop) {
          dropbox.style.display = 'flex';
          menudrop = true;
        } else {
          dropbox.style.display = 'none';
          menudrop = false;
        }
        });
    }
  }
}

function start() {
  const divr = document.createElement('div');
  divr.id = "divr";

  const div = document.createElement('div');
  div.id = "dis";
  app.appendChild(div);

  app.appendChild(divr);

  const weatherD = document.createElement('div');
  weatherD.id = "weather";
  //weatherD.style.display = "none";
  divr.appendChild(weatherD);

  createDate(div, weatherD);
  updateWeather(weatherD);
  settings();
}

document.addEventListener("DOMContentLoaded", () => {
    start();
});

function publicUpdate(set = document.getElementById("weather"), test = 1) {
  updateWeather(set, test)
}

window.addEventListener("beforeunload", (event) => {
  localStorage.removeItem("bg_c");
  localStorage.removeItem("bc_c");
});

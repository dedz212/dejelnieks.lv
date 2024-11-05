const app = document.getElementById('app');

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
      case (veja_virziens === 0):
        vv = "D";
        break;
      case (veja_virziens > 0 && veja_virziens < 90):
        vv = "ZD";
        break;
      case (veja_virziens === 90):
        vv = "Z";
        break;
      case (veja_virziens > 90 && veja_virziens < 180):
        vv = "ZR";
        break;
      case (veja_virziens === 180):
        vv = "R";
        break;
      case (veja_virziens > 180 && veja_virziens < 270):
        vv = "DR";
        break;
      case (veja_virziens === 270):
        vv = "D";
        break;
      case (veja_virziens > 270 && veja_virziens < 360):
        vv = "JD";
        break;
      case (veja_virziens === 360):
        vv = "D";
        break;
      default:
        vv = "?";
    }
  
    return vv;
}

function updateSpeedDisplay(veja_atrums, brazmas, vaD, vbD) {
    let vtof = parseFloat(veja_atrums);
    let vis = Math.round(vtof);
    let vt;
    if (localStorage.getItem("kmh") === 'true') {
        vt = `${vis*3.6} km/h`
    } else {
        vt = `${vis} m/s`
    }
    vaD.innerHTML = `Vējš: ${vt} ${vv}`;
    let btof = parseFloat(brazmas);
    let bis = Math.round(btof);
    let bt;
    if (localStorage.getItem("kmh") === 'true') {
        bt = `${bis*3.6} km/h`
    } else {
        bt = `${bis} m/s`
    }
    vbD.innerHTML = `Vējš brāzmās: ${bt} ${vv}`;
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
    app.appendChild(div);
}

async function updateWeather(div, div2) {
    div.innerHTML = "";
    div2.innerHTML = "";
    const dH = await loadJSON('https://videscentrs.lvgmc.lv/data/weather_forecast_for_location_hourly?punkts=P52');
    const dD = await loadJSON('https://videscentrs.lvgmc.lv/data/weather_forecast_for_location_daily?punkts=P52');
    if (!dH && !dD) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDateString = now.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Поиск ближайшего прогноза для текущего часа или самого ближайшего
    let closestWeather = dH[0];
    for (const entry of dH) {
        const forecastDate = entry.laiks.slice(0, 8);
        const forecastHour = parseInt(entry.laiks.slice(8, 10), 10);

        // Сравниваем текущую дату и час с прогнозом
        if (forecastDate === currentDateString && forecastHour <= currentHour) {
        closestWeather = entry;
        }
    }

    // Извлекаем нужные данные для отображения
    const {
        temperatura, sajutu_temperatura, veja_atrums, nokrisni_1h,
        relativais_mitrums, veja_virziens, brazmas
    } = closestWeather;

    vv = getWindDirection(veja_virziens);

    const tD = document.createElement('div');
    tD.innerHTML = `${Math.round(temperatura)}°C`;
    tD.id = "t";
    div2.appendChild(tD);

    const stD = document.createElement('div');
    stD.innerHTML = `Pēc sajūtas: ${Math.round(sajutu_temperatura)}°C`;
    stD.id = "st";
    div.appendChild(stD);

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
}

function createDate(div, weatherD, div2) {
    const dateD = document.createElement('div');
    dateD.id = "date";
    div.appendChild(dateD);

    const timeD = document.createElement('div');
    timeD.id = "time";
    div.appendChild(timeD);

    setInterval(() => updateTime(timeD, weatherD, dateD, div2), 1000);
    updateTime(timeD, weatherD, dateD, div2);
}

function updateTime(timeD, weatherD, dateD, div2) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeD.textContent = `${hours}:${minutes}:${seconds}`;
    if (minutes === '00' && seconds === '00') {
        updateWeather(weatherD, div2);
    }

    const dayOfWeek = now.toLocaleString('lv-LV', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleString('lv-LV', { month: 'long' });
    dateD.textContent = `${dayOfWeek}, ${day}. ${month}`
}

function start() {
    const divr = document.createElement('div');
    divr.id = "divr";

    const div = document.createElement('div');
    div.id = "dis";
    app.appendChild(div);

    const div2 = document.createElement('div');
    div2.id = "tt";
    divr.appendChild(div2);

    app.appendChild(divr);

    const weatherD = document.createElement('div');
    weatherD.id = "weather";
    divr.appendChild(weatherD);

    createDate(div, weatherD, div2);
    updateWeather(weatherD, div2);
}

document.addEventListener("DOMContentLoaded", () => {
    start();
});
const container = document.getElementById('jsoncontent');
let jsonData = [];

// Функция для сохранения данных в localStorage
const saveDataToLocalStorage = () => {
  localStorage.setItem('jsonData', JSON.stringify(jsonData));
};

// Функция для экспорта данных в JSON
const exportDataToJson = () => {
  const exportedData = JSON.stringify({ content: jsonData }, null, 2);
  const blob = new Blob([exportedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exportedData.json';
  a.click();
  URL.revokeObjectURL(url);
};

// Загружаем данные из localStorage, если они есть
const loadDataFromLocalStorage = () => {
  const storedData = localStorage.getItem('jsonData');
  if (storedData) {
    jsonData = JSON.parse(storedData);
  }
};

// Функция для обновления значения и сохранения в localStorage
const updateValue = (item, property, value) => {
  item[property] = value;
  saveDataToLocalStorage();
};

// загружаем данные из файла data.json
fetch('../json/AwShirtModeratedSlogans.json')
  .then(response => response.json())
  .then(data => {
    jsonData = data.content;
    loadDataFromLocalStorage();

    // создаем элементы HTML на основе данных JSON и добавляем их в контейнер
    jsonData.forEach((item) => {
      const div = document.createElement('section');
      const idDiv = document.createElement('div');
      const idLabel = document.createElement('p');
      const idInput = document.createElement('input');
      const isValidDiv = document.createElement('div');
      const isValidLabel = document.createElement('p');
      const isValidInput = document.createElement('input');
      const sloganDiv = document.createElement('div');
      const sloganLabel = document.createElement('p');
      const sloganInput = document.createElement('input');
      const typeDiv = document.createElement('div');
      const typeLabel = document.createElement('p');
      const typeInput = document.createElement('input');
      const usDiv = document.createElement('div');
      const usLabel = document.createElement('p');
      const usInput = document.createElement('input');

      div.appendChild(idDiv);
      div.appendChild(isValidDiv);
      div.appendChild(sloganDiv);
      div.appendChild(typeDiv);
      div.appendChild(usDiv);

      idDiv.appendChild(idLabel);
      idDiv.appendChild(idInput);
      idLabel.innerText = 'id';
      idInput.type = 'text';
      idInput.value = item.id;

      isValidDiv.appendChild(isValidLabel);
      isValidDiv.appendChild(isValidInput);
      isValidLabel.innerText = 'isValid';
      isValidInput.type = 'text';
      isValidInput.value = item.isValid;

      sloganDiv.appendChild(sloganLabel);
      sloganDiv.appendChild(sloganInput);
      sloganLabel.innerText = 'slogan';
      sloganInput.type = 'text';
      sloganInput.value = item.slogan;

      typeDiv.appendChild(typeLabel);
      typeDiv.appendChild(typeInput);
      typeLabel.innerText = 'type';
      typeInput.type = 'text';
      typeInput.value = item.type;

      usDiv.appendChild(usLabel);
      usDiv.appendChild(usInput);
      usLabel.innerText = 'us';
      usInput.type = 'text';
      usInput.value = item.us;

      // Обработчик события изменения значения в input
      idInput.addEventListener('input', (event) => {
        updateValue(item, 'id', event.target.value);
      });

      isValidInput.addEventListener('input', (event) => {
        updateValue(item, 'isValid', event.target.value);
      });

      sloganInput.addEventListener('input', (event) => {
        updateValue(item, 'slogan', event.target.value);
      });

      typeInput.addEventListener('input', (event) => {
        updateValue(item, 'type', event.target.value);
      });

      usInput.addEventListener('input', (event) => {
        updateValue(item, 'us', event.target.value);
      });

      container.appendChild(div);
    });
  })
  .catch(error => console.error(error));

// Добавляем кнопку экспорта данных в JSON
const exportButton = document.getElementById('download-btn');
exportButton.addEventListener('click', exportDataToJson);


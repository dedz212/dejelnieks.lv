const app = document.getElementById('app');


function start() {
  const label = document.createElement('label');
  label.setAttribute('for', 'numberInput');
  label.textContent = 'Введите число:';

  // Создаем input
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'numberInput';
  input.placeholder = 'Введите целое число';

  // Создаем p для результата
  const result = document.createElement('p');
  result.id = 'result';
  app.appendChild(label);
  app.appendChild(input);
  app.appendChild(result);

  set(input, result)

}

document.addEventListener("DOMContentLoaded", () => {
  start();
});

function set(input, result) {
  input.addEventListener("input", () => {
    // Удаляем все символы, кроме цифр
    input.value = input.value.replace(/\D/g, "");

    // Если поле пустое, очищаем результат
    if (!input.value) {
      result.textContent = "";
      return;
    }

    // Преобразуем значение в число
    const value = parseInt(input.value, 10);

    // Рассчитываем количество стаков и остаток
    const stackSize = 64;
    const stacks = Math.floor(value / stackSize); // Полные стаки
    const remainder = value % stackSize;         // Остаток

    // Определяем окончание слова "стак"
    let stackWord = "стак";
    if (stacks > 1 && stacks <= 4) {
      stackWord = "стака";
    } else if (stacks > 4) {
      stackWord = "стаков";
    }

    // Формируем результат
    if (stacks > 0 && remainder === 0) {
      result.textContent = `${stacks} ${stackWord}`;
    } else if (stacks > 0) {
      result.textContent = `${stacks} ${stackWord} и ${remainder} единиц`;
    } else {
      result.textContent = `${remainder} единиц`;
    }
  });
}

window.addEventListener("beforeunload", (event) => {
});

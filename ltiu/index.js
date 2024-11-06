document.getElementById("slesh").addEventListener("input", () => updateFields("prefix"));
document.getElementById("bitmask").addEventListener("input", () => updateFields("bitmask"));
document.getElementById("mask").addEventListener("input", () => updateFields("mask"));
document.getElementById("pc").addEventListener("input", () => updateFields("pc"));
document.getElementById("tikls").addEventListener("input", () => updateFields("tikls"));

function updateFields(fieldType) {
  try {
      let prefix;

      // Определяем префикс в зависимости от поля ввода
      if (fieldType === "prefix") {
          prefix = parseInt(document.getElementById("slesh").value);
      } else if (fieldType === "bitmask") {
          const bitmask = document.getElementById("bitmask").value.replace(/\./g, "");
          prefix = bitmask.split("1").length - 1;
      } else if (fieldType === "mask") {
          const mask = document.getElementById("mask").value.split(".").map(Number);
          prefix = mask.reduce((acc, octet) => acc + octet.toString(2).split("1").length - 1, 0);
      } else if (fieldType === "pc") {
          const hosts = parseInt(document.getElementById("pc").value);
          prefix = 32 - Math.ceil(Math.log2(hosts + 2));
      } else if (fieldType === "tikls") {
          const subnets = parseInt(document.getElementById("tikls").value);
          prefix = Math.floor(Math.log2(subnets));
      }

      // Валидация префикса
      if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        shownhide(true, 1);
        throw new Error("Error");
      }

      // Определяем группу
      let group = "";
      if (prefix >= 8 && prefix <= 15) {
          group = "A";
      } else if (prefix >= 16 && prefix <= 23) {
          group = "B";
      } else if (prefix >= 24 && prefix <= 32) {
          group = "C";
      } else {
          group = "N/A";
      }

      // Расчёт битовой и десятичной маски
      let binaryMask = "1".repeat(prefix) + "0".repeat(32 - prefix);
      let decimalMask = [];
      for (let i = 0; i < 4; i++) {
          let byte = binaryMask.slice(i * 8, (i + 1) * 8);
          decimalMask.push(parseInt(byte, 2));
      }

      // Подсчёт узлов и сетей
      const hostBits = 32 - prefix;
      const availableHosts = Math.pow(2, hostBits) - 2;
      const availableSubnets = Math.pow(2, prefix);

      // Обновление всех полей
      document.getElementById("slesh").value = prefix;
      document.getElementById("bitmask").value = binaryMask.match(/.{1,8}/g).join(".");
      document.getElementById("mask").value = decimalMask.join(".");
      document.getElementById("pc").value = availableHosts >= 0 ? availableHosts : "Error";
      document.getElementById("tikls").value = availableSubnets >= 0 ? availableSubnets : "Error";
      document.getElementById("group").value = group;
      shownhide(false, 1);
  } catch (error) {
      displayError("Error", 1);
      shownhide(true, 1);
  }
}

function displayError(message, is) {
  if(is === 1) {
    document.getElementById("bitmask").placeholder = message;
    document.getElementById("mask").placeholder = message;
    document.getElementById("pc").placeholder = message;
    document.getElementById("tikls").placeholder = message;
    document.getElementById("group").placeholder = message;
  } else if(is === 2){
    document.getElementById("biti").placeholder = message;
    document.getElementById("mask2").placeholder = message;
    document.getElementById("group2").placeholder = message;
  } else if(is === 3){
    document.getElementById("biti_h").placeholder = message;
    document.getElementById("mask_h").placeholder = message;
    document.getElementById("group_h").placeholder = message;
  }
}

function countBits(value) {
  // Считаем количество значащих битов
  return value.toString(2).replace(/^0+/, '').length;
}

function countBitsForLastOctet(ip) {
  let octets = ip.split('.').map(Number);
  let lastNonZeroOctet = 0;

  // Находим последний октет, который не равен 0
  for (let i = octets.length - 1; i >= 0; i--) {
      if (octets[i] !== 0) {
          lastNonZeroOctet = octets[i];
          break;
      }
  }

  return countBits(lastNonZeroOctet);
}

function getBaseMask(ip) {
  let firstOctet = parseInt(ip.split('.')[0], 10);

  // Определяем маску по классу IP-адреса
  if (firstOctet >= 1 && firstOctet <= 126) return '255.0.0.0';   // Класс A
  if (firstOctet >= 128 && firstOctet <= 191) return '255.255.0.0'; // Класс B
  if (firstOctet >= 192 && firstOctet <= 223) return '255.255.255.0'; // Класс C
  return 'N/A';
}

function getIPGroup(ip) {
  let [firstOctet, secondOctet] = ip.split('.').map(octet => parseInt(octet, 10));
  
  // Check for private IP ranges
  if (
    (firstOctet === 10) ||
    (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ||
    (firstOctet === 192 && secondOctet === 168)
  ) {
    return 'Private';
  }
  
  // Determine IP class
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  
  return 'N/A';
}

function calculateFinalMask(ip, bitCount) {
  let baseMask = getBaseMask(ip); // Получаем базовую маску
  let maskArray = baseMask.split('.').map(Number); // Преобразуем маску в массив
  let remainingBits = bitCount; // Количество оставшихся бит

  // Проходим по каждому октету маски, начиная с первого
  for (let i = 0; i < 4; i++) {
      if (maskArray[i] === 255) continue

      // Если остаточные биты больше 0, добавляем их в текущий октет
      if (remainingBits > 0) {
        let bitsToSet = Math.min(remainingBits, 8); // Ограничиваем до 8 бит в октете
        maskArray[i] = (256 - Math.pow(2, 8 - bitsToSet)); // Правильная формула для добавления бит
        remainingBits -= bitsToSet; // Уменьшаем количество оставшихся бит
        console.log(maskArray[i])
      }
      
      // Если биты закончились, прерываем цикл
      if (remainingBits <= 0) break
  }

  // Преобразуем массив маски обратно в строку
  return maskArray.join('.');
}

function calculateIPRanges(ip, finalMask) {
  const maskOctets = finalMask.split('.').map(Number);
  const ipParts = ip.split('.').map(Number);
  let ranges = [];

  // Проверка корректности маски
  if (maskOctets.some(octet => octet < 0 || octet > 255)) {
    return "Nepareiza apakštīkla maska";
  }

  // Находим последний значимый октет
  let significantOctet = maskOctets.findIndex(octet => octet !== 255);
  if (significantOctet === -1) {
    return "Tīkla apakštīkla maska neļauj definēt diapazonus";
  }

  // Вычисляем инкремент и максимальное значение
  const increment = 256 - maskOctets[significantOctet];
  const maxSignificantOctet = 256 - increment;

  // Генерируем диапазоны
  for (let i = 0; i <= maxSignificantOctet; i += increment) {
    let rangeStart = [...ipParts];
    let rangeEnd = [...ipParts];

    rangeStart[significantOctet] = i;
    rangeEnd[significantOctet] = i + increment - 1;

    for (let j = significantOctet + 1; j < 4; j++) {
      rangeStart[j] = 0;
      rangeEnd[j] = 255;
    }

    ranges.push(`${rangeStart.join('.')} - ${rangeEnd.join('.')}`);
  }

  return ranges.join('<br>');
}


document.getElementById('ipa').addEventListener('input', handleInput);
document.getElementById('tikli').addEventListener('input', handleInput);

function handleInput() {
  let ip = document.getElementById('ipa').value;
  let tikli = document.getElementById('tikli').value;

  let bitCount;
  if (tikli) {
      const tikliValue = parseInt(tikli, 10);
      if (tikliValue) {
          bitCount = countBits(tikliValue); // Используем значение Tīkli для битов
      } else {
          displayError("Error", 2);
          shownhide(true, 2);
          return;
      }
  } else {
      if (isValidIP(ip)) {
          bitCount = countBitsForLastOctet(ip); // Считаем биты по IP
      } else {
          displayError("Nepareiza IP adrese", 2);
          shownhide(true, 2);
          return;
      }
  }

  let baseMask = getBaseMask(ip);
  let group = getIPGroup(ip);
  let finalMask = calculateFinalMask(ip, bitCount);
  let ipRanges = calculateIPRanges(ip, finalMask);

  document.getElementById('biti').value = bitCount;
  document.getElementById('mask2').value = finalMask;
  document.getElementById('group2').value = group;
  document.getElementById('ir').innerHTML = ipRanges;
  shownhide(false, 2);
}

function isValidIP(ip) {
  const ipParts = ip.split('.');
  if (ipParts.length !== 4) return false;
  return ipParts.every(part => {
      const num = Number(part);
      return num >= 0 && num <= 255 && String(num) === part;
  });
}

document.getElementById('ipa_h').addEventListener('input', handleInputH);
document.getElementById('datori').addEventListener('input', handleInputH);

function handleInputH() {
  let ip = document.getElementById('ipa_h').value;
  let datori = document.getElementById('datori').value;

  let bitCount;
  if (datori) {
      const datoriValue = parseInt(datori, 10);
      if (datoriValue) {
          bitCount = countBits(datoriValue);
      } else {
          displayError("Error", 3);
          shownhide(true, 3)
          return;
      }
  } else {
      if (isValidIP(ip)) {
          bitCount = countBitsForLastOctet(ip);
      } else {
          displayError("Nepareiza IP adrese", 3);
          shownhide(true, 3)
          return;
      }
  }

  let baseMask = getBaseMask(ip);
  let group = getIPGroup(ip);
  let finalMask = calculateFinalMask2(bitCount);
  let ipRanges = calculateIPRanges(ip, finalMask);

  document.getElementById('biti_h').value = bitCount;
  document.getElementById('mask_h').value = finalMask;
  document.getElementById('group_h').value = group;
  document.getElementById('ir_h').innerHTML = ipRanges;
  shownhide(false, 3)
}

function calculateFinalMask2(hostCount) {
  let networkBits = 32 - hostCount;  // Количество бит для сети

  // Создаем маску как массив из 4 октетов, изначально заполненных нулями
  let maskArray = [0, 0, 0, 0];

  // Заполняем маску единицами слева направо
  for (let i = 0; i < 4; i++) {
      if (networkBits >= 8) {
          maskArray[i] = 255;  // Полный октет из 8 единиц
          networkBits -= 8;  // Уменьшаем количество оставшихся бит для сети
      } else if (networkBits > 0) {
          // Заполняем частичный октет единицами, оставляя справа нули
          maskArray[i] = 256 - Math.pow(2, 8 - networkBits);
          networkBits = 0; // После того как заполнили нужные биты, останавливаем процесс
      } else {
          maskArray[i] = 0;  // Заполняем оставшиеся октеты нулями
      }
  }

  // Преобразуем маску в строку
  return maskArray.join('.');
}

function shownhide(statusis, n) {
  if(statusis === true) {
    if(n === 1) {
      document.getElementById('group1div').style.display = "none";
    }
    else if(n === 2) {
      document.getElementById('mask2div').style.display = "none";
      document.getElementById('biti2div').style.display = "none";
      document.getElementById('group2div').style.display = "none";
      document.getElementById('ir2div').style.display = "none";
    }
    if(n === 3) {
      document.getElementById('mask3div').style.display = "none";
      document.getElementById('biti3div').style.display = "none";
      document.getElementById('group3div').style.display = "none";
      document.getElementById('ir3div').style.display = "none";
    }
  } else {
    if(n === 1) {
      document.getElementById('group1div').style.display = "flex";
    }
    else if(n === 2) {
      document.getElementById('mask2div').style.display = "flex";
      document.getElementById('biti2div').style.display = "flex";
      document.getElementById('group2div').style.display = "flex";
      document.getElementById('ir2div').style.display = "flex";
    }
    else if(n === 3) {
      document.getElementById('mask3div').style.display = "flex";
      document.getElementById('biti3div').style.display = "flex";
      document.getElementById('group3div').style.display = "flex";
      document.getElementById('ir3div').style.display = "flex";
    }
  }
}
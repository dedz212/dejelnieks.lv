// Определяем переменные для хранения ширины, высоты и блоков данных
let width, height;
let blocks = [];

// Обработчик события для подтверждения ширины и высоты
document.getElementById('confirmDimensions').addEventListener('click', function() {
    width = parseInt(document.getElementById('width').value);
    height = parseInt(document.getElementById('height').value);
    showAddBlockButton();
});

// Функция для отображения кнопки добавления блока
function showAddBlockButton() {
    document.getElementById('addBlock').style.display = 'block';
    clearBlocks()
}

// Обработчик события для добавления нового блока
document.getElementById('addBlock').addEventListener('click', function() {
    // Проверяем, что ширина и высота уже установлены
    if (isNaN(width) || isNaN(height)) {
        alert('Please confirm width and height first.');
        return;
    }
    addBlock();
    document.getElementById('exportData').style.display = 'block';
});

// Функция для добавления нового блока
function addBlock() {
    let blockIndex = blocks.length + 1;
    let blockId = `block-${blockIndex}`;
    let haveindividual = document.getElementById('individualDimensions').checked;
    let blockWidth = width;
    let blockHeight = height;
    blocks.push({
        id: blockId,
        utfInputId: `utf${blockIndex}`,
        individual: haveindividual,
        width: blockWidth,
        height: blockHeight,
        data: generateEmptyData(width, height)
    });
    let blockData = blocks[blockIndex - 1].data;

    let blockHtml = `
        <div id="${blockId}" class="block">
            <div class="btop">
                <div>
                    <label for="utf${blockIndex}">UTF-8 Character:</label>
                    <input type="text" id="utf${blockIndex}" class="utf-input">
                </div>
                <div class="wh">
                    ${haveindividual ? `
                        <div class="lr">
                            <label for="width-${blockIndex}">Width:</label>
                            <input type="number" id="width-${blockIndex}" min="1" value="${width}">
                            <label for="height-${blockIndex}">Height:</label>
                            <input type="number" id="height-${blockIndex}" min="1" value="${height}">
                            <button class="sbtn" onclick="confirmIndividualDimensions(${blockIndex})">Confirm</button>
                        </div>` : ''}
                    <div class="lr">
                        <button class="sbtn" onclick="copyTable(${blockIndex})">Copy Table</button>
                        <button class="sbtn" onclick="pasteTable(${blockIndex})">Paste Table</button>
                    </div>
                </div>
            </div>
            <table class="data-table" id="table-${blockIndex}">
                ${generateTableHTML(blockData)}
            </table>
            <button onclick="removeBlock(${blockIndex})">Remove Block</button>
        </div>
    `;

    document.getElementById('blocks').insertAdjacentHTML('beforeend', blockHtml);

    addCellEventHandlers(blockIndex, blockData);

    updateExportButtonVisibility();
}

// Функция для удаления блока
function removeBlock(blockIndex) {
    let blockId = `block-${blockIndex}`;
    let blockElement = document.getElementById(blockId);

    // Удаляем элемент блока из DOM
    blockElement.parentNode.removeChild(blockElement);

    // Удаляем блок из массива blocks
    blocks = blocks.filter(block => block.id !== blockId);

    // Обновляем видимость кнопки "Export Data"
    updateExportButtonVisibility();
}

// Функция для генерации HTML таблицы для блока
function generateTableHTML(blockData) {
        let tableHtml = '';
        for (let i = 0; i < blockData.length; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < blockData[i].length; j++) {
                let cellClass = (blockData[i][j] === 0) ? 'black' : 'white';
                tableHtml += `<td class="cell ${cellClass}"></td>`;
            }
            tableHtml += '</tr>';
        }
        return tableHtml;
}


// Функция для генерации пустых данных для блока
function generateEmptyData(width, height) {
    let data = [];
    for (let i = 0; i < height; i++) {
        data.push(Array(width).fill(1)); // Изначально все клетки белые (1)
    }
    return data;
}

// Функция для переключения цвета клетки и обновления данных блока
/*
function toggleCell(blockIndex, row, col) {
    let cellId = `cell-${blockIndex}-${row}-${col}`;
    let cell = document.getElementById(cellId);
    let block = blocks[blockIndex - 1];

    if (cell.classList.contains('black')) {
        cell.classList.remove('black');
        cell.classList.add('white');
        block.data[row][col] = 1;
    } else {
        cell.classList.remove('white');
        cell.classList.add('black');
        block.data[row][col] = 0;
    }
}
*/

// Обработчик события для экспорта данных
document.getElementById('exportData').addEventListener('click', function() {
    // Проверяем, что хотя бы один блок добавлен
    if (blocks.length === 0) {
        alert('Please add at least one block before exporting data.');
        return;
    }
    exportData();
});


// Функция для экспорта данных
function exportData() {
    // Проверяем, что все блоки имеют указанный UTF-8 символ
    for (let i = 0; i < blocks.length; i++) {
        let utfInput = document.getElementById(blocks[i].utfInputId);
        if (utfInput.value.trim() === '') {
            alert(`Необходимо указать UTF-8 символ для блока ${i + 1}`);
            return;
        }
    }

    let filename = prompt("Введите имя файла (без расширения):");
    if (!filename) {
        alert(`Назовите файл!`);
        return; // Если пользователь отменил ввод имени файла
    }

    // Создаем массив байтов для файла PFT
    let dataView = createPFTFile(width, height, blocks);

    // Создаем Blob из данных
    let blob = new Blob([dataView], {type: 'application/octet-stream'});

    // Создаем ссылку для скачивания файла
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.pft`;
    link.click();
}

const HEADER_SIZE = 0x20; // Начальная позиция после сигнатуры "PTF"
const UTF_DELIMITER_SIZE = 6; // Размер разделителя после HEX символа UTF-8
const BLOCK_DELIMITER_SIZE = 16; // Размер разделителя между блоками

function createPFTFile(width, height, blocks) {
    let blockCount = blocks.length;
    let totalBytes = HEADER_SIZE; // Начальная позиция после сигнатуры "PTF"

    // Вычисляем размер файла
    for (let i = 0; i < blockCount; i++) {
        let block = blocks[i];
        totalBytes += 2; // Размер HEX символа UTF-8 (2 байта для одного символа)
        if (block.individual) {
            totalBytes += 2;
            totalBytes += 2; // Size of width (2 bytes)
            totalBytes += 2; // Size of height (2 bytes)
        } else {
            totalBytes += UTF_DELIMITER_SIZE; // Размер разделителя после HEX символа UTF-8
        }
        totalBytes += width * height; // Размер данных символов
        if (i < blockCount - 1) { // Добавляем 16-байтовый разделитель только между блоками
            totalBytes += BLOCK_DELIMITER_SIZE;
        }
    }

    console.log(`Calculated total bytes: ${totalBytes}`);
    
    let dataView = new DataView(new ArrayBuffer(totalBytes));

    // Устанавливаем сигнатуру "PTF"
    writeString(dataView, 0x00, '46 54 50');

    if (document.getElementById('individualDimensions').checked) {
        dataView.setUint32(0x06, 1, true);
    }

    // Устанавливаем ширину и высоту символа
    dataView.setUint32(0x08, width, true);
    dataView.setUint32(0x0C, height, true);

    let offset = HEADER_SIZE;
    console.log(`Initial offset: ${offset}`);

    // Записываем каждый блок
    for (let i = 0; i < blockCount; i++) {
        let block = blocks[i];
        let utfHex = stringToHex(document.getElementById(block.utfInputId).value);
        console.log(`UTF-8 hex for block ${i}: ${utfHex}`);
        let blockData = block.data;

        // Записываем HEX символ UTF-8
        writeString(dataView, offset, utfHex);
        offset += utfHex.length / 2; // Увеличиваем offset на длину строки HEX в байтах
        console.log(`Offset after writing UTF-8 hex: ${offset}`);

        // Добавляем 6-байтовый разделитель
        for (let j = 0; j < UTF_DELIMITER_SIZE; j++) {
            dataView.setUint8(offset++, 0x00);
        }
        if (block.individual) {
            dataView.setUint32(0x24, width, true);
            dataView.setUint32(0x26, height, true);
        }
        console.log(`Offset after adding UTF delimiter: ${offset}`);

        // Записываем данные о клетках (черные и белые)
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                let value = blockData[row][col];
                dataView.setUint8(offset++, value, true);
            }
        }
        console.log(`Offset after writing block data: ${offset}`);

        // Добавляем 16-байтовый разделитель между блоками
        if (i < blockCount - 1) { // Добавляем разделитель только между блоками
            for (let j = 0; j < BLOCK_DELIMITER_SIZE; j++) {
                dataView.setUint8(offset++, 0x00);
            }
            console.log(`Offset after adding block delimiter: ${offset}`);
        }
    }

    console.log(`Final offset: ${offset}`);
    return dataView;
}

// Вспомогательная функция для записи строки в массив байтов
function writeString(dataView, offset, hexString) {
    hexString = hexString.replace(/\s/g, ''); // Remove any spaces from hexString
    for (let i = 0; i < hexString.length; i += 2) {
        let byte = parseInt(hexString.substr(i, 2), 16);
        dataView.setUint8(offset + i / 2, byte);
    }
}

// Function to convert a string to its hexadecimal representation
function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        hex += charCode.toString(16).toUpperCase().padStart(4, '0');
    }
    return hex;
}

function updateExportButtonVisibility() {
    if (blocks.length > 0) {
        document.getElementById('exportData').style.display = 'block';
    } else {
        document.getElementById('exportData').style.display = 'none';
    }
}

// Обработчик события для импорта данных
document.getElementById('importData').addEventListener('click', function() {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = function(event) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function() {
            importData(reader.result);
        };

        reader.readAsArrayBuffer(file);
    };

    input.click();
});

// Функция для импорта данных из файла .pft
let haveindividual;
function importData(fileData) {
    const dataView = new DataView(fileData);

    // Проверяем сигнатуру "PTF"
    let signature = readString(dataView, 0x00, 3);
    if (signature !== '46 54 50') {
        alert('Неверный формат файла .pft');
        return;
    }
    document.getElementById('addBlock').style.display = 'block';

    if (dataView.getUint16(0x06, true) === 1) {
        haveindividual = true;
        document.getElementById('individualDimensions').checked = true;
    }
    width = dataView.getUint32(0x08, true);
    height = dataView.getUint32(0x0C, true);
    document.getElementById('width').value = width
    document.getElementById('height').value = height

    console.log(`Width: ${width}, Height: ${height}`);

    // Очищаем текущие блоки на странице
    clearBlocks();

    // Читаем блоки из файла .pft
    let offset = HEADER_SIZE;
    while (offset < dataView.byteLength) {
        // Читаем HEX символ UTF-8
        let utfHex = readString(dataView, offset, 2);
        console.log(`UTF-8 HEX: ${utfHex}`);
        offset += 2;

        // Пропускаем разделитель HEX символа UTF-8
        if (haveindividual) {
            offset += 2;
            width = dataView.getUint16(offset, true);
            offset += 2;
            height = dataView.getUint16(offset, true);
            offset += 2;
        } else {
            offset += UTF_DELIMITER_SIZE;
        }

        // Читаем данные о клетках (черные и белые)
        let blockData = [];
        for (let row = 0; row < height; row++) {
            let rowData = [];
            for (let col = 0; col < width; col++) {
                let value = dataView.getUint8(offset++);
                rowData.push(value);
            }
            blockData.push(rowData);
        }

        console.log('Block Data:', blockData);

        // Добавляем блок на страницу
        addImportedBlock(utfHex, blockData, width, height);

        // Пропускаем разделитель между блоками, если он есть
        if (offset < dataView.byteLength) {
            offset += BLOCK_DELIMITER_SIZE;
        }
    }
}

// Функция для добавления импортированного блока на страницу
function addImportedBlock(utfHex, blockData, width, height) {
    let blockIndex = blocks.length + 1;
    let blockId = `block-${blockIndex}`;

    let decodedUTF8 = decodeUTF8Hex(utfHex);

    blocks.push({
        id: blockId,
        utfInputId: `utf${blockIndex}`,
        width: width,
        height: height,
        data: blockData,
        individualDimensions: haveindividual
    });

    let blockHtml = `
        <div id="${blockId}" class="block">
            <div class="btop">
                <div>
                    <label for="utf${blockIndex}">UTF-8 Character:</label>
                    <input type="text" id="utf${blockIndex}" class="utf-input" value="${decodedUTF8}">
                </div>
                <div class="wh">
                    ${haveindividual ? `
                        <div class="lr">
                            <label for="width-${blockIndex}">Width:</label>
                            <input type="number" id="width-${blockIndex}" min="1" value="${width}">
                            <label for="height-${blockIndex}">Height:</label>
                            <input type="number" id="height-${blockIndex}" min="1" value="${height}">
                            <button class="sbtn" onclick="confirmIndividualDimensions(${blockIndex})">Confirm</button>
                        </div>` : ''}
                    <div class="lr">
                        <button class="sbtn" onclick="copyTable(${blockIndex})">Copy Table</button>
                        <button class="sbtn" onclick="pasteTable(${blockIndex})">Paste Table</button>
                    </div>
                </div>
            </div>
            <table class="data-table" id="table-${blockIndex}">
                ${generateTableHTML(blockData)}
            </table>
            <button onclick="removeBlock(${blockIndex})">Remove Block</button>
        </div>
    `;

    document.getElementById('blocks').insertAdjacentHTML('beforeend', blockHtml);

    addCellEventHandlers(blockIndex, blockData);
    updateExportButtonVisibility();
}

// Функция для добавления обработчиков событий для клеток таблицы данных
function addCellEventHandlers(blockIndex, blockData) {
    let table = document.getElementById(`table-${blockIndex}`);
    let isMouseDown = false;

    // Функция для обработки изменений клеток при зажатой кнопке мыши и перемещении
    function handleCellMouseAction(row, col) {
        if (isMouseDown) {
            toggleImportedCell(blockIndex, row, col);
        }
    }

    // Добавляем обработчики событий для клеток таблицы данных
    for (let i = 0; i < blockData.length; i++) {
        for (let j = 0; j < blockData[i].length; j++) {
            let cell = table.rows[i].cells[j];

            // Обработчик для нажатия на клетку
            cell.addEventListener('mousedown', function() {
                isMouseDown = true;
                toggleImportedCell(blockIndex, i, j);
            });

            // Обработчик для движения мыши над клеткой
            cell.addEventListener('mouseover', function() {
                handleCellMouseAction(i, j);
            });
        }
    }

    // Обработчик для отпускания кнопки мыши
    document.addEventListener('mouseup', function() {
        isMouseDown = false;
    });
}

function toggleImportedCell(blockIndex, row, col) {
    let block = blocks[blockIndex - 1];
    let cellValue = block.data[row][col];
    block.data[row][col] = 1 - cellValue; // Переключаем между 0 и 1

    let cell = document.getElementById(`table-${blockIndex}`).rows[row].cells[col];
    cell.classList.toggle('black');
    cell.classList.toggle('white');
}

// Функция для очистки текущих блоков на странице
function clearBlocks() {
    document.getElementById('blocks').innerHTML = '';
    blocks = [];
}

// Вспомогательная функция для чтения строки из DataView
function readString(dataView, offset, length) {
    let hexString = '';
    for (let i = 0; i < length; i++) {
        let byte = dataView.getUint8(offset + i);
        hexString += byte.toString(16).toUpperCase().padStart(2, '0');
        hexString += ' '; // пробел между hex значениями
    }
    return hexString.trim(); // убираем последний пробел
}

// Вспомогательная функция для преобразования HEX в строку UTF-8
function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        let charCode = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(charCode);
    }
    return str;
}

// Функция для декодирования HEX символа UTF-8 в строку с учетом специфики формата
function decodeUTF8Hex(hex) {
    let hexBytes = hex.split(' ');

    let byte1 = hexBytes[0]; // Первый байт
    let byte2 = hexBytes[1]; // Второй байт

    let decodedChar = `&#x${byte1}${byte2}`
    console.log(decodedChar)
    return decodedChar;
}

let copiedTable

// Функция для копирования таблицы из одного блока в другой
function copyTable(sourceBlockIndex) {
    let sourceBlock = blocks[sourceBlockIndex - 1];
    copiedTable = JSON.parse(JSON.stringify(sourceBlock.data)); // Глубокое копирование данных
    console.log('Table copied:', copiedTable);
}

// Функция для вставки скопированной таблицы в текущий блок
function pasteTable(targetBlockIndex) {
    if (!copiedTable) {
        console.log('No table copied.');
        return;
    }

    let targetBlock = blocks[targetBlockIndex - 1];
    targetBlock.data = JSON.parse(JSON.stringify(copiedTable)); // Глубокое копирование данных

    // Обновляем HTML таблицы
    let table = document.getElementById(`table-${targetBlockIndex}`);
    table.innerHTML = generateTableHTML(targetBlock.data);

    // Добавляем обработчики событий для клеток таблицы данных
    addCellEventHandlers(targetBlockIndex, targetBlock.data);
    console.log('Table pasted to Block', targetBlockIndex);
}

function confirmIndividualDimensions(blockIndex) {
    let block = blocks[blockIndex - 1];
    
    let newWidth = parseInt(document.getElementById(`width-${blockIndex}`).value);
    let newHeight = parseInt(document.getElementById(`height-${blockIndex}`).value);
    
    if (isNaN(newWidth) || isNaN(newHeight)) {
        alert('Please enter valid width and height values.');
        return;
    }
    
    // Обновляем данные блока
    block.width = newWidth;
    block.height = newHeight;
    block.data = generateEmptyData(newWidth, newHeight);
    
    // Обновляем HTML таблицу блока
    let table = document.getElementById(`table-${blockIndex}`);
    table.innerHTML = generateTableHTML(block.data);
    
    // Добавляем обработчики событий для клеток таблицы данных
    addCellEventHandlers(blockIndex, block.data);
}

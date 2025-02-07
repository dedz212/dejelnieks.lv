document.addEventListener('DOMContentLoaded', async () => {
    const audio = document.getElementById('audio');
    const subtitleContainer = document.getElementById('subtitles');
    const trackList = document.getElementById('track-list');
    let subtitles = [];

    // Загрузка JSON данных с учетом ошибок
    async function loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка при загрузке: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки JSON:', error);
            return null;
        }
    }

    // Загрузка списка треков
    async function loadTrackList() {
        const data = await loadJSON('list.json');
        if (data) {
            trackList.innerHTML = ''; // Очищаем текущий список
            data.forEach((track, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = track.audio;
                trackList.appendChild(option);
            });
            loadTrack(data[0]);
        } else {
            console.error('Не удалось загрузить список треков');
        }
    }

    // Загрузка выбранного трека и субтитров
    async function loadTrack(track) {
        if (!track) return;
        audio.src = track.audio;
        subtitles = await loadJSON(track.cc) || [];
        console.log('Загружены субтитры:', subtitles);
    }

    // Переключение воспроизведения
    document.getElementById('play-button').addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    // Изменение трека по выбору в выпадающем списке
    trackList.addEventListener('change', async () => {
        const data = await loadJSON('list.json');
        loadTrack(data[trackList.value]);
    });

    // Обновление субтитров в процессе воспроизведения
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime * 1000; // Преобразуем время в миллисекунды
        console.log('Текущее время:', currentTime);
        updateSubtitles(currentTime);
    });

    // Очистка субтитров по окончании трека
    audio.addEventListener('ended', () => {
        console.log('Трек завершен');
        subtitleContainer.innerHTML = ''; // очищаем субтитры по окончании
    });

    // Парсинг времени субтитров из формата SRT
    function parseSRTTime(timeStr) {
        const parts = timeStr.split(/[:|,]/); // Разделяем по двоеточию и запятой
        return (
            parseInt(parts[0]) * 3600000 + 
            parseInt(parts[1]) * 60000 + 
            parseInt(parts[2]) * 1000 + 
            parseInt(parts[3])
        );
    }

    // Обновление отображаемых субтитров
    function updateSubtitles(currentTime) {
        subtitleContainer.innerHTML = ''; // очищаем контейнер перед обновлением
        subtitles.forEach(sub => {
            const start = parseSRTTime(sub.start);
            const end = parseSRTTime(sub.end);
            
            if (currentTime >= start && currentTime <= end) {
                console.log('Отображаем субтитры:', sub.text);
                subtitleContainer.className = "japanese";
                subtitleContainer.appendChild(generateSubtitleHTML(sub));
            }
        });
    }

    /**
     * Функция, которая возвращает аннотированный элемент для слова.
     */
    function processAnnotatedWord(word) {
        const wordContainer = document.createElement('span');
        wordContainer.classList.add('word');
        wordContainer.setAttribute('data-tooltip', `${word.hi} - ${word.ru}`);
        
        // Если есть подробное разбиение (массив e)
        if (word.e && word.e.length > 0) {
            let segIndex = 0;
            const characters = Array.from(word.ja);
            characters.forEach(char => {
                if (segIndex < word.e.length && char === word.e[segIndex].ja) {
                    const rubyElement = document.createElement('ruby');
                    
                    const kanjiElement = document.createElement('span');
                    kanjiElement.classList.add('kanji');
                    kanjiElement.textContent = char;
                    
                    const rtElement = document.createElement('rt');
                    rtElement.textContent = word.e[segIndex].fu;
                    
                    rubyElement.appendChild(kanjiElement);
                    rubyElement.appendChild(rtElement);
                    
                    wordContainer.appendChild(rubyElement);
                    segIndex++;
                } else {
                    // Если символ не аннотируется, добавляем как текст
                    wordContainer.appendChild(document.createTextNode(char));
                }
            });
        } else {
            // Если подробного разбора нет, просто выводим слово целиком
            wordContainer.textContent = word.ja;
        }
        
        return wordContainer;
    }

    /**
     * Основная функция для генерации субтитров.
     * Она использует sub.text как базовую строку и заменяет в ней части, соответствующие
     * аннотированным словам из sub.e, на элементы с ruby и тултипами.
     */
    function generateSubtitleHTML(sub) {
        // Создаем контейнер для всех элементов ruby
        const rubyContainer = document.createElement('div');
        rubyContainer.classList.add('ruby-container'); // для стилизации, если нужно
    
        let pos = 0;
    
        // Проходим по каждому аннотированному слову
        sub.e.forEach(word => {
            // Ищем слово в исходном тексте начиная с pos
            const index = sub.text.indexOf(word.ja, pos);
            if (index === -1) {
                // Если не найдено, просто пропускаем (или можно добавить целиком)
                return;
            }
            // Выводим промежуточный неаннотированный текст (например, の, けど、)
            if (index > pos) {
                const plainText = sub.text.substring(pos, index);
                rubyContainer.appendChild(document.createTextNode(plainText));
            }
            // Выводим аннотированное слово
            const annotatedElem = processAnnotatedWord(word);
            rubyContainer.appendChild(annotatedElem);
            // Обновляем позицию: после обработанного слова
            pos = index + word.ja.length;
        });
        // Выводим остаток текста, если он есть
        if (pos < sub.text.length) {
            const remainder = sub.text.substring(pos);
            rubyContainer.appendChild(document.createTextNode(remainder));
        }
    
        // Создаем отдельный контейнер для перевода
        const translationContainer = document.createElement('div');
        translationContainer.classList.add('translation');
        translationContainer.textContent = sub.ru;
    
        subtitleContainer.appendChild(rubyContainer);
        subtitleContainer.appendChild(translationContainer);
    
        return subtitleContainer;
    }

    // Инициализация
    await loadTrackList();
});

document.addEventListener('DOMContentLoaded', () => {
    const kanjiContainer = document.getElementById('kanji-container');
    const tooltip = document.getElementById('tooltip');

    function createKanjiElement(kanji, details, wordData) {
        const ruby = document.createElement('ruby');
        const span = document.createElement('span');
        span.classList.add('kanji');
        span.textContent = kanji;

        // Добавляем данные для подсказки
        span.setAttribute('data-word', kanji);
        span.setAttribute('data-details', JSON.stringify(details));

        // Добавляем фуригану
        const rt = document.createElement('rt');
        rt.textContent = details.h || '';

        ruby.appendChild(span);
        ruby.appendChild(rt);
        return ruby;
    }

    function generateTooltipContent(enArray) {
        const container = document.createElement('div');
        container.classList.add('container');
        enArray.forEach(entry => {
            if (typeof entry === 'object') {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('tooltip-entry');

                if (entry.h) {
                    const hDiv = document.createElement('div');
                    hDiv.textContent = entry.h;
                    entryDiv.appendChild(hDiv);
                }

                if (entry.kun || entry.on) {
                    const koDiv = document.createElement('div');
                    koDiv.classList.add('ko');

                    if (entry.kun) {
                        const kunDiv = document.createElement('div');
                        kunDiv.textContent = `${entry.kun}`;
                        koDiv.appendChild(kunDiv);
                    }
    
                    if (entry.on) {
                        const onDiv = document.createElement('div');
                        onDiv.textContent = `${entry.on}`;
                        koDiv.appendChild(onDiv);
                    }
                    entryDiv.appendChild(koDiv);
                }

                if (entry.t) {
                    const tDiv = document.createElement('div');
                    tDiv.textContent = entry.t.join(', ');
                    entryDiv.appendChild(tDiv);
                }

                if (entry.type) {
                    const typeDiv = document.createElement('div');

                    entry.type.forEach(typeItem => {
                        const typeSpan = document.createElement('span');
                        typeSpan.textContent = typeItem;
                        typeSpan.classList.add('type-item');
                        typeDiv.appendChild(typeSpan);
                    });
                
                    entryDiv.appendChild(typeDiv);
                }

                container.appendChild(entryDiv);
            }
        });
        return container;
    }

    function loadKanjiData() {
        fetch('list.json')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(word => {
                    const div = document.createElement('div');
                    const wordData = data[word];
                    const rubyElements = [];

                    for (const kanji of word) {
                        if (wordData[kanji]) {
                            rubyElements.push(createKanjiElement(kanji, wordData[kanji], wordData));
                        }
                    }

                    // Добавление кандзи и переводов в контейнер
                    rubyElements.forEach(el => div.appendChild(el));

                    const translation = document.createElement('span');
                    translation.classList.add('translation');
                    translation.textContent = Array.isArray(wordData.en) ? wordData.en.join(', ') : wordData.en;
                    div.appendChild(translation);
                    kanjiContainer.appendChild(div);
                });

                // Обработчик для показа всплывающей подсказки
                document.querySelectorAll('.kanji').forEach(kanji => {
                    kanji.addEventListener('mouseenter', (e) => {
                        const kanjiData = JSON.parse(kanji.getAttribute('data-details'));

                        if (kanjiData && kanjiData.en) {
                            const tooltipContent = generateTooltipContent(kanjiData.en);
                            tooltip.innerHTML = ''; // Очищаем предыдущий контент
                            tooltip.appendChild(tooltipContent);
                        }
                        
                        tooltip.style.display = 'block';
                        const rect = kanji.getBoundingClientRect();
                        tooltip.style.left = `${rect.left + window.scrollX}px`;
                        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                    });

                    kanji.addEventListener('mouseleave', () => {
                        tooltip.style.display = 'none';
                    });
                });
            })
            .catch(error => console.error('Error loading kanji data:', error));
    }

    loadKanjiData();
});

const contentDiv = document.getElementById('content');
fetch('./list.json')
    .then(response => response.json())
    .then(data => {
        for (const phrase in data) {
            if (data.hasOwnProperty(phrase)) {
                const phraseDiv = document.createElement('div');
                phraseDiv.classList.add('phrase');
                
                const words = data[phrase].words;
                const phraseWords = data[phrase].is.split(' ');
                const selectionDiv = document.createElement('div');
                selectionDiv.id = "selection"

                // Создаем маппинг слов и их классов
                const wordClassMapping = {};
                let classIndex = 1;
                for (const word in words) {
                    if (words.hasOwnProperty(word)) {
                        wordClassMapping[word] = `word-${classIndex}`;
                        classIndex++;
                    }
                }

                // Разделяем фразу на слова и создаем span для каждого слова
                phraseWords.forEach(word => {
                    const wordSpan = document.createElement('span');

                    // Присваиваем класс, если слово есть в списке words
                    for (const key in words) {
                        if (words.hasOwnProperty(key) && key === word) {
                            wordSpan.classList.add(wordClassMapping[key]);
                            break;
                        }
                    }

                    wordSpan.textContent = word + ' ';
                    phraseDiv.appendChild(wordSpan);
                });

                selectionDiv.appendChild(phraseDiv);

                const translations = data[phrase].translations;

                for (const lang in translations.word) {
                    if (translations.word.hasOwnProperty(lang)) {
                        const translationDiv = document.createElement('div');
                        translationDiv.classList.add('translation');

                        const wordTranslation = translations.word[lang].split(' ');
                        const actualTranslation = translations.actual[lang];

                        wordTranslation.forEach(word => {
                            const wordSpan = document.createElement('span');

                            // Присваиваем класс, если слово есть в списке words
                            for (const key in words) {
                                if (words.hasOwnProperty(key) && words[key][lang] === word) {
                                    wordSpan.classList.add(wordClassMapping[key]);
                                    break;
                                }
                            }

                            wordSpan.textContent = word + ' ';
                            translationDiv.appendChild(wordSpan);
                        });
                        if (translations.actual[lang]) {
                            const actualSpan = document.createElement('span');
                            actualSpan.textContent = '(' + actualTranslation + ')';
                            translationDiv.appendChild(actualSpan);
                        }

                        selectionDiv.appendChild(translationDiv);
                    }
                }
                contentDiv.appendChild(selectionDiv);
            }
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
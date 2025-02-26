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

// Глобальная переменная для хранения загруженных данных
let termsData = null;

async function initialize() {
    termsData = await loadJSON('terms.json');
    if (!termsData) {
      console.error("Neizdevās ielādēt termina datus.");
      return;
    }

    document.getElementById('searchButton').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value.trim();
        if (query === '') {
            displayResults([], query);
            return;
        }
        const results = searchTerms(query);
        displayResults(results, query);
    });
}

// Функция поиска по JSON данным с приоритетом: lv -> en -> ru
function searchTerms(query) {
    query = query.toLowerCase();
    const results = [];
    termsData.forEach(item => {
        // Проверяем в порядке приоритета
        if (["lv", "en", "ru"].some(lang => 
            ["term", "i"].some(key => {
                const value = item.lang[lang]?.[key];
                if (key === "i" && Array.isArray(value)) {
                    return value.some(i => i.toLowerCase().includes(query));
                }
                return value?.toLowerCase().includes(query);
            })
        )) {
            results.push(item);
        }                      
    });
    return results;
}

// Функция для отображения результатов поиска
function displayResults(results, query) {
    const resultsContainer = document.getElementById('results');
    // Очистка предыдущих результатов
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }

    if (results.length === 0) {
        const noResult = document.createElement('p');
        noResult.textContent = 'Nav datubāzē.';
        resultsContainer.appendChild(noResult);
        return;
    }

    results.forEach(item => {
        const box = document.createElement('div');
        box.classList.add('result-box');

        // Заголовок с выбранным термином
        const title = document.createElement('h2');
        title.classList.add('h1');
        title.textContent =  item.lang.lv.term;
        box.appendChild(title);

        if (item.wiki.text) {
            const w = document.createElement('div');
            w.classList.add('wt');
            w.innerHTML = item.wiki.text;
            box.appendChild(w);
        }

        const nPara = document.createElement('div');
        nPara.classList.add('oPara');
        if (item.lang.lv.i) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "SAISINĀJUMS"
            const ot2Para = document.createElement('div');
            ot2Para.innerHTML = item.lang.lv.i.join('</br>');

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            nPara.appendChild(otPara);
        }
        if (item.lang.lv.bruh) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "NEVĒLAMS"
            const ot2Para = document.createElement('div');
            ot2Para.innerHTML = item.lang.lv.bruh.map(obj => obj.term).join('</br>');

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            nPara.appendChild(otPara);
        }
        if (item.wiki.sources) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "ATSAUCES"
            const ot2Para = document.createElement('div');
            item.wiki.sources.forEach(obj => {
                const link = document.createElement('a');
                link.href = obj.href;
                link.target = "_blank";
            
                const spanDiv = document.createElement('div');
                spanDiv.className = "span";
                spanDiv.textContent = obj.title + " 🔗";
            
                link.appendChild(spanDiv);
                ot2Para.appendChild(link);
            });

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            nPara.appendChild(otPara);
        }
        box.appendChild(nPara);

        const hr = document.createElement('hr');
        box.appendChild(hr);

        const oPara = document.createElement('div');
        oPara.classList.add('oPara');
        if (item.lang.en) {
            const enPara = document.createElement('div');
            enPara.classList.add('Para');
            const en1Para = document.createElement('div');
            en1Para.classList.add('Para1');
            en1Para.innerHTML = "ANGLISKI"
            const en2Para = document.createElement('div');
            en2Para.innerHTML = item.lang.en.term;

            if (item.lang.en.i) {
                en2Para.innerHTML = item.lang.en.term + "</br>" + item.lang.en.i.join('</br>');
            }

            enPara.appendChild(en1Para);
            enPara.appendChild(en2Para);
            oPara.appendChild(enPara);
        }
        if (item.lang.ru) {
            const ruPara = document.createElement('div');
            ruPara.classList.add('Para');
            const ru1Para = document.createElement('div');
            ru1Para.classList.add('Para1');
            ru1Para.innerHTML = "KRIEVISKI"
            const ru2Para = document.createElement('div');
            ru2Para.innerHTML = item.lang.ru.term;

            ruPara.appendChild(ru1Para);
            ruPara.appendChild(ru2Para);
            oPara.appendChild(ruPara);
        }
        box.appendChild(oPara);

        resultsContainer.appendChild(box);
    });
}

// Запуск инициализации после загрузки страницы
document.addEventListener("DOMContentLoaded", initialize);
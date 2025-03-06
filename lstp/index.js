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

    document.getElementById('showAllButton').addEventListener('click', function() {
        displayResults(termsData, '');
    });

    if (window.location.hash) {
        const termId = window.location.hash.substring(1);
        const term = termsData.find(item => item.id === termId);
        if (term) {
            displayResults([term], termId);
        }
    }

    // Отслеживание изменений хеша в URL
    window.addEventListener('hashchange', () => {
        const termId = window.location.hash.substring(1);
        const term = termsData.find(item => item.id === termId);
        if (term) {
            displayResults([term], termId);
        }
    });
}

// Функция поиска по JSON данным с приоритетом: lv -> en -> ru
function searchTerms(query) {
    query = query.toLowerCase();
    const results = [];
    termsData.forEach(item => {
        if (["lv", "en", "ru"].some(lang => 
            ["term", "i"].some(key => {
                const value = item.lang[lang]?.[key];

                if (key === "i" && Array.isArray(value)) {
                    return value.some(i => i.toLowerCase().split(/\s+/).includes(query));
                }

                return value?.toLowerCase().split(/\s+/).includes(query);
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

        const boxleft = document.createElement('div');
        boxleft.classList.add('box-left');

        // Заголовок с выбранным термином
        const title = document.createElement('h2');
        title.classList.add('h1');
        title.textContent =  item.lang.lv.term;
        boxleft.appendChild(title);

        if (item.lang.lv.ps) {
            title.classList.add('ps');

            const ps = document.createElement('div');
            ps.classList.add('ps');
            ps.innerHTML = item.lang.lv.ps;
            boxleft.appendChild(ps);
        }

        if (item.wiki.text) {
            const w = document.createElement('div');
            w.classList.add('wt');
            w.innerHTML = item.wiki.text;
            boxleft.appendChild(w);
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
        if (item.lang.lv.incorrect) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.className = "Para1 red";
            ot1Para.innerHTML = "NEPAREIZS"
            const ot2Para = document.createElement('div');
            ot2Para.style.textDecoration = "line-through";
            ot2Para.innerHTML = item.lang.lv.incorrect.join(', ');

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            nPara.appendChild(otPara);
        }
        if (item.lang.lv.please_use) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "VĒLAMS"
            const ot2Para = document.createElement('div');
            ot2Para.innerHTML = item.lang.lv.please_use.join('</br>');

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
        boxleft.appendChild(nPara);

        const hr = document.createElement('hr');
        boxleft.appendChild(hr);

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
        if (item.lang.ja) {
            const jaPara = document.createElement('div');
            jaPara.classList.add('Para');
            const ja1Para = document.createElement('div');
            ja1Para.classList.add('Para1');
            ja1Para.innerHTML = "JAPĀNISKI"
            const ja2Para = document.createElement('div');
            ja2Para.innerHTML = item.lang.ja.term;

            if (item.lang.ja.i) {
                ja2Para.innerHTML = item.lang.ja.term + "</br>" + item.lang.ja.i.join('</br>');
            }

            jaPara.appendChild(ja1Para);
            jaPara.appendChild(ja2Para);
            oPara.appendChild(jaPara);
        }
        boxleft.appendChild(oPara);

        const hr2 = document.createElement('hr');
        boxleft.appendChild(hr2);

        const oPara2 = document.createElement('div');
        oPara2.classList.add('oPara');
        if (item.category) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "KATEGORIJA"
            const ot2Para = document.createElement('div');
            ot2Para.innerHTML = item.category.join(', ');

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            oPara2.appendChild(otPara);
        }
        if (item.relatedTerms && item.relatedTerms.length > 0) {
            const otPara = document.createElement('div');
            otPara.classList.add('Para');
            const ot1Para = document.createElement('div');
            ot1Para.classList.add('Para1');
            ot1Para.innerHTML = "SKATIES ARĪ"
            const ot2Para = document.createElement('div');
            ot2Para.innerHTML = item.relatedTerms.join(', ');

            otPara.appendChild(ot1Para);
            otPara.appendChild(ot2Para);
            oPara2.appendChild(otPara);
        }
        boxleft.appendChild(oPara2);


        const boxright = document.createElement('div');
        boxright.classList.add('box-right');

        if (item.status) {
            const otPara = document.createElement('div');
            otPara.classList.add('uprightbox');

            item.status.forEach(word => {
                const ot1Para = document.createElement('div');
                ot1Para.classList.add('spantos');
                ot1Para.textContent = word;
        
                otPara.appendChild(ot1Para);
            });

            boxright.appendChild(otPara);
        }

        if (item.image) {
            const img = document.createElement('img');
            img.classList.add('poster');
            img.src = item.image;

            boxright.appendChild(img);
        }

        box.appendChild(boxleft);
        box.appendChild(boxright);

        resultsContainer.appendChild(box);
    });
}

// Запуск инициализации после загрузки страницы
document.addEventListener("DOMContentLoaded", initialize);

function isElementPartiallyVisible(el, visibilityThreshold) {
    var rect = el.getBoundingClientRect();
    var elementHeight = rect.bottom - rect.top;
    var visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    var visibilityRatio = visibleHeight / elementHeight;
    
    return visibilityRatio > visibilityThreshold;
}

function handleScrollAnimation() {
    var triggerElement = document.querySelector('header');
    var animatedElement = document.querySelector('#fixed');
    
    if (isElementPartiallyVisible(triggerElement, 0.2)) {
        animatedElement.style.display = "none";
        triggerElement.style.display = "flex";
    } else {
        animatedElement.style.display = "flex";
    }
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('resize', handleScrollAnimation);
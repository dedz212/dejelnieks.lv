var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "ru";
document.addEventListener("DOMContentLoaded", function () {
    async function initialize() {
        const version = await loadJSON('https://dejelnieks.lv/data.json');
        console.log("Version: " + version);
        console.log('URL: ' + window.location.pathname);
        checkURL();
    }
    
    initialize();
});

async function checkURL() {
    const url = window.location.href;
    const langAEL = ["en", "lv", "ru"];
    if (url.includes(`#`)) {
        for (let lang of langAEL) {
            if (url.includes(`#${lang}`)) {
                setLang(lang);
                return;
            }
        }
    } else {
        if (lang === "en") {
            setLang("ru");
        } else {
            setLang(lang);
        }
        loadArticles(lang);
        const initialActiveButton = languageSelector.querySelector(`button[id=lang-${lang}]`);
        setActiveButton(initialActiveButton);
    }
}
const languageSelector = document.getElementById('language-selector');
const articlesContainer = document.getElementById('articles-container');

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

async function setLang(lang) {
    const langArr = await loadJSON('../assets/langArr.json');
    if (!langArr.hasOwnProperty(lang)) return;
    if (window.hasOwnProperty("localStorage"))
        window.localStorage.setItem("lang", lang);
    for (let key in langArr[lang]) {
        let elem = document.querySelectorAll('[key="' + key + '"]');
        for (var i = 0; i < elem.length; i++) {
            if (elem) {
            elem[i].innerHTML = langArr[lang][key];
            }
        }
    }
    console.log(langArr[lang]['lang']);
    if (lang == "ja") {
        console.log(`?`);
    }
}

async function loadArticles(selectedLang) {
    fetch('articles.json')
        .then(response => response.json())
        .then(articles => {
            articlesContainer.innerHTML = ''; // Очищаем контейнер
            articles.forEach(article => {
                if (selectedLang === 'all' || article.lang === selectedLang) {
                    const articleCard = document.createElement('div');
                    articleCard.classList.add('card');
                    articleCard.setAttribute('data-url', "articles/" + article.url);

                    const articleImage = document.createElement('img');
                    articleImage.src = "articles/" + article.image;
                    articleImage.alt = article.title;

                    const articleTitle = document.createElement('h2');
                    articleTitle.textContent = article.title;

                    const articleDesc = document.createElement('h3');
                    articleDesc.textContent = article.description;

                    articleCard.appendChild(articleImage);
                    articleCard.appendChild(articleTitle);
                    articleCard.appendChild(articleDesc);
                    articlesContainer.appendChild(articleCard);

                    articleCard.addEventListener('click', () => {
                        window.location.href = "articles/" + article.url;
                    });
                }
            });
        })
        .catch(error => console.error('Error loading articles:', error));
}

async function setActiveButton(activeButton) {
    const buttons = languageSelector.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const languages = ['Latviešu', 'Русский'];
    const languageCodes = {
        'Latviešu': 'lv',
        'Русский': 'ru',
    };

    // Создаем список языков
    languages.forEach(language => {
        const button = document.createElement('button');
        button.textContent = language;
        button.id = `lang-${languageCodes[language]}`
        languageSelector.appendChild(button);
        
        button.addEventListener('click', () => {
            const selectedLang = languageCodes[language];
            loadArticles(selectedLang);
            setActiveButton(button);
        });
    });

    const langAEL = ["en", "lv", "ru"];
    langAEL.forEach((lang) => {
    const langElements = document.querySelectorAll(`#lang-${lang}`);
        if (langElements.length > 0) {
        langElements.forEach((element) => {
            element.addEventListener("click", setLang.bind(null, lang));
        });
    }
    });
});

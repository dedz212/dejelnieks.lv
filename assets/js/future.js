var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "en";
var debug = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("debug", debug)) || false;
let content, langArr;
document.addEventListener("DOMContentLoaded", async () => {
    async function initialize() {
        try {
            const version = await loadJSON('https://test.dejelnieks.lv/v');
            if (version === null) {
                window.location.href = "/error.html";
                return;
            }
            console.log("Version: " + version.dejelnieks);
            console.log('URL: ' + window.location.pathname);
            langArr = await loadJSON('/assets/langArr.json');
            content = await loadJSON('/assets/content.json');
            if (window.hasOwnProperty("localStorage"))
                window.localStorage.setItem("debug", debug);
            await checkURL();
            startCreator();
            await setObserver();
            updateCardListStyles();
            setCheckButtons();
        } catch (error) {
            console.error("Error:", error);
            alert(error);
            window.location.href = "/error.html";
        }
    }
    
    initialize();
});

async function checkURL() {
    const url = window.location.href;
    const langAEL = ["en", "lv", "ru", "ja"];
    if (url.includes(`#`)) {
        for (let lang of langAEL) {
            if (url.includes(`#${lang}`)) {
                setLang(lang);
                return;
            }
        }
    } else {
        setLang(lang);
    }
}

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
    langArr = await loadJSON('/assets/langArr.json');
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
    await checkAndDisplayMessage(lang)
}

function startCreator() {
    const app = document.getElementById('app');
    header();
    main();
    footer();
   
    function header() {
        const header = document.createElement('header');
        const logo = document.createElement('div');
        logo.className = 'logo';
        logo.textContent = ":D";

        header.appendChild(logo);
        app.appendChild(header);
    }

    function main() {
        const main = document.createElement('main');
        
        description();
        if(debug === "false") {
            music();
            web();
        }

        function description() {
            const section = document.createElement('section');
            section.id = "description";
            const desc = document.createElement('div');
            desc.className = 'desc';
            desc.setAttribute('key', 'desc');
    
            section.appendChild(desc);
            main.appendChild(section);
        }

        function music() {
            const section = document.createElement('section');
            section.id = "music";
            const title = document.createElement('div');
            title.className = 'hh';
            title.setAttribute('key', 'h_music');
            section.appendChild(title);

            const carousel = document.createElement('div');
            carousel.className = 'music-carousel';

            const left = document.createElement('button');
            left.id = "prev"
            left.className = "carousel-btn"
            left.textContent = "◀️"
            
            const cardlist = document.createElement('div');
            cardlist.id = "musiclist"
            cardlist.className = "cardlist"
            if(cardlist) {
                content.music.forEach(item => {
                    const div = document.createElement('div');
                    div.className = `cn odno`;
        
                    const a = document.createElement('a');
                    a.className = 'tavslaiks';
                    if (item.id) {
                        a.id = item.id;
                    }
                    if (item.href) {
                        a.href = item.href;
                    }
        
                    const divMS = document.createElement('div');
                    divMS.className = `musicstreaming`;
                    for (let key in item.link) {
                        const alink = document.createElement('a');
                        alink.classList.add("adivlink");
                        const image = document.createElement('img');
                        image.className = `ms`;
                        const logos = {
                            spotify: "https://www.svgrepo.com/show/51739/spotify.svg",
                            amazon: "https://www.svgrepo.com/show/332216/amazon.svg",
                            yandex: "https://www.svgrepo.com/show/505111/yandex-music.svg",
                            zvuk: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Zvuk_%28compact_logo%29.svg/2048px-Zvuk_%28compact_logo%29.svg.png",
                            tidal: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tidal-round-black-icon.png",
                            bandcamp: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bandcamp-button-circle-black.svg/1024px-Bandcamp-button-circle-black.svg.png",
                            youtube: "",
                            apple: "https://img.icons8.com/?size=1024&id=xLOU1OLuaHC4&format=png",
                            deezer: "https://cdn-icons-png.flaticon.com/512/5968/5968860.png"
                        };
                        if (logos[key]) {
                            image.src = logos[key];
                        }
                        if (key !== "tidal" && key !== "amazon") {                        
                            alink.appendChild(image);
                            alink.href = item.link[key];
                            divMS.appendChild(alink);
                        }              
                    }
                    
                    const divFace = document.createElement('div');
                    divFace.className = `face ${item.div}`;
        
                    const h1 = document.createElement('h1');
                    h1.className = 'tt';
                    h1.textContent = item.tt;
        
                    const h2 = document.createElement('h2');
                    h2.className = 't';
                    h2.setAttribute('key', item.type);
                    
                    const p = document.createElement('div');
                    p.className = 'rednew';
                    p.setAttribute('key', item.rednew);
        
                    const aclass = document.createElement('p');
                    aclass.className = 'rednew';
                    aclass.textContent = item.rednew;
    
                    if (item.rednew !== "") {
                        div.appendChild(p);
                    }
                    a.appendChild(divMS);
                    a.appendChild(divFace);
                    a.appendChild(h1);
                    a.appendChild(h2);
                    div.appendChild(a);
                    cardlist.appendChild(div);
                });
            }

            const right = document.createElement('button');
            right.id = "next"
            right.className = "carousel-btn"
            right.textContent = "▶️"

            carousel.appendChild(left);
            carousel.appendChild(cardlist);
            carousel.appendChild(right);

            section.appendChild(carousel);
    
            main.appendChild(section);

            initMusic()
            function initMusic() {
                const items = cardlist.querySelectorAll('.cn.odno');
                if (items.length === 0) {
                    console.error('Нет музыкальных элементов для отображения');
                } else {
                    const MOBILE_BREAKPOINT = 768;
                    let currentIndex = 0;
                    
                    // Функция для применения режима карусели
                    function applyCarouselMode() {
                        // Показываем кнопки навигации
                        left.style.display = 'block';
                        right.style.display = 'block';
                        
                        // Скрываем все элементы кроме текущего
                        items.forEach((item, index) => {
                            item.style.display = index === currentIndex ? 'block' : 'none';
                        });
                    }
                    
                    // Функция для применения режима сетки
                    function applyGridMode() {
                        // Скрываем кнопки навигации
                        left.style.display = 'none';
                        right.style.display = 'none';
                        
                        // Показываем все элементы
                        items.forEach(item => {
                            item.style.display = 'block';
                        });
                    }
                    
                    // Функция для проверки и переключения режимов
                    function checkViewportSize() {
                        if (window.innerWidth <= MOBILE_BREAKPOINT) {
                            // Мобильный режим - карусель
                            applyCarouselMode();
                        } else {
                            // Десктопный режим - сетка
                            applyGridMode();
                        }
                    }
                    
                    // Применяем начальное состояние
                    checkViewportSize();
                    
                    // Обработчик для кнопки "вперед"
                    right.addEventListener('click', function() {
                        if (window.innerWidth <= MOBILE_BREAKPOINT) {
                            items[currentIndex].style.display = 'none';
                            currentIndex = (currentIndex + 1) % items.length;
                            items[currentIndex].style.display = 'block';
                        }
                    });
                    
                    // Обработчик для кнопки "назад"
                    left.addEventListener('click', function() {
                        if (window.innerWidth <= MOBILE_BREAKPOINT) {
                            items[currentIndex].style.display = 'none';
                            currentIndex = (currentIndex - 1 + items.length) % items.length;
                            items[currentIndex].style.display = 'block';
                        }
                    });
                    
                    // Слушаем изменения размера окна
                    window.addEventListener('resize', checkViewportSize);
                }
            }
        }

        function web() {
            const section = document.createElement('section');
            section.id = "web";
            const title = document.createElement('div');
            title.className = 'hh';
            title.setAttribute('key', 'h_web');
            section.appendChild(title);

            const carousel = document.createElement('div');
            carousel.className = 'music-carousel';

            const left = document.createElement('button');
            left.id = "prev"
            left.className = "carousel-btn"
            left.textContent = "◀️"

            const cardlist = document.createElement('div');
            cardlist.id = "weblist"
            cardlist.className = "cardlist"
            if(cardlist) {
                content.web.forEach(item => {
                    if (item.hide === true) {
                        return
                    }

                    const divone = document.createElement('div');
                    divone.className = "yeaflex";

                    const div = document.createElement('div');
                    div.className = 'cn dvo';

                    const img = document.createElement('img');
                    img.src = item.img;

                    div.appendChild(img);


                    
                    const div2 = document.createElement('div');
                    div2.className = 'cn_special';
        
                    const a = document.createElement('a');
                    a.href = item.href;
                    
                    const diva = document.createElement('div');
                    diva.className = 'diva';
                    diva.setAttribute('key', "open");

                    const divs = document.createElement('div');
        
                    const h1 = document.createElement('h1');
                    h1.className = 'tt';
                    h1.textContent = item.tt;
        
                    const p = document.createElement('p');
                    p.className = 't';
                    p.setAttribute('key', item.t);
        
                    const pRednew = document.createElement('p');
                    pRednew.className = 'rednew';
                    pRednew.textContent = item.rednew;
        
                    a.appendChild(diva);
                    divs.appendChild(h1);
                    divs.appendChild(p);
                    div2.appendChild(divs);
                    div2.appendChild(a);

                    divone.appendChild(div);
                    divone.appendChild(div2);
                    cardlist.appendChild(divone);
                });
            }

            const right = document.createElement('button');
            right.id = "next"
            right.className = "carousel-btn"
            right.textContent = "▶️"

            carousel.appendChild(left);
            carousel.appendChild(cardlist);
            carousel.appendChild(right);
            
            section.appendChild(carousel);
    
            main.appendChild(section);

            initMusic()
            function initMusic() {
                const items = cardlist.querySelectorAll('.yeaflex');
                if (items.length === 0) {
                    console.error('Нет web элементов для отображения');
                } else {
                    let currentIndex = 0;
                    left.style.display = 'block';
                    right.style.display = 'block';
                    
                    items.forEach((item, index) => {
                        item.style.display = index === currentIndex ? 'flex' : 'none';
                    });
                    
                    // Обработчик для кнопки "вперед"
                    right.addEventListener('click', function() {
                        items[currentIndex].style.display = 'none';
                        currentIndex = (currentIndex + 1) % items.length;
                        items[currentIndex].style.display = 'flex';
                    });
                    
                    // Обработчик для кнопки "назад"
                    left.addEventListener('click', function() {
                        items[currentIndex].style.display = 'none';
                        currentIndex = (currentIndex - 1 + items.length) % items.length;
                        items[currentIndex].style.display = 'flex';
                    });
                }
            }
        }

        app.appendChild(main);
    }

    function footer() {
        const footer = document.createElement('footer');

        const o = document.createElement('div');
        o.className = "o"
        o.textContent = ":D means Dejelnieks";

        const t = document.createElement('div');
        t.className = "t"

        Object.entries(langArr).forEach(([id, data]) => {
            const div = document.createElement("div");
            div.id = `lang-${id}`;
            div.textContent = data.lang;
            div.addEventListener("click", () => setLang(id));
            t.appendChild(div);
        });         

        const bbe = document.createElement('div');
        bbe.id = "bbe"
        const up = document.createElement('div');
        up.id = "up"
        up.textContent = "▲"
        bbe.appendChild(up);
        const down = document.createElement('div');
        down.id = "down"
        down.textContent = "▼"
        bbe.appendChild(down);

//        footer.appendChild(o);
        footer.appendChild(t);
        footer.appendChild(bbe);
        app.appendChild(footer);
    }
}

async function setObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Если элемент стал видимым, добавляем задержку анимации
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index + 1 * 200}ms`;  // Применяем задержку
                
                // Если это элемент с классом .hh, добавляем особый класс для анимации
                if (entry.target.classList.contains('hh')) {
                    entry.target.classList.add('hh-visible');
                } else {
                    entry.target.classList.add('visible');
                }
                
            } else {
                // Если элемент не виден, удаляем задержку
                entry.target.style.animationDelay = '';  // Убираем задержку

                // Убираем особый класс для .hh, когда он не виден
                if (entry.target.classList.contains('hh')) {
                    entry.target.classList.remove('hh-visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, {
        threshold: 0.5,  // Элемент должен быть на 50% видим
    });

    // Получаем все элементы, которые должны быть отслеживаемыми
    const elementsToObserve = document.querySelectorAll('.cn, .hh, .tavslaiks, .cn_special, .diva');
    
    elementsToObserve.forEach((element) => {
        observer.observe(element);
    });
}

const langAEL = ["en", "lv", "ru"];
langAEL.forEach((lang) => {
  const langElements = document.querySelectorAll(`#lang-${lang}`);
    if (langElements.length > 0) {
      langElements.forEach((element) => {
        element.addEventListener("click", setLang.bind(null, lang));
    });
  }
});

// Функция для обновления стилей в зависимости от ширины экрана
function updateCardListStyles() {
    const cardLists = document.querySelectorAll('.cardlist');
    const width = window.innerWidth;
    const height = window.innerHeight;
    cardLists.forEach(cardList => {
        cardList.classList.remove('active-styles');
        if (width <= 950) {
            if (width >= 1024 && height >= 600 && width <= 1280 && height <= 800) return
            cardList.classList.add('active-styles');
        }
    });
}
window.addEventListener('resize', updateCardListStyles);

function setCheckButtons() {
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');

    if (upButton) {
        upButton.addEventListener('click', () => {
            document.querySelector('main').scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        });
    } else {
        console.error('Up button not found');
    }

    if (downButton) {
        downButton.addEventListener('click', () => {
            document.querySelector('main').scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
    } else {
        console.error('Down button not found');
    }
}

async function checkAndDisplayMessage(lang) {
    try {
        const n = await loadJSON('https://test.dejelnieks.lv/n');
        if (n[lang]) {
            const messageContainer = document.getElementById('n');
            messageContainer.innerText =""
            messageContainer.style.position = 'fixed';
            messageContainer.style.top = '1dvh';
            messageContainer.style.right = '1dvh';
            messageContainer.style.padding = '1dvh';
            messageContainer.style.width = '25dvw';
            messageContainer.style.backgroundColor = 'rgba(255, 32, 78, 0.8)';
            messageContainer.style.color = 'white';
            messageContainer.style.borderRadius = '0.5dvh';
            messageContainer.style.fontSize = '2dvh';
            messageContainer.style.zIndex = '1000';
            messageContainer.innerText = n[lang];
            
            const closeButton = document.createElement('button');
            closeButton.innerText = '✖';
            closeButton.style.bottom = '1dvh';
            closeButton.style.right = '1dvh';
            closeButton.style.position = 'absolute';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '1dvh';
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(messageContainer);
            });
            
            messageContainer.appendChild(closeButton);
            document.body.appendChild(messageContainer);
        }
    } catch (error) {
        console.error('Error fetching message:', error);
    }
}
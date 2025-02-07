var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "en";
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
            checkURL();
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
    await checkAndDisplayMessage(lang)
}

async function setObserver() {
    const observer = new IntersectionObserver((entries, observer) => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                delay += 200;
            } else {
                //entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.8
    });

    const cards = document.querySelectorAll('.cn');
    const hh = document.querySelectorAll('.hh');
    cards.forEach(card => {
        observer.observe(card);
    });
    hh.forEach(title => {
        observer.observe(title);
    });
    const tl = document.querySelectorAll('.tavslaiks');
    tl.forEach(t => {
        observer.observe(t);
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

/* CONTENT MAIN */
fetch('./assets/content.json')
	.then(response => response.json())
	.then(data => {
		const musicSection = document.getElementById('musiclist');
        const webSection = document.getElementById('weblist');

        if(musicSection) {
            data.music.forEach(item => {
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
                        youtube: "https://static-00.iconduck.com/assets.00/youtube-music-icon-512x512-tzy5jsl3.png",
                        apple: "https://img.icons8.com/?size=1024&id=xLOU1OLuaHC4&format=png",
                        deezer: "https://cdn-icons-png.flaticon.com/512/5968/5968860.png"
                    };
                    if (logos[key]) {
                        image.src = logos[key];
                    }                    
                    alink.appendChild(image);
                    alink.href = item.link[key];
                    divMS.appendChild(alink);
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
                musicSection.appendChild(div);
            });
        }

        if(webSection) {
            data.web.forEach(item => {
                if (item.hide === true) {
                    return
                }
                const div = document.createElement('div');
                div.className = 'cn dvo';
    
                const a = document.createElement('a');
                a.href = item.href;
    
                const h1 = document.createElement('h1');
                h1.className = 'tt';
                h1.textContent = item.tt;
    
                const p = document.createElement('p');
                p.className = 't';
                p.setAttribute('key', item.t);
    
                const pRednew = document.createElement('p');
                pRednew.className = 'rednew';
                pRednew.textContent = item.rednew;
    
                a.appendChild(h1);
                a.appendChild(p);
                div.appendChild(a);
                webSection.appendChild(div);
            });
        }
	})
	.catch(error => console.error('Error fetching JSON: ', error));


// Функция для обновления стилей в зависимости от ширины экрана
function updateCardListStyles() {
    const cardLists = document.querySelectorAll('.cardlist');
    const width = window.innerWidth;
    const height = window.innerHeight;
    cardLists.forEach(cardList => {
        cardList.classList.remove('active-styles');
        if (width <= 1390) {
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
var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "en";
document.addEventListener("DOMContentLoaded", function () {
    async function initialize() {
        const version = await loadJSON('../data.json');
        console.log("Version: " + version.version);
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
                div.className = `cn`;
    
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
                        tidal: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tidal-round-black-icon.png"
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
                
                const p = document.createElement('p');
                p.className = 'rednew';
                p.textContent = item.rednew;
    
                const aclass = document.createElement('p');
                aclass.className = 'rednew';
                aclass.textContent = item.rednew;
    
                if (item.rednew !== "") {
                    divTavslaiks2.appendChild(p);
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
                div.className = 'cn';
    
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
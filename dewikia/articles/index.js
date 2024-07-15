var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "ru";
document.addEventListener("DOMContentLoaded", function () {
    async function initialize() {
        const version = await loadJSON('https://dejelnieks.lv/data.json');
        console.log("Version: " + version.version);
        console.log('URL: ' + window.location.pathname);
        window.addEventListener('resize', checkWidth);
        checkWidth();
        setLang(lang);
        loadArticleContent()
        loadInfobox()
    }
    
    initialize();
});

const logoLink = document.querySelector('div.logo a');
const menuid = document.getElementById('menu');
const satursid = document.getElementById('article-content');
const infoboxContainer = document.getElementById('infobox');
const articleContentContainer = document.getElementById('article-content');

function checkWidth() {
    if (window.innerWidth < 1111) {
        logoLink.textContent = 'dw';
    } else {
        logoLink.textContent = 'dewikia';
    }
}
var clickedOnMenu = false;
menuid.addEventListener('click', () => {
    if(!clickedOnMenu) {
        satursid.style.display = "flex";
        clickedOnMenu = true;
    } else {
        satursid.style.display = "none";
        clickedOnMenu = false;
    }
});

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
let t_developer, t_ublisher, t_designer,
    t_artist, t_composer, t_engine,
    t_platforms, t_release, t_version,
    t_genre, t_mode;

async function setLang(lang) {
    const langArr = await loadJSON('../infobox.json');
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
    };
    ({
    t_developer, t_ublisher, t_designer,
    t_artist, t_composer, t_engine,
    t_platforms, t_release, t_version,
    t_genre, t_mode
    } = langArr[lang]);
}

function loadInfobox() {
    fetch('infobox.json')
        .then(response => response.json())
        .then(data => {
            infoboxContainer.innerHTML = ''; // Очищаем контейнер

            if (data.title) {
                const title = document.createElement('h2');
                title.textContent = data.title;
                infoboxContainer.appendChild(title);
            }

            if (data.image && data.image.logo) {
                const logo = document.createElement('img');
                logo.src = data.image.logo;
                logo.alt = 'Logo';
                logo.classList.add('logo');
                infoboxContainer.appendChild(logo);
            }

            if (data.image && data.image.poster) {
                const poster = document.createElement('img');
                poster.src = data.image.poster;
                poster.alt = 'Poster';
                poster.classList.add('poster');
                infoboxContainer.appendChild(poster);
            }

            if (data.image && data.image.video) {
                const video = document.createElement('video');
                video.src = data.image.video;
                video.alt = 'Video';
                video.classList.add('video');
                video.setAttribute('autoplay', true);
                video.setAttribute('muted', true);
                video.setAttribute('loop', true);
                infoboxContainer.appendChild(video);
            }

            if (data.developer) {
                const developer = document.createElement('p');
                developer.innerHTML = `<strong>${t_developer}:</strong> ${data.developer}`;
                infoboxContainer.appendChild(developer);
            }

            if (data.publisher) {
                const publisher = document.createElement('p');
                publisher.innerHTML = `<strong>${t_publisher}:</strong> ${data.publisher}`;
                infoboxContainer.appendChild(publisher);
            }

            if (data.designer) {
                const designer = document.createElement('p');
                designer.innerHTML = `<strong>${t_designer}:</strong> ${data.designer}`;
                infoboxContainer.appendChild(designer);
            }

            if (data.artist) {
                const artist = document.createElement('p');
                artist.innerHTML = `<strong>${t_artist}:</strong> ${data.artist}`;
                infoboxContainer.appendChild(artist);
            }

            if (data.composer) {
                const composer = document.createElement('p');
                composer.innerHTML = `<strong>${t_composer}:</strong> ${data.composer}`;
                infoboxContainer.appendChild(composer);
            }

            if (data.engine) {
                const engine = document.createElement('p');
                engine.innerHTML = `<strong>${t_engine}:</strong> ${data.engine}`;
                infoboxContainer.appendChild(engine);
            }

            if (data.platforms && data.platforms.length > 0) {
                const platforms = document.createElement('p');
                platforms.innerHTML = `<strong>${t_platforms}:</strong> ${data.platforms.join(', ')}`;
                infoboxContainer.appendChild(platforms);
            }

            if (data.release) {
                const release = document.createElement('p');
                release.innerHTML = `<strong>${t_release}:</strong> ${data.release}`;
                infoboxContainer.appendChild(release);
            }

            if (data.version) {
                const version = document.createElement('p');
                version.innerHTML = `<strong>${t_version}:</strong> ${data.version}`;
                infoboxContainer.appendChild(version);
            }

            if (data.genre) {
                const genre = document.createElement('p');
                genre.innerHTML = `<strong>${t_genre}:</strong> ${data.genre}`;
                infoboxContainer.appendChild(genre);
            }

            if (data.mode) {
                const mode = document.createElement('p');
                mode.innerHTML = `<strong>${t_mode}:</strong> ${data.mode}`;
                infoboxContainer.appendChild(mode);
            }

            if (data.link.steam) {
                const steam = document.createElement('a');
                steam.classList.add('steam')
                steam.innerHTML = "Steam";
                steam.href = data.link.steam;
                infoboxContainer.appendChild(steam);
            }
        })
        .catch(error => console.error('Error loading infobox:', error));
}

function loadArticleContent() {
    const saturs = document.getElementById('saturs');
    const headings = saturs.querySelectorAll('h1, h2, h3');

    articleContentContainer.innerHTML = ''; // Очищаем контейнер

    headings.forEach(heading => {
        const headingElement = document.createElement('a');
        headingElement.textContent = heading.textContent;
        const headingId = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        headingElement.href = `#${headingId}`;
        var yes = heading.tagName.toLowerCase();
        if (yes === 'h2') {
            headingElement.classList.add('ish2')
        }
        if (yes === 'h3') {
            headingElement.classList.add('ish3')
        }

        articleContentContainer.appendChild(headingElement);
    });
}
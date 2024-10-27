var activediv = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("activediv", activediv)) || "sites";
var liota = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("liota", liota)) || "list";

let stopCreation, stopCreation2, stopCreation3,
yesStopCreation, yesStopCreation2, yesStopCreation3 = false;

document.addEventListener("DOMContentLoaded", function () {
    async function initialize() {
        showLoadingIndicator();
        setListeningButton();
        const version = await loadJSON('https://dejelnieks.lv/data.json');
        console.log("Version: " + version.version);
        console.log('URL: ' + window.location.pathname);
        setActiveButton(document.getElementById(activediv), document.getElementById("hesh"));
        if (activediv === "sites") {
            yesStopCreation2 = true;
            yesStopCreation3 = true;
            await setSites()
        }
        else if (activediv === "comun") {
            yesStopCreation = true;
            yesStopCreation3 = true;
            await setCommunities()
        }
        else if (activediv === "games") {
            yesStopCreation = true;
            yesStopCreation2 = true;
            await setGames()
        }
        glow();
    }
    
    initialize();
});

async function setSites() {
    yesStopCreation = false;
    document.getElementById('filters').innerHTML = '';
    ownerInfoDiv.innerHTML = '';
    container.innerHTML = '';
    stopCreation = false;
    stopCreation2 = true;
    stopCreation3 = true;
    showLoadingIndicator();
    window.localStorage.setItem("activediv", "sites");
    checking();
    async function checking() {
        if (yesStopCreation2 || yesStopCreation3) {
            // await loadFilters();
            await loadSites();
        } else {
            setTimeout(() => {
                checking();
            }, 1000)
        }
    }
}

async function setCommunities() {
    yesStopCreation2 = false;
    document.getElementById('filters').innerHTML = '';
    ownerInfoDiv.innerHTML = '';
    container.innerHTML = '';
    stopCreation = false;
    stopCreation2 = false;
    stopCreation3 = true;
    showLoadingIndicator();
    window.localStorage.setItem("activediv", "comun");
    checking();
    async function checking() {
        if (yesStopCreation || yesStopCreation3) {
            await loadComun();
        } else {
            setTimeout(() => {
                checking();
            }, 1000)
        }
    }
}

async function setGames() {
    yesStopCreation3 = false;
    document.getElementById('filters').innerHTML = '';
    ownerInfoDiv.innerHTML = '';
    container.innerHTML = '';
    stopCreation = true;
    stopCreation2 = true;
    stopCreation3 = false;
    showLoadingIndicator();
    window.localStorage.setItem("activediv", "games");
    checking();
    async function checking() {
        if (yesStopCreation || yesStopCreation2) {
            await loadGames();
        } else {
            setTimeout(() => {
                checking();
            }, 1000)
        }
    }
}

function setActiveButton(activeButton, container) {
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
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
const container = document.getElementById('container');
async function loadSites() {
    const siteData = await loadJSON('sites.json');
    const ownerData = await loadJSON('owners.json');
    const langData = await loadJSON('languages.json');
    const totalSites = siteData.length;

    let processedSites = 0;

    for (const site of siteData) {
        const siteCard = await createSiteCard(site, ownerData, langData);
        if (siteCard) {
            container.appendChild(siteCard);
        }
        processedSites++;
        updateLoadingIndicator(processedSites, totalSites);
    }
    //filterDiv.style.display = 'flex';
    filterDiv.style.display = 'none';
    hideLoadingIndicator();
}

async function loadComun() {
    const ownerData = await loadJSON('owners.json');
    const langData = await loadJSON('languages.json');
    const totalSites = ownerData.length;

    let processedSites = 0;

    for (const owner of ownerData) {
        const ownerCard = await creatComunCard(owner, langData);
        if (ownerCard) {
            container.appendChild(ownerCard);
        }
        processedSites++;
        updateLoadingIndicator(processedSites, totalSites);
    }
    hideLoadingIndicator();
}

function updateLoadingIndicator(processed, total) {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.innerHTML = `Loading... ${processed} / ${total}`;
}

async function filterSites(type, value) {
    const siteData = await loadJSON('sites.json');
    const ownerData = await loadJSON('owners.json');
    const filteredSites = siteData.filter(site => {
        if (type === 'creator') {
            return site.owner === value;
        }
        if (type === 'language') {
            return site.language === value;
        }
        if (type === 'version') {
            const versionParts = site.version.is.split('.');
            if (value === '0-3') {
                return versionParts[0] >= 0 && versionParts[0] <= 3;
            }
            return versionParts[0] === Number(value);
        }
    });

    container.innerHTML = '';
    console.log(`filterSites`)

    for (const site of filteredSites) {
        const siteCard = await createSiteCard(site, ownerData);
        container.appendChild(siteCard);
    }
}

async function loadFilters() {
    const siteData = await loadJSON('sites.json');
    const ownerData = await loadJSON('owners.json');
    const languageData = await loadJSON('languages.json');

    const filtersContainer = document.getElementById('filters');

    const creatorsContainer = document.createElement('div');
    const languagesContainer = document.createElement('div');
    const versionsContainer = document.createElement('div');

    creatorsContainer.id = 'creators';
    languagesContainer.id = 'languages';
    versionsContainer.id = 'versions';

    filtersContainer.appendChild(creatorsContainer);
    filtersContainer.appendChild(languagesContainer);
    filtersContainer.appendChild(versionsContainer);

    const creators = new Set();
    const languages = new Set();

    siteData.forEach(site => {
        if (site.owner) creators.add(site.owner);
        if (site.language) languages.add(site.language);
    });

    const allCreatorsButton = document.createElement('button');
    allCreatorsButton.textContent = 'All Creators';
    allCreatorsButton.classList.add('active');
    allCreatorsButton.addEventListener('click', () => {
        filterByCreator('All');
        setActiveButton(allCreatorsButton, creatorsContainer);
    });
    creatorsContainer.appendChild(allCreatorsButton);

    const allLanguagesButton = document.createElement('button');
    allLanguagesButton.textContent = 'All Languages';
    allLanguagesButton.classList.add('active');
    allLanguagesButton.addEventListener('click', () => {
        filterByLanguage('All');
        setActiveButton(allLanguagesButton, languagesContainer);
    });
    languagesContainer.appendChild(allLanguagesButton);

    const allVersionsButton = document.createElement('button');
    allVersionsButton.textContent = 'All Versions';
    allVersionsButton.classList.add('active');
    allVersionsButton.addEventListener('click', () => {
        filterByVersion('All');
        setActiveButton(allVersionsButton, versionsContainer);
    });
    versionsContainer.appendChild(allVersionsButton);

    ownerData.forEach(owner => {
        if (owner.inlist) {
            const button = document.createElement('button');
            button.textContent = owner.title;
            if (owner.bg) {
                button.style.backgroundColor = owner.bg;
            } else {
                button.style.backgroundColor = "#dfdfdf";
            }
            if (owner.color) {
                button.style.color = owner.color;
            } else {
                button.style.color = "#242611";
            }
            button.addEventListener('click', () => {
                filterByCreator(owner.title, owner.link);
                setActiveButton(button, creatorsContainer);
            });
            creatorsContainer.appendChild(button);
        }
    });

    languageData.forEach(language => {
        if (language.inlist) {
            const button = document.createElement('button');
            button.classList.add('emoji')
            button.textContent = language.unicode/*langauge*/;
            //button.style.backgroundColor = language.bg;
            //button.style.color = language.color;
            button.addEventListener('click', () => {
                filterByLanguage(language.langauge);
                setActiveButton(button, languagesContainer);
            });
            languagesContainer.appendChild(button);
        }
    });

    const versions = ['0-9', '4', '5', 'Unknown', 'Absent'];
    versions.forEach(version => {
        const button = document.createElement('button');
        if (version === 'Unknown' || version === 'Absent') {
            button.textContent = version;
        } else {
            button.textContent = `Version ${version.replace('-', '.')}x`;
        }
        button.addEventListener('click', () => {
            filterByVersion(version);
            setActiveButton(button, versionsContainer);
        });
        versionsContainer.appendChild(button);
    });
}

function filterByCreator(owner, link) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const ownerElement = card.querySelector('.pspan.owner');
        console.log(`Card owner: ${ownerElement ? ownerElement.textContent : 'No owner'}`);
        if (link) {
            if (owner === 'All' || (ownerElement && ownerElement.textContent === link)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        } else {
            if (owner === 'All' || (ownerElement && ownerElement.textContent === owner)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function filterByLanguage(language) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const lang = card.querySelector('.pspan.emoji').getAttribute('data-lang'); // используем data-lang
        if (language === 'All' || lang === language) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterByVersion(versionRange) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const versionText = card.querySelector('.listspan p:last-child').textContent;
        if (versionRange === 'All' || versionText.startsWith(versionRange[0])) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function fetchVersion(url) {
    try {
        const response = await fetch(`https://test.dejelnieks.lv/version?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        console.log('url:', url);
        console.log('Fetched version:', result);
        if (result.version) {
            return result.version;
        } else {
            return 'Version not found';
        }
    } catch (error) {
        console.error('Error fetching version from server:', error);
        return 'Error';
    }
}

async function fetchPack(id) {
    try {
        const response = await fetch(`https://test.dejelnieks.lv/playing?id=${id}`);
        const result = await response.json();
        console.log('id:', id);
        console.log('Fetched pack:', result);
        if (!result) {
            return 'Error';
        }
        return result
    } catch (error) {
        console.error('Error fetching version from server:', error);
        return 'Error';
    }
}

async function createSiteCard(site, ownerd, langis) {
    if (stopCreation) {
        yesStopCreation = true;
        return null;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    const cardcontent = document.createElement('div');
    cardcontent.classList.add('card-content');
    
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('atitle');
    
    if (typeof site.site === 'string') {
        const title = document.createElement('a');
        title.classList.add('atitle');
        title.textContent = site.title;
        title.href = site.site;
        cardcontent.appendChild(title);
    } else if (typeof site.site === 'object') {
        const mainSiteKey = Object.keys(site.site)[0];
        const mainLink = document.createElement('a');
        mainLink.classList.add('atitle');
        titleDiv.classList.add('other');
        const mainspanLink = document.createElement('span');
        mainspanLink.classList.add('atitle');
        mainspanLink.href = site.site[mainSiteKey];
        mainLink.appendChild(mainspanLink);
        mainspanLink.textContent = site.title.split('[')[0].trim();
        titleDiv.classList.add('other');
        titleDiv.appendChild(mainLink);

        if (site.title.includes('[') && site.title.includes(']')) {
            const bracketContent = site.title.split('[')[1].split(']')[0];
            const additionalSites = bracketContent.split(';').map(item => item.trim());

            const bracketSpan = document.createElement('span');
            bracketSpan.textContent = ' [';

            additionalSites.forEach((siteKey, index) => {
                if (site.site[siteKey]) {
                    const siteLink = document.createElement('a');
                    siteLink.classList.add('atitle');
                    siteLink.href = site.site[siteKey];
                    siteLink.textContent = siteKey;

                    bracketSpan.appendChild(siteLink);

                    if (index < additionalSites.length - 1) {
                        bracketSpan.appendChild(document.createTextNode(';'));
                    }
                }
            });

            bracketSpan.appendChild(document.createTextNode(']'));
            titleDiv.appendChild(bracketSpan);
        }
    }
    cardcontent.appendChild(titleDiv);

    const listspan = document.createElement('div');
    listspan.classList.add('listspan');

    const language = document.createElement('p');
    language.classList.add('pspan')
    language.classList.add('emoji')
    language.setAttribute('data-lang', site.language);
    const langInfo = langis.find(l => l.langauge === site.language);
    if (langInfo) {
        language.textContent = langInfo.unicode;
    } else {
        language.textContent = "🇬🇧";
    }
    listspan.appendChild(language);
    
    const owner = document.createElement('p');
    owner.classList.add('pspan')
    owner.classList.add('owner')
    const ownerData = ownerd.find(ow => (ow.link ? ow.link : ow.title) === site.owner);
    if (ownerData && ownerData.bg) {
        owner.style.backgroundColor = ownerData.bg;
    } else {
        owner.style.backgroundColor = "#dfdfdf";
    }
    if (ownerData && ownerData.color) {
        owner.style.color = ownerData.color;
    } else {
        owner.style.color = "#242611";
    }
    owner.textContent = `${site.owner}`;
    owner.addEventListener('click', () => showOwnerInfo(site.owner));
    listspan.appendChild(owner);
    
    const onlineStatus = document.createElement('div');
    var classonoff = site.isonline ? 'online' : 'offline';
    onlineStatus.classList.add('oo')
    onlineStatus.classList.add(classonoff)
    listspan.appendChild(onlineStatus);

    let firstUrl = '';
    if (typeof site.site === 'string') {
        firstUrl = site.site;
    } else if (typeof site.site === 'object') {
        firstUrl = Object.values(site.site)[0];
    }
    
    if ('check' in site.version) {
        const version = document.createElement('p');
        version.classList.add('pspan')
        version.classList.add('version')
        var versionText;
        if (site.version.check === true) {
            versionText = await fetchVersion(firstUrl);
            version.textContent = versionText;
        } else if (site.version.check === false) {
            version.textContent = site.version.is;
        }
        listspan.appendChild(version);
    }

    cardcontent.appendChild(listspan);
    
    if (site.old) {
        const oldiv = document.createElement('a');
        oldiv.href = site.old.site;
        oldiv.classList.add('oldiv')

        const oldTitle = document.createElement('p');
        oldTitle.textContent = site.old.title;
        oldiv.appendChild(oldTitle);
        
        if(site.old.source){
            const oldSource = document.createElement('a');
            oldSource.href = site.old.source;
            oldSource.textContent = '📤';
            oldiv.appendChild(oldSource);
        }
        cardcontent.appendChild(oldiv);
    }

    card.appendChild(cardcontent);
    
    return card;
}

function glow() {
    const updateCursor = ({ x, y }) => {
        document.documentElement.style.setProperty('--x', x)
        document.documentElement.style.setProperty('--y', y)
      }
      
      document.body.addEventListener('pointermove', updateCursor)
}

const loadingDiv = document.getElementById('loading');
const filterDiv = document.getElementById('filters');
function showLoadingIndicator() {
    console.log(activediv);
    loadingDiv.innerHTML = "Loading...";
    loadingDiv.classList.remove("remove")
    loadingDiv.style.display = 'flex';
    filterDiv.style.display = 'none';
    container.style.display = 'none';
}

function hideLoadingIndicator() {
    loadingDiv.classList.add("remove")
    setTimeout(() => {
        loadingDiv.style.display = 'none';
        yesStopCreation = true;
        yesStopCreation2 = true;
        yesStopCreation3 = true;
    }, 1000)
    container.style.display = 'flex';
}

function removeSites() {
    filterDiv.style.display="none";
    container.innerHTML = '';
    console.log(`removeSites`)
}

const ownerInfoDiv = document.getElementById('owner-info');
async function showOwnerInfo(titled) {
    const siteData = await loadJSON('sites.json');
    const ownerData = await loadJSON('owners.json');
    const langData = await loadJSON('languages.json');

    const filteredOwners = ownerData.filter(owner => owner.title === titled || owner.link === titled);
    console.log(filteredOwners)
    const filteredSites = siteData.filter(site => {
        const owner = ownerData.find(owner => owner.title === titled || owner.link === titled);
        return owner.link ? site.owner === owner.link : site.owner === titled;
    });
    console.log(filteredSites)
    if (filteredOwners.length === 0) {
        showOwnerInfo2(titled)
        return;
    }
    removeSites();

    ownerInfoDiv.innerHTML = '';

    if (filteredOwners.length > 0) {
        filteredOwners.forEach(async owner => {
            const intitle = document.createElement('div');
            intitle.classList.add("intitle");
            intitle.style.border = owner.bg || '#f9f9f9';

            const title = document.createElement('h2');
            title.classList.add("atitle")
            title.textContent = owner.title;
            intitle.appendChild(title);

            if (owner.description) {
                const description = document.createElement('p');
                description.classList.add('description')
                description.textContent = owner.description;
                intitle.appendChild(description);
            }

            const iwanthorizon2 = document.createElement('div');
            iwanthorizon2.classList.add("lh")
            if (owner.url) {
                const languageContainer  = document.createElement('div');
                languageContainer.classList.add("pspan")
                languageContainer.classList.add("emoji")
                if (Array.isArray(owner.langauge)) {
                    const languagesText = owner.langauge.map(lang => {
                        const langInfo = langData.find(l => l.langauge === lang);
                        return langInfo ? langInfo.unicode : "🇬🇧";
                    }).join(', ');
                    languageContainer.textContent = languagesText;
                } else {
                    const langInfo = langData.find(l => l.langauge === owner.langauge);
                    languageContainer.textContent = langInfo ? langInfo.unicode : "🇬🇧";
                }
                iwanthorizon2.appendChild(languageContainer);

                if (owner.url.main) {
                    const mainUrl = document.createElement('a');
                    mainUrl.classList.add("pspan")
                    mainUrl.classList.add("link")
                    mainUrl.innerHTML = `Website`;
                    mainUrl.href = owner.url.main
                    iwanthorizon2.appendChild(mainUrl);
                }
        
                if (owner.url.ds) {
                    const discordUrl = document.createElement('a');
                    discordUrl.classList.add("pspan")
                    discordUrl.classList.add("discord")
                    discordUrl.innerHTML = `Discord`;
                    discordUrl.href = owner.url.ds
                    iwanthorizon2.appendChild(discordUrl);
                }

                const goal = document.createElement('p');
                goal.classList.add("pspan")
                goal.classList.add("version")
                goal.textContent = owner.goal;
                iwanthorizon2.appendChild(goal);

                intitle.appendChild(iwanthorizon2);
            }

            ownerInfoDiv.appendChild(intitle);

            const totalSites = filteredSites.length;
            let processedSites = 0;

            for (const site of filteredSites) {
                const siteCard = await createSpecialSiteCard(site);
                if (siteCard) {
                    container.appendChild(siteCard);
                }
                processedSites++;
                updateLoadingIndicator(processedSites, totalSites);
            }
            hideLoadingIndicator();
        });
    }

    ownerInfoDiv.style.display = 'block';
}

async function createSpecialSiteCard(site) {
    if (stopCreation) {
        container.innerHTML = '';
        console.log(`createSpecialSiteCard`)
        return null;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    const cardcontent = document.createElement('div');
    cardcontent.classList.add('card-content');
    
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('atitle');
    
    if (typeof site.site === 'string') {
        const title = document.createElement('a');
        title.classList.add('atitle');
        title.textContent = site.title;
        title.href = site.site;
        cardcontent.appendChild(title);
    } else if (typeof site.site === 'object') {
        const mainSiteKey = Object.keys(site.site)[0];
        const mainLink = document.createElement('a');
        mainLink.classList.add('atitle');
        titleDiv.classList.add('other');
        const mainspanLink = document.createElement('span');
        mainspanLink.classList.add('atitle');
        mainspanLink.href = site.site[mainSiteKey];
        mainLink.appendChild(mainspanLink);
        mainspanLink.textContent = site.title.split('[')[0].trim();
        titleDiv.classList.add('other');
        titleDiv.appendChild(mainLink);

        if (site.title.includes('[') && site.title.includes(']')) {
            const bracketContent = site.title.split('[')[1].split(']')[0];
            const additionalSites = bracketContent.split(';').map(item => item.trim());

            const bracketSpan = document.createElement('span');
            bracketSpan.textContent = ' [';

            additionalSites.forEach((siteKey, index) => {
                if (site.site[siteKey]) {
                    const siteLink = document.createElement('a');
                    siteLink.classList.add('atitle');
                    siteLink.href = site.site[siteKey];
                    siteLink.textContent = siteKey;

                    bracketSpan.appendChild(siteLink);

                    if (index < additionalSites.length - 1) {
                        bracketSpan.appendChild(document.createTextNode(';'));
                    }
                }
            });

            bracketSpan.appendChild(document.createTextNode(']'));
            titleDiv.appendChild(bracketSpan);
        }
    }
    cardcontent.appendChild(titleDiv);

    const listspan = document.createElement('div');
    listspan.classList.add('listspan');
    
    const onlineStatus = document.createElement('div');
    var classonoff = site.isonline ? 'online' : 'offline';
    onlineStatus.classList.add('oo')
    onlineStatus.classList.add(classonoff)
    listspan.appendChild(onlineStatus);

    let firstUrl = '';
    if (typeof site.site === 'string') {
        firstUrl = site.site;
    } else if (typeof site.site === 'object') {
        firstUrl = Object.values(site.site)[0];
    }
    
    if ('check' in site.version) {
        const version = document.createElement('p');
        version.classList.add('pspan')
        version.classList.add('version')
        var versionText;
        if (site.version.check === true) {
            versionText = await fetchVersion(firstUrl);
            version.textContent = versionText;
        } else if (site.version.check === false) {
            version.textContent = site.version.is;
        }
        listspan.appendChild(version);
    }

    cardcontent.appendChild(listspan);
    
    if (site.old) {
        const oldiv = document.createElement('a');
        oldiv.classList.add('oldiv')

        const oldTitle = document.createElement('p');
        oldTitle.textContent = `${site.old.title}`;
        oldTitle.href = site.old.site;
        oldiv.appendChild(oldTitle);
        
        const oldSource = document.createElement('a');
        oldSource.href = site.old.source;
        oldSource.textContent = '📤';
        oldiv.appendChild(oldSource);
        cardcontent.appendChild(oldiv);
    }

    card.appendChild(cardcontent);
    
    return card;
}

async function showOwnerInfo2(titled) {
    console.log('a')
    removeSites();
    ownerInfoDiv.innerHTML = '';

    const intitle = document.createElement('div');
    intitle.classList.add("intitle");
    intitle.style.border = `#00000000`;

    const title = document.createElement('h2');
    title.classList.add("atitle")
    title.textContent = titled;
    intitle.appendChild(title);

    ownerInfoDiv.appendChild(intitle);

    const siteData = await loadJSON('sites.json');
    console.log(siteData)
    const filteredSites = siteData.filter(site => site.owner === titled);
    console.log(filteredSites)
    if (filteredSites.length > 0) {
        for (const site of filteredSites) {
            const siteCard = await createSpecialSiteCard(site);
            if (siteCard) {
                container.appendChild(siteCard);
            }
        }
    }
    hideLoadingIndicator();
    ownerInfoDiv.style.display = 'block';
}

function setListeningButton() {
    async function handleButtonClick(event) {
        const action = event.target.dataset.action;
        if (typeof window[action] === 'function') {
            setActiveButton(event.target, document.getElementById("hesh"));
            await window[action]();
        }
    }
    
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

async function creatComunCard(ownerd, langis) {
    if (stopCreation2) {
        container.innerHTML = '';
        console.log(`creatComunCard`)
        yesStopCreation2 = true;
        return null;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    const cardcontent = document.createElement('div');
    cardcontent.classList.add('card-content');

    const title = document.createElement('a');
    title.classList.add('atitle');
    title.textContent = ownerd.title;
    title.addEventListener('click', () => showOwnerInfo(ownerd.title));
    cardcontent.appendChild(title);

    const listspan = document.createElement('div');
    listspan.classList.add('listspan');

    const language = document.createElement('p');
    language.classList.add('pspan')
    language.classList.add('emoji')
    language.setAttribute('data-lang', ownerd.language);
    const langInfo = langis.find(l => l.langauge === ownerd.language);
    if (langInfo) {
        language.textContent = langInfo.unicode;
    } else {
        language.textContent = "🇬🇧";
    }
    listspan.appendChild(language);

    card.appendChild(cardcontent);
    
    return card;
}

async function loadGames() {
    const packsData = await loadJSON('packs.json');
    const totalSites = packsData.length;

    let processedSites = 0;

    for (const pack of packsData) {
        if (pack.id) {
            const packsData = await creatGamesCard(pack);
            if (packsData) {
                container.appendChild(packsData);
            }
            processedSites++;
            updateLoadingIndicator(processedSites, totalSites);
        }
    }
    hideLoadingIndicator();
}

async function creatGamesCard(packs) {
    if (stopCreation3) {
        yesStopCreation3 = true;
        return null;
    }
    const card = document.createElement('div');
    card.classList.add('card');
    const cardcontent = document.createElement('div');
    cardcontent.classList.add('card-content');

    const title = document.createElement('a');
    title.classList.add('atitle');
    title.textContent = packs.title;
    cardcontent.appendChild(title);

    const listspan = document.createElement('div');
    listspan.classList.add('listspan');
    listspan.classList.add('k');
    //var packinfo = await fetchPack(packs.id);

    const prnid = document.createElement('div');
    prnid.classList.add('prnid');
    const num_prn = document.createElement('p');
    num_prn.classList.add('num_prn');
    //num_prn.innerHTML = packinfo.online.prn.value;

    const t_prn = document.createElement('p');
    t_prn.classList.add('t_prn');
    //t_prn.innerHTML = packinfo.online.prn.desc;

    prnid.appendChild(num_prn);
    prnid.appendChild(t_prn);

    const hpid = document.createElement('div');
    hpid.classList.add('prnid');
    const num_hp = document.createElement('p');
    num_hp.classList.add('num_prn');
    //num_hp.innerHTML = packinfo.online.hp.value;

    const t_hp = document.createElement('p');
    t_hp.classList.add('t_prn');
    //t_hp.innerHTML = packinfo.online.hp.desc;

    hpid.appendChild(num_hp);
    hpid.appendChild(t_hp);

    const atpid = document.createElement('div');
    atpid.classList.add('prnid');
    const num_atp = document.createElement('p');
    num_atp.classList.add('num_prn');
    //num_atp.innerHTML = packinfo.online.atp.value;

    const t_atp = document.createElement('p');
    t_atp.classList.add('t_prn');
    //t_atp.innerHTML = packinfo.online.atp.desc;

    atpid.appendChild(num_atp);
    atpid.appendChild(t_atp);

    listspan.appendChild(prnid);
    listspan.appendChild(hpid);
    listspan.appendChild(atpid);

    cardcontent.appendChild(listspan);

    if (packs.games) {
        for (const game of packs.games) {
            const gamelink = document.createElement('a');
            gamelink.classList.add('oldiv')
    
            const gameTitle = document.createElement('p');
            gameTitle.textContent = `${game.title}`;
            gamelink.appendChild(gameTitle);
            
            const gamePlay = document.createElement('a');
            gamePlay.href = startTheGame(packs.id,game.codename);
            gamePlay.textContent = '📤';
            gamelink.appendChild(gamePlay);
            cardcontent.appendChild(gamelink);
        }
    }

    card.appendChild(cardcontent);
    
    return card;
}

function startTheGame(id,codename) {
    return `steam://run/${id}// -launchTo games%2F${codename}%2F${codename}.swf -jbg.config isBundle=false`;
}
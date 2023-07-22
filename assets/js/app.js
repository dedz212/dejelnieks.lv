// CONF

"use strict";


// FOOTER

if (document.querySelector('footer')) {
	const div = document.createElement('div');
	const ul = document.createElement('ul');

	function createNavbar() {

		const link1 = document.createElement('a');
		link1.href = './index.html';
		link1.className = 'l';
		link1.textContent = ':DEJELNIEKS';


		const li1 = document.createElement('li');
		li1.className = 'centerli';
		li1.appendChild(link1);


		const lbtn = document.createElement('a');
		lbtn.id = 'lbtn';
		lbtn.innerHTML = '🌐';
		lbtn.className = 'toggle toggle-lang';

		const lbtnli = document.createElement('li');
		lbtnli.className = 'centerli';
		lbtnli.appendChild(lbtn);

		
		const en = document.createElement('a');
		en.id = 'lang-en';
		en.textContent = 'English';

		const lv = document.createElement('a');
		lv.id = 'lang-lv';
		lv.textContent = 'Latviešu';


		const divlang = document.createElement('div');
		divlang.className = 'dropdown-content';
		divlang.appendChild(en);
		divlang.appendChild(lv);


		const tct = document.createElement('a');
		tct.id = 'tct';
		tct.className = 'toggle toggle-theme';

		const tctli = document.createElement('li');
		tctli.className = 'centerli';
		tctli.appendChild(tct);

		div.appendChild(divlang);
		div.appendChild(lbtnli);
		div.appendChild(tctli);

		ul.appendChild(li1);
		ul.appendChild(div);

		return ul;

	}

	const navbar = createNavbar();
	document.querySelector('footer').appendChild(navbar);
}



// TCT

const tct = document.querySelectorAll("#tct");

tct.forEach(function(tct) {
	if (tct) {
		function ladtheme() {
			const toggleTheme = document.querySelectorAll('.toggle-theme')
			console.log('.toggle-theme is found!')
			let el = document.documentElement
			console.log('tct atrasts!')

			for (var i = 0; i < toggleTheme.length; i++) {
				toggleTheme[i].addEventListener('click', function() {
					console.log('nospiedis');
					if (el.hasAttribute('data-theme')) {
						el.removeAttribute('data-theme');
						console.log('The light theme has been turned on!');
						//x.classList.remove("lang-toggleladoff");
						//x.classList.add("lang-toggleladon");
						tct.innerHTML = '🌛';
						localStorage.removeItem('theme');
						console.log('Item removed from local storage');
					} else {
						el.setAttribute('data-theme', 'dark');
						console.log('The dark theme has been turned on!');
						//x.classList.remove("lang-toggleladon");
						//x.classList.add("lang-toggleladoff");
						tct.innerHTML = '🌞';
						localStorage.setItem('theme', 'dark');
						console.log('Item added in local storage');
					}
				})
			}

			if (localStorage.getItem('theme') !== null) {
				el.setAttribute('data-theme', 'dark');
				//x.classList.add("lang-toggleladoff");
				tct.innerHTML = '🌞';
			} else {
				//x.classList.add("lang-toggleladon");
				tct.innerHTML = '🌛';
			}
		}
		ladtheme()
		console.log('LAD working!');
	} else {
		alert('LAD not working');
	}
});



// LANGUAGE

const langArr = {
	en: {
		home: "HOME",
		game: "GAME",
		about: "ABOUT",
		h1g: "MY SITES",
		h2ss: "I MAKE WEBSITES",
		h3ss: "I MAKE MUSIC",
		h4ss: "I'M",
		pjack: "Is the site for choosing the controller Estonian, Latvian and Lithuanian language of fun games from Jackbox Games!",
		pydkj: "Is the site where everything related to You Don't Know Jack (almost everything) is stored!",

		hello: "Tetrahedron [he/him]",
		desc: `
		I'm Dejelnieks just call me Dale, also known online as Tere-Zander.
		I'm an 18 year old student living in Latvia.
		I'm a music lover (melomaniac), I like all genres of songs!
		I also study languages such as English, Latvian, Russian and Japanese.
		I also watch anime. You can see my list <a id=\"la\" href=\"https://shikimori.me/%E3%83%87%E3%82%A4%E3%83%AB\">here</a>.
		I'm not a gamer. But from games, I play Minecraft and Jackbox.
		I'm doing a little bit of programming, I've already created a website <a id=\"la\" href=\"https://ydkjarchive.com\">YDKJ Archive</a>.
		And... I also make  <a id=\"la\" href=\"https://open.spotify.com/artist/0eOFofZ6rGQc9AjR7zWLdw\">tracks</a>.
		`,
		language: "English",
		game_start: "START",
		game_settings: "SETTINGS",
		game_back: "BACK",

		settings_size: "Screen Size",

		back: "◄ＢＡＣＫ",
	},
	lv: {
		home: "MĀJĀSLAPA",
		game: "SPĒLE",
		about: "PAR MANI",
		h1g: "MANAS SAITES",
		h2ss: "ES VEIDOJU VIETNES",
		h3ss: "ES TAISU MŪZIKU",
		pjack: "Ir vietne, kur izvēlēties kontrolieris igauņu, latviešu un lietuviešu valodā jautras spēles no Jackbox Games!",
		pydkj: "Ir vietne, kurā glabājas viss, kas saistīts ar You Don't Know Jack (gandrīz viss)!",

		hello: " ",
		desc: `
		Es esmu Dejelnieks, sauciet mani vienkārši Dejl, internetā pazīstams arī kā Tere-Zander.
		Esmu 18 gadus vecs students, dzīvoju Latvijā.
		Esmu melomāns, man patīk visas žanru dziesmas!
		Tāpat es mācos valodas, tādi kā: angļu, latviešu, krievu un japāņu.
		Es arī skatos anime. Tu vari apskatīt manu sarakstu <a id=\"la\" href=\"https://shikimori.me/%E3%83%87%E3%82%A4%E3%83%AB\">šeit</a>.
		Es neesmu spēlētājs. Taču no spēlēm es spēlēju Minecraft un Jackbox.
		Es mazliet nodarbojos ar programmēšanu, esmu jau izveidojis tīmekļa vietni <a id=\"la\" href=\"https://ydkjarchive.com\">YDKJ Archive</a>.
		Un... Es arī veidoju <a id=\"la\" href=\"https://open.spotify.com/artist/0eOFofZ6rGQc9AjR7zWLdw\">skaņdarbus</a>.
		`,

		language: "Latviešu",
		game_start: "SĀKT",
		game_settings: "IESTATĪJUMI",
		game_back: "ATPAKAĻ",

		settings_size: "Ekrāna lielums",
	},
};

const langEn = document.querySelector("#lang-en");
const langLv = document.querySelector("#lang-lv");

const prevLangButton = document.querySelector(".prev");
const nextLangButton = document.querySelector(".next");

let currentLangIndex = 0;
let langs = Object.keys(langArr);

if (langEn) {
	langEn.addEventListener("click", setLang.bind(null, "en"));
}
if (langLv) {
	langLv.addEventListener("click", setLang.bind(null, "lv"));
}

const langSelect = document.querySelector(".selection");
if (langSelect) {
	langSelect.addEventListener("change", function() {
	const selectedLang = langSelect.value;
	setLang(selectedLang);
	});

	// Устанавливаем значение для select, соответствующее текущему языку
	if (window.localStorage && window.localStorage.getItem("lang")) {
	const currentLang = window.localStorage.getItem("lang");
	langSelect.value = currentLang;
	}
}

function setLang(lang) {
	if (!langArr.hasOwnProperty(lang)) return;
	if (window.hasOwnProperty("localStorage"))
		window.localStorage.setItem("lang", lang);
	if (langSelect) {
		langSelect.querySelector(`option[value='${lang}']`).selected = true;
	}
	for (let key in langArr[lang]) {
		let elem = document.querySelectorAll(".lang-" + key);
		for (var i = 0; i < elem.length; i++) {
			if (elem) {
				elem[i].innerHTML = langArr[lang][key];
			}
		}
	}
	if (lang == "en") {
		console.log("English");
	}
	if (lang == "lv") {
		console.log("Latviešu");
	}
}

var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "en";
setLang(lang);



// BINJPIPE
if (document.querySelector('header')) {
	const container = document.querySelector('.center');

	if (container) {
		const text = document.getElementById('random-text');

		let specialTexts = {
			"14-02": {
				en: "Happy Valentine's Day!",
				ru: "С Днем Валентина!",
				lv: "Priecīgus Sv. Valentīna dienu!"
			},
			"18-11": {
				lv: "Priecīgus Neatkarības dienu!"
			},
			"25-12": {
				en: "Merry Christmas!",
				ru: "С Рождеством!",
				lv: "Priecīgus Ziemassvētkus!"
			}
		};

		let texts = {
			en: [
				"Welcome to the website!",
				"guess who's sick ;p"
			],
			ru: [
				"Добро пожаловать на сайт!",
				"Ы"
			],
			lv: [
				"Laipni lūdzam mājaslapā!",
				"70% kas zinu"
			]
		};

		let randomIndex = Math.floor(Math.random() * texts[lang].length);
		let randomText = texts[lang][randomIndex];

		function getSpecialText() {
			let today = new Date();
			let month = (today.getMonth() + 1).toString().padStart(2, "0");
			let day = today.getDate().toString().padStart(2, "0");
			let currentDate = `${day}-${month}`;
			return specialTexts[currentDate]?.[lang] || randomText;
		}
		text.innerHTML = getSpecialText();

		if (text.offsetWidth > container.offsetWidth) {
			text.classList.add('marquee');
		}
	}
}


// POPUP

const popup = document.getElementById("popup");
/*
    if(popup) {
    popup.insertAdjacentHTML('beforeend', `
    <div id="modal" class="bg modal modal-transition-leave">
        <div class="bg content">
            <div class="popupup">
            <p>SETTINGS</p>
            <div class="actions"><p>ОК</p></div>
            </div>
            <div class="popuplist">
                <ul class="name">
                    <li>Language</li>
                    <li>Size</li>
                </ul>
                <ul class="value">
                    <li class="langli">
                        <button class="arrow arrow-left" onclick="switchLang(-1)">&#8249;</button>
                        <p class="lang-language">English</p>
                        <button class="arrow arrow-right" onclick="switchLang(1)">&#8250;</button>
                    </li>
                    <li class="controls">
                        <button class="prev">Prev</button>
                        <button class="next">Next</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `);
    console.log('tiek izmantots popup.css');
    };
*/
if (popup) {
	let popupBg = document.querySelector('.modal');
	let popupContent = document.querySelector('.content');
	let openPopupButtons = document.querySelectorAll('.open-popup');
	let closePopupButton = document.querySelector('.actions');

	openPopupButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			popupBg.classList.add('active');
			popupContent.classList.add('active');
		})
	});

	closePopupButton.addEventListener('click', () => {
		popupBg.classList.remove('active');
		popupContent.classList.remove('active');
	});

	document.addEventListener('click', (e) => {
		if (e.target === popupBg) {
			popupBg.classList.remove('active');
			popupContent.classList.remove('active');
		}
	});
}



// KEY EVENT
const liItems = document.querySelectorAll('li.h');
let liActiveIndex = 0;
let liHoverTimeout;

function setLiActive(index) {
	liItems[liActiveIndex].classList.remove('active', 'hover');
	liItems[index].classList.add('active');
	liActiveIndex = index;
}

const ulItems = document.querySelectorAll('ul.se');
let ulActiveIndex = 0;
let ulHoverTimeout;

function setUlActive(index) {
	ulItems[ulActiveIndex].classList.remove('active', 'hover');
	ulItems[index].classList.add('active');
	ulActiveIndex = index;
}

document.addEventListener('keydown', function(event) {
	const popup = document.querySelector('.bg.content.active');
	const themeToggle = document.querySelector('#themetoggle');
	const butnMenu = document.querySelector('ul.se.active#tobuttpn');
	if (popup && event.key === 'ArrowUp') {
		const newIndex = ulActiveIndex === 0 ? ulItems.length - 1 : ulActiveIndex - 1;
		setUlActive(newIndex);
	} else if (popup && event.key === 'ArrowDown') {
		const newIndex = ulActiveIndex === ulItems.length - 1 ? 0 : ulActiveIndex + 1;
		setUlActive(newIndex);
	} else if (event.key === 'ArrowUp') {
		const newIndex = liActiveIndex === 0 ? liItems.length - 1 : liActiveIndex - 1;
		setLiActive(newIndex);
	} else if (event.key === 'ArrowDown') {
		const newIndex = liActiveIndex === liItems.length - 1 ? 0 : liActiveIndex + 1;
		setLiActive(newIndex);
	} else if (popup && themeToggle && event.key === 'Enter' && document.querySelector('#themetoggle').classList.contains('active')) {
		document.querySelector('#tct').click();
	} else if (butnMenu && event.key === 'ArrowLeft') {
		const buttonPrev = butnMenu.querySelector(`button[data-key="prev"]`);
		buttonPrev.click();
	  } else if (butnMenu && event.key === 'ArrowRight') {
		const buttonNext = butnMenu.querySelector(`button[data-key="next"]`);;
		buttonNext.click();
	  }else if (!popup && event.key === 'Enter') {
		liItems[liActiveIndex].click();
	}
});

liItems.forEach(function(item, index) {
	item.addEventListener('mouseenter', function() {
		const popup = document.querySelector('.bg.content.active');
		if (popup && index !== ulActiveIndex) {
			ulItems[ulActiveIndex].classList.remove('active', 'hover');
			if (!item.classList.contains('open-popup')) {
				item.classList.add('hover');
			}
			setUlActive(index);
		} else if (!popup && index !== liActiveIndex) {
			liItems[liActiveIndex].classList.remove('active', 'hover');
			if (!item.classList.contains('open-popup')) {
				item.classList.add('hover');
			}
			setLiActive(index);
		}
	});
	item.addEventListener('mouseleave', function() {
		const popup = document.querySelector('.bg.content.active');
		if (popup && !item.classList.contains('open-popup')) {
			item.classList.remove('hover');
		}
		ulItems[ulActiveIndex].classList.add('hover');
	});
	item.addEventListener('mouseup', function() {
		const popup = document.querySelector('.bg.content.active');
		if (popup) {
			ulItems[index].click();
		} else {
			item.click();
		}
	});
});

ulItems.forEach(function(item, index) {
	item.addEventListener('mouseenter', function() {
		const popup = document.querySelector('.bg.content.active');
		if (popup && !item.classList.contains('active')) {
			ulItems[ulActiveIndex].classList.remove('active', 'hover');
			item.classList.add('active', 'hover');
			ulHoverTimeout = setTimeout(function() {
				item.classList.remove('hover');
			}, 500);
			ulActiveIndex = index;
		}
	});
	item.addEventListener('mouseleave', function() {
		const popup = document.querySelector('.bg.content.active');
		if (popup && index !== ulActiveIndex) {
			item.classList.remove('active', 'hover');
			clearTimeout(ulHoverTimeout);
			ulItems[ulActiveIndex].classList.add('active');
		}
	});
	item.addEventListener('mouseup', function() {
		item.click();
	});

	const modalToClick = document.querySelector('.actions');

	if (modalToClick) {
		// добавляем обработчик события клавиатуры на страницу
		document.addEventListener('keydown', function(event) {
		// проверяем, нажата ли клавиша Esc
		if (event.key === 'Escape') {
			// нажимаем на элемент, используя метод click()
			modalToClick.click();
		}
		});
	}
});
/*
if(!document.querySelector('div#modal.active')) {
	if(document.querySelector('#gamegame')){
	const items = document.querySelectorAll('li.h');
	let activeIndex = 0;
	let hoverTimeout;

	function setActive(index) {
		items[activeIndex].classList.remove('active', 'hover');
		items[index].classList.add('active');
		activeIndex = index;
	}

	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowUp') {
		const newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
		setActive(newIndex);
		} else if (event.key === 'ArrowDown') {
		const newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
		setActive(newIndex);
		} else if (event.key === 'Enter') {
		items[activeIndex].click();
		}
	});

	items.forEach(function(item, index) {
		item.addEventListener('mouseenter', function() {
		if (index !== activeIndex) {
			items[activeIndex].classList.remove('active', 'hover');
			if (!item.classList.contains('open-popup')) {
			item.classList.add('hover');
			}
			setActive(index);
		}
		});
		item.addEventListener('mouseleave', function() {
		if (!item.classList.contains('open-popup')) {
			item.classList.remove('hover');
		}
		items[activeIndex].classList.add('hover');
		});
		item.addEventListener('click', function() {
		setActive(index);
		});
	});


	const modalToClick = document.querySelector('.actions');

	if (modalToClick) {
		// добавляем обработчик события клавиатуры на страницу
		document.addEventListener('keydown', function(event) {
		// проверяем, нажата ли клавиша Esc
		if (event.key === 'Escape') {
			// нажимаем на элемент, используя метод click()
			modalToClick.click();
		}
		});
	}

	/*
		document.addEventListener("keydown", function(event) {
		if (event.key === "e" || event.key === "E") {
			var element = document.getElementById("my-element");
			element.classList.toggle("hidden");
		}
		});

		document.addEventListener("keydown", function(event) {
		if (event.shiftKey && (event.key === "j" || event.key === "J")) {
			window.open("https://www.jackbox.uno");
		}
		});
	*//*
	}
}
*/
  
/* NICEANIM *//*
var niceanim = document.getSelection('#niceanim');
if (niceanim) {
	var niceanims = [
		document.getElementById('niceanim-1'),
		document.getElementById('niceanim-2'),
		document.getElementById('niceanim-3'),
		document.getElementById('niceanim-4'),
		document.getElementById('niceanim-5'),
		document.getElementById('niceanim-6'),
		document.getElementById('niceanim-7'),
		document.getElementById('niceanim-8')
	  ];
	  var delay = 250; // Задержка между появлением элементов в миллисекундах
	  
	  function showElements() {
		var index = 0;
		var interval = setInterval(function() {
			niceanims[index].style.display = 'block';
		  index++;
		  if (index >= niceanims.length) {
			clearInterval(interval);
		  }
		}, delay);
	  }
	  
	  showElements();
	  
}
*/

// FIRST

let clickdrop = false;
var dropdownContent = document.querySelector('.dropdown-content');
var currentPath = window.location.pathname;
currentPath = currentPath.replace(/^\/+/, '');

if (currentPath === '' ||
	currentPath === '/' ||
	currentPath === 'index.html' ||
	currentPath === '/index.html' ||
	currentPath === 'dejelnieks.lv' ||
	currentPath === 'dejelnieks.lv/' ||
	currentPath === 'dejelnieks.lv/index.html') {
	if (window.location.hash === '#t' || window.location.hash === '#tere-zander') {
		tTheme();
	} else {
		dTheme();
	}
	document.getElementById('d').addEventListener('click', function() {
		dTheme();
	});
	document.getElementById('t').addEventListener('click', function() {
		tTheme();
	});
	document.getElementById('lbtn').addEventListener('click', function() {
			if (!clickdrop) {
				dropdownContent.style.display = 'block';
				clickdrop = true;
			} else {
				dropdownContent.style.display = 'none';
				clickdrop = false;
			}
	});
	document.addEventListener('click', function(event) {
		var targetElement = event.target;
		var lbtnElement = document.getElementById('lbtn');
	  
		if (targetElement !== lbtnElement) {
		  dropdownContent.style.display = 'none';
		  clickdrop = false;
		}
	  });
	document.getElementById('lang-en').addEventListener('click', function() {
		dropdownContent.style.display = 'none';
		clickdrop = false;
	});
	document.getElementById('lang-lv').addEventListener('click', function() {
		dropdownContent.style.display = 'none';
		clickdrop = false;
	});
	console.log("1689299096");
}

function dTheme() {
	document.getElementById('ava').classList.add('avad');
	document.getElementById('ava').classList.remove('avat');
}  

function tTheme() {
	document.getElementById('ava').classList.add('avat');
	document.getElementById('ava').classList.remove('avad');
} 



// ?

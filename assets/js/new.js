console.log(`1710190986 - Fixed JSTimer, own AudioPlayers (alpha)`)

let audio;
function openpopup(number) {
	fetch('./assets/popupid.json')
	.then(response => response.json())
	.then(data => {
		const popupBg = document.createElement('div');
		const popup = document.createElement('div');
		popupBg.id = "closemepls"
		popup.id = "oof"
		popupBg.classList.add('modal');
		popup.classList.add('contentt');
		popup.classList.add('cnt');
		popup.classList.add('mz2');

		const container = document.getElementById('popup');
		container.style.display = "flex";
		container.appendChild(popupBg);

		const item = data[number];
		const divleft = document.createElement('div');
		divleft.classList.add('divleft');
		divleft.style.display = "flex";

		const image = document.createElement('div');
		image.classList = "face mz";
		divleft.appendChild(image);

		const name = document.createElement('p');
		name.textContent = item.name;
		name.classList.add('itemname');
		divleft.appendChild(name);

		const author = document.createElement('p');
		author.textContent = `by ` + item.author;
		author.classList.add('authoritem');
		divleft.appendChild(author);

		const customAudioPlayer = document.createElement('div');
		customAudioPlayer.id = 'customAudioPlayer';

		// Создание элемента 'playButton'
		const playButton = document.createElement('div');
		playButton.id = 'playButton';
		playButton.textContent = 'Play';

		// Создание элемента 'progressBar' и его дочернего элемента
		const progressBar = document.createElement('div');
		progressBar.id = 'progressBar';
		const progressBarChild = document.createElement('div');
		progressBar.appendChild(progressBarChild);

		// Создание элемента 'nextButton'
		const nextButton = document.createElement('div');
		nextButton.id = 'nextButton';
		nextButton.textContent = 'Next';

		// Добавление 'playButton', 'progressBar' и 'nextButton' в 'customAudioPlayer'
		customAudioPlayer.appendChild(playButton);
		customAudioPlayer.appendChild(progressBar);
		customAudioPlayer.appendChild(nextButton);

		// Добавление 'customAudioPlayer' в body документа
		divleft.appendChild(customAudioPlayer);

		const adivlink = document.createElement('div');
		for (let key in item.link) {
            const alink = document.createElement('a');
			alink.classList.add("adivlink");
			alink.textContent = key.charAt(0).toUpperCase() + key.slice(1);
			alink.href = item.link[key];
			adivlink.appendChild(alink);
        }
		divleft.appendChild(adivlink);
		popup.appendChild(divleft);
		container.appendChild(popup);

		const divdiv = document.createElement('div');
		container.appendChild(divdiv);

		const divright = document.createElement('div');
		divright.classList.add('divright');
		divright.style.display = "flex";
		popup.appendChild(divright);

		const divlist = document.createElement('div');
		divright.appendChild(divlist);

		testclose();

        const playlist = document.createElement('playlist');
		playlist.classList.add('playlist');

		let currentTrackIndex = 0;
        audio = new Audio(item.list[currentTrackIndex].src);

        for (let i = 0; i < item.list.length; i++) {
            let listItem = document.createElement('div');
			listItem.classList.add('listname');
            let link = document.createElement('p');
			link.classList.add('clickabel')
            link.textContent = item.list[i].name;
            listItem.appendChild(link);
            playlist.appendChild(listItem);
        }

		playlist.addEventListener('click', function(e) {
			if (e.target && e.target.nodeName === 'P') {
				for (let i = 0; i < item.list.length; i++) {
					if (item.list[i].name === e.target.textContent) {
						currentTrackIndex = i;
						break;
					}
				}
				audio.pause();
				audio.src = item.list[currentTrackIndex].src;
				audio.play();
				playButton.textContent = 'Pause';
				updateCurrentSong()
			}
		});

		function updateCurrentSong() {
			let currentSong = playlist.querySelector('.current-song');
			if (currentSong) {
				currentSong.classList.remove('current-song');
			}
			playlist.children[currentTrackIndex].classList.add('current-song');
		}

        playButton.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playButton.textContent = 'Pause';
				updateCurrentSong();
            } else {
                audio.pause();
                playButton.textContent = 'Play';
            }
        });

        nextButton.addEventListener('click', function() {
            currentTrackIndex++;
            if (currentTrackIndex >= item.list.length) {
                currentTrackIndex = 0;
            }
            audio.src = item.list[currentTrackIndex].src;
            audio.play();
            playButton.textContent = 'Pause';
			updateCurrentSong();
        });

        audio.addEventListener('timeupdate', function() {
            let progress = audio.currentTime / audio.duration;
            progressBar.firstChild.style.width = progress * 100 + '%';
        });

        progressBar.addEventListener('click', function(e) {
            let rect = progressBar.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let progress = x / rect.width;
            audio.currentTime = progress * audio.duration;
        });

        audio.addEventListener('ended', function() {
            nextButton.click();
        });

		
		divlist.appendChild(playlist);

		const listdesc = document.createElement('div');
		listdesc.classList.add('listdesc');

		for (let i = 0; i < item.description.length; i++) {
			let p = document.createElement('p');
			p.innerHTML = item.description[i];
			listdesc.appendChild(p);
		}
		divright.appendChild(listdesc);
	})
	.catch(error => console.error('Error fetching JSON: ', error));
}

function testclose() {
	document.addEventListener('click', test2);
}

function test2(e) {
	if (e.target === document.querySelector('#popup')) {
		audio.pause();
		document.querySelector('#popup').style.display = "none";
		document.querySelector('#closemepls').remove();
		document.querySelector('#oof').remove();
		document.removeEventListener('click', test2);
	}
}

/*  TOOGLE THEME */
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

/* CONTENT MAIN */
fetch('./assets/content.json')
	.then(response => response.json())
	.then(data => {
		const musicSection = document.getElementById('music');
		const webSection = document.getElementById('web');

		data.music.forEach(item => {
			const div = document.createElement('div');
			div.className = `cn ${item.div}`;

			const a = document.createElement('a');
			a.className = 'tavslaiks';
			if (item.id) {
				a.id = item.id;
			}
			if (item.href) {
				a.href = item.href;
			}
			
			const divFace = document.createElement('div');
			divFace.className = `face ${item.div2}`;

			const divTavslaiks2 = document.createElement('div');
			divTavslaiks2.className = 'tavslaiks2';

			const h1 = document.createElement('h1');
			h1.className = 'tt';
			h1.textContent = item.tt;
			
			const p = document.createElement('p');
			p.className = 'rednew';
			p.textContent = item.rednew;

			const aclass = document.createElement('p');
			aclass.className = 'rednew';
			aclass.textContent = item.rednew;

			divTavslaiks2.appendChild(h1);
			if (item.rednew !== "") {
				divTavslaiks2.appendChild(p);
			}
			a.appendChild(divFace);
			a.appendChild(divTavslaiks2);
			div.appendChild(a);
			musicSection.appendChild(div);
		});

		data.web.forEach(item => {
			const div = document.createElement('div');
			div.className = 'cn';

			const a = document.createElement('a');
			a.href = item.href;

			const h1 = document.createElement('h1');
			h1.className = 'tt2';
			h1.textContent = item.tt;

			const p = document.createElement('p');
			p.className = 'ttt';
			p.textContent = item.ttt;

			const pRednew = document.createElement('p');
			pRednew.className = 'rednew';
			pRednew.textContent = item.rednew;

			a.appendChild(h1);
			a.appendChild(p);
			if (item.rednew !== "") {
				a.appendChild(pRednew);
			}
			div.appendChild(a);
			webSection.appendChild(div);
		});

		document.getElementById("mza").addEventListener('click', () => {
			openpopup(0);
		});	
	})
	.catch(error => console.error('Error fetching JSON: ', error));

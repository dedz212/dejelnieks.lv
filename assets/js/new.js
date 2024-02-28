console.log(`1709160132 - Updated content, added JSTimer`)

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
			a.href = item.href;

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
	})
	.catch(error => console.error('Error fetching JSON: ', error));
// JAPANESE
	// AUDIO
	let audio = new Audio();
	const volumeControl = document.getElementById("volume-control range");
	const volumeSlider = document.getElementById("volume-slider");

	function playSound(symbolId) {
		const soundPath = symbolId === "wo" ? "o" : symbolId;
		if (symbolId === "d_zu") {
		audio.src = `../japanese/sounds/zu.mp3`;
		} else if (symbolId === "z_ji" || symbolId === "d_ji") {
		audio.src = `../japanese/sounds/ji.mp3`;
		} else if (symbolId === "z_ja" || symbolId === "d_ja") {
		audio.src = `../japanese/sounds/ja.mp3`;
		} else if (symbolId === "z_ju" || symbolId === "d_ju") {
		audio.src = `../japanese/sounds/ju.mp3`;
		} else if (symbolId === "z_jo" || symbolId === "d_jo") {
		audio.src = `../japanese/sounds/jo.mp3`;
		} else {
		audio.src = `../japanese/sounds/${soundPath}.mp3`;
		}
		audio.volume = volumeControl.value;
		localStorage.setItem("volume", volumeControl.value);
		audio.load();
		audio.play();
	}

	function changeSymbols() {
		const toggle = document.getElementById("toggle");
		const symbolElements = document.querySelectorAll("[data-id]");

		fetch("../json/symbols.json")
			.then(response => response.json())
			.then(data => {
				const symbolData = toggle.checked ? data.On.symbols : data.Off.symbols;
				symbolElements.forEach(element => {
					const symbolId = element.getAttribute("data-id");
					element.textContent = symbolData[symbolId];
					element.addEventListener("click", () => playSound(symbolId));
				});
				localStorage.setItem("toggleState", toggle.checked);
			})
			.catch(error => console.error(error));
	}

	// загружаем состояние переключателя из localStorage при загрузке страницы
	window.addEventListener("load", () => {
		const toggle = document.getElementById("toggle");
		const savedToggleState = localStorage.getItem("toggleState");
		if (savedToggleState !== null) {
			toggle.checked = savedToggleState === "true";
			changeSymbols();
		}
		const volume = localStorage.getItem("volume");
		if (volume) {
			volumeControl.value = volume;
			playSound();
		}
	});

	document.getElementById("volume-control range").addEventListener("change", () => {
		const volumeControl = document.getElementById("volume-control range");
		audio.volume = volumeControl.value;
		localStorage.setItem("volume", volumeControl.value);
	});

	// TOOLTIP

	async function loadTooltipText(id) {
		const response = await fetch('../json/tooltip.json');
		const tooltips = await response.json();

		const pronun = tooltips.pronuns[id];
		if (!pronun) {
			return null;
		}

		const mfa = tooltips.mfa[id];
		if (!mfa) {
			return null;
		}

		if (localStorage.getItem('toggleState') === 'false') {
			var img = tooltips.imgfalse[id];
			if (!img) {
				return null;
			}
		} else {
			var img = tooltips.imgtrue[id];
			if (!img) {
				return null;
			}
		}
		return `
		<div>
			<p>Pronunciation: ${pronun}</p>
			<p>MFA: [${mfa}]</p>
		</div>
		<img src="${img}">
	`;

	}

	function addTooltip(element, text) {
		const tooltip = document.createElement('div');
		tooltip.className = 'tooltip twotooltip';
		tooltip.innerHTML = text;
		element.appendChild(tooltip);

	}

	function removeTooltip(element) {
		const tooltips = element.querySelectorAll('.tooltip');
		tooltips.forEach((tooltip) => {
			element.removeChild(tooltip);
		});
	}

	function addTooltipToElements() {
		const elements = document.querySelectorAll('[data-id]');
		elements.forEach((element) => {
			const id = element.dataset.id;
			element.addEventListener('mouseover', async () => {
				const tooltipText = await loadTooltipText(id);
				if (tooltipText) {
					addTooltip(element, tooltipText);
				}
			});
			element.addEventListener('mouseout', () => {
				removeTooltip(element);
			});
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
			addTooltipToElements();
	});

	//VOLUME

	const rangeInputs = document.querySelectorAll('input[type="range"]')

	function handleInputChange(e) {
	let target = e.target
	if (e.target.type !== 'range') {
		target = document.getElementById('range')
	} 
	const min = target.min
	const max = target.max
	const val = target.value
	
	target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
	localStorage.setItem('backgroundSize', target.style.backgroundSize);
	}

	rangeInputs.forEach(input => {
	input.addEventListener('input', handleInputChange)
	})

	// при загрузке страницы применяем сохраненное значение
	window.addEventListener('load', () => {
	const backgroundSize = localStorage.getItem('backgroundSize');
	if (backgroundSize) {
		rangeInputs.forEach(input => {
		input.style.backgroundSize = backgroundSize;
		});
	}
	});
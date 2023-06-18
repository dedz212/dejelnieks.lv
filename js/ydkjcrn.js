const langArr = {
	en: {
		play: "Play",
		playagain: "Play Again",
        playlocal: "Play the original",
        playonline: "Play online",
        language: "English",
        settings: "Settings",
        volume: "Volume",
        back: "Back",
        click: "Click here if you don't have sound",
        credits: "Credits",
        t1: "Originally <span id=\"p\">YDKJ Screensaver</span> created on April 1999 by <span id=\"p\">h2omedia</span>",
        t2: "Adapted by <span id=\"p\">Dejelnieks</span>",
        ls1: "This is NOT a commercial website-game",
        ls2: "The rating below is unofficial, self-declared, and solely for reference",
        ls3: "FOR AGES",
        ls4: "12",
        ls5: "AND ABOVE",
        ls6: "○ Crude Humor",
        ls7: "○ Adult Themes",
        ls8: "○ Drug Reference",
        ls9: "○ Language",
        ls10: "All trademarks mentioned it this game are the property of their respective owners. They are used for commentary, parody, and education, and should not be taken as implication of ownership, endorsement, or condemnation.",
        skiploadin: "Never show again",
	},
	de: {
		play: "Spielen",
		playagain: "Noch spielen",
        playlocal: "Original spielen",
        playonline: "Online spielen",
        language: "Deutsch",
        settings: "Einstellungen",
        volume: "Lautstärke",
        back: "Zurück",
        click: "Klicken Sie hier, wenn Sie keinen Ton haben",
        credits: "Credits",
        t1: "Ursprünglich <span id=\"p\">YDKJ Screensaver</span> erstellt am April 1999 von <span id=\"p\">h2omedia</span>",
        t2: "Angepasst von <span id=\"p\">Dejelnieks</span>",
        ls1: "Dies ist kein kommerzielles Website-Spiel",
        ls2: "Die folgende Bewertung ist inoffiziell, selbsterklärend und dient ausschließlich als Referenz",
        ls3: "FÜR KINDER AB",
        ls4: "12",
        ls5: "JAHREN",
        ls6: "○ Kruder Humor",
        ls7: "○ Erwachsenenthemen",
        ls8: "○ Referenzarzneimittel",
        ls9: "○ Sprache",
        ls10: "Alle in diesem Spiel erwähnten Marken sind Eigentum ihrer jeweiligen Inhaber. Sie werden für Kommentare, Parodien und Aufklärung verwendet und sollten nicht als Implikation von Eigentum, Billigung oder Verurteilung verstanden werden.",
        skiploadin: "Nie wieder zeigen",
	},
};

const langEn = document.querySelector("#lang-en");
const langDe = document.querySelector("#lang-de");

const prevLangButton = document.querySelector(".prev");
const nextLangButton = document.querySelector(".next");

let langs = Object.keys(langArr);
let currentLangIndex = langs.indexOf(window.localStorage.getItem("lang")) || 0;

if (langEn) {
	langEn.addEventListener("click", setLang.bind(null, "en"));
}
if (langDe) {
	langDe.addEventListener("click", setLang.bind(null, "de"));
}

function setLang(lang) {
	if (!langArr.hasOwnProperty(lang)) return;
	if (window.hasOwnProperty("localStorage"))
		window.localStorage.setItem("lang", lang);
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
        function tdf() {
            const td = document.getElementById("dt");
            const l = document.querySelector(`.l`);
            const v = document.querySelector(`.v`);
            td.innerHTML = "";
        
            l.addEventListener('mouseenter', function() {
                td.innerHTML = "Only GUI translation";
            });
            
            v.addEventListener('mouseenter', function() {
                td.innerHTML = `The volume is <span id="volumeDisplay">`;
                updateVolumeDisplay();
            });
        
            l.addEventListener('mouseleave', function() {
                td.innerHTML = "";
            });

            v.addEventListener('mouseleave', function() {
                td.innerHTML = "";
            });
        }
        tdf();
	}
	if (lang == "de") {
		console.log("Deutsch");
        function tdf() {
            const td = document.getElementById("dt");
            const l = document.querySelector(`.l`);
            const v = document.querySelector(`.v`);
            td.innerHTML = "";
        
            l.addEventListener('mouseenter', function() {
                td.innerHTML = "Willkommen im Spiel!";
            });
            
            v.addEventListener('mouseenter', function() {
                td.innerHTML = `Die Volumen beträgt <span id="volumeDisplay">`;
                updateVolumeDisplay();
            });
        
            l.addEventListener('mouseleave', function() {
                td.innerHTML = "";
            });

            v.addEventListener('mouseleave', function() {
                td.innerHTML = "";
            });
        }
        tdf();
	}
}

function switchLang(direction) {
	if (direction === "prev") {
	  currentLangIndex--;
	  if (currentLangIndex < 0) {
		currentLangIndex = langs.length - 1;
	  }
	} else if (direction === "next") {
	  currentLangIndex++;
	  if (currentLangIndex >= langs.length) {
		currentLangIndex = 0;
	  }
	}
	setLang(langs[currentLangIndex]);
  }  

  if (prevLangButton) {
	prevLangButton.addEventListener("click", function() {
		switchLang("prev");

        if (!document.querySelector('.plb').classList.contains("cp")) {
            document.querySelector('.plb').classList.add("cp");
        }
        if (!document.querySelector('.lp').classList.contains("cp")) {
            document.querySelector('.lp').classList.add("cp");
        }
        setTimeout(() => {
            document.querySelector('.plb').classList.remove("cp");
            document.querySelector('.lp').classList.remove("cp");
        }, 1000);
	});
}

if (nextLangButton) {
	nextLangButton.addEventListener("click", function() {
		switchLang("next");

        if (!document.querySelector('.nlb').classList.contains("cp")) {
            document.querySelector('.nlb').classList.add("cp");
        }
        if (!document.querySelector('.lp').classList.contains("cp")) {
            document.querySelector('.lp').classList.add("cp");
        }
        setTimeout(() => {
            document.querySelector('.nlb').classList.remove("cp");
            document.querySelector('.lp').classList.remove("cp");
        }, 1000);
	});
}
  
var lang = (window.hasOwnProperty("localStorage") && window.localStorage.getItem("lang", lang)) || "de";
setLang(lang);



var volumeUpButton = document.getElementById("volumeUp");
var volumeDownButton = document.getElementById("volumeDown");

var audioElement;
var gainNode;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (audioContext.state === 'suspended') {
    const sadp = document.getElementById('sadp'); 
    sadp.style.color = 'red';
}
var savedVolume = localStorage.getItem("volume");
var currentVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.1;

function audioSetConf(){
    if (!gainNode) {
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
    }

    // Подключаем аудио элемент к узлу управления громкостью
    var audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(gainNode);

    // Подключаем узел управления громкостью к выходу аудио контекста
    gainNode.connect(audioContext.destination);

    // Устанавливаем громкость
    gainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);

    // Воспроизводим аудио
    audioElement.play();
}

function updateVolumeDisplay() {
    var volumePercentage = Math.round(currentVolume * 100);
    if (document.getElementById("volumeDisplay")) {
        document.getElementById("volumeDisplay").textContent = volumePercentage + "%";
    }
}

let isMusicPlaying = false;

function playPreIntroMusic() {
    audioElement = new Audio();
    audioElement.src = "./sounds/looped.mp3";
    audioElement.loop = true;
    isMusicPlaying = true;

    audioSetConf()
}

function playIntroMusic() {
    audioElement = new Audio();
    audioElement.src = "./sounds/5.mp3";
//    audioElement.loop = true;

    audioSetConf()
}

// Функция увеличения громкости
function increaseVolume() {
    if (currentVolume < 1) {
      currentVolume += 0.1;
      setVolume(currentVolume);
      updateVolumeDisplay();
    }

        if (!document.querySelector('.vp').classList.contains("cp")) {
            document.querySelector('.vp').classList.add("cp");
        }
        if (!document.querySelector('.pb').classList.contains("cp")) {
            document.querySelector('.pb').classList.add("cp");
        }
        setTimeout(() => {
            document.querySelector('.vp').classList.remove("cp");
            document.querySelector('.pb').classList.remove("cp");
        }, 1000);
  }
  
  // Функция уменьшения громкости
  function decreaseVolume() {
    if (currentVolume > 0) {
      currentVolume -= 0.1;
      setVolume(currentVolume);
      updateVolumeDisplay();
    }

        if (!document.querySelector('.vp').classList.contains("cp")) {
            document.querySelector('.vp').classList.add("cp");
        }
        if (!document.querySelector('.ob').classList.contains("cp")) {
            document.querySelector('.ob').classList.add("cp");
        }
        setTimeout(() => {
            document.querySelector('.vp').classList.remove("cp");
            document.querySelector('.ob').classList.remove("cp");
        }, 1000);
  }
  
  // Функция установки громкости
  function setVolume(volume) {
    if (gainNode) {
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        localStorage.setItem("volume", volume.toFixed(1)); // Сохраняем новое значение громкости в localStorage
    }
  }
  
var questionSounds = [
  "./sounds/17.mp3",
  "./sounds/20.mp3",
  "./sounds/22.mp3",
  "./sounds/22_.mp3",
  "./sounds/24.mp3",
  "./sounds/44.mp3",
  "./sounds/46.mp3"
];

function stopAudio() {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }


function playRandomQuestionSound() {
  audioElement = new Audio();
  var randomIndex = Math.floor(Math.random() * questionSounds.length);
  audioElement.src = questionSounds[randomIndex];
  audioElement.loop = true;

  audioSetConf()
}

function playByIdQuestionSound(id) {
    stopAudio();
    audioElement = new Audio();
    audioElement.src = questionSounds[id - 1];
    audioElement.loop = true;
  
    audioSetConf()
  }

function playStopSound() {
    audioElement = new Audio();
    audioElement.src = "./sounds/124.mp3";
  
    audioSetConf()
}

function playYeySound() {
    audioElement = new Audio();
    audioElement.src = "./sounds/58.mp3";
  
    audioSetConf()
}

function playOoOhSound() {
    audioElement = new Audio();
    audioElement.src = "./sounds/69.mp3";
  
    audioSetConf()
}

let currentEpisode;

// Function for loading the game
function loadRandomEpisode() {
    // Загрузка файла JSON с эпизодами
    fetch('./json/episodesys.json')
        .then(response => response.json())
        .then(data => {
            // Выбор случайного эпизода
            const episodeIds = Object.keys(data);
            const randomEpisodeId = episodeIds[Math.floor(Math.random() * episodeIds.length)];
            currentEpisode = data[randomEpisodeId];
            console.log(randomEpisodeId)

            // Отображение рандомного эпизода
            showIntro(currentEpisode.intro);
            showQuestion(currentEpisode.question, currentEpisode.answer, currentEpisode.category);
        })
        .catch(error => {
            console.error('Ошибка загрузки эпизодов:', error);
        });
}

function loadEpisodeById(episodeId) {
    fetch('./json/episodesys.json')
      .then(response => response.json())
      .then(data => {
        if (selected) {
            selected = false;
        }
        stopAudio();
        currentEpisode = data[episodeId];
        console.log(episodeId)
        
        if (currentEpisode) {
          showIntro(currentEpisode.intro);
          showQuestion(currentEpisode.question, currentEpisode.answer, currentEpisode.category);
        } else {
          console.error('Эпизод с указанным идентификатором не найден');
        }
      })
      .catch(error => {
        console.error('Ошибка загрузки эпизодов:', error);
      });
}
  
let isClicked = false;

function pleaseBeRedIntro(index) {
    const n = document.querySelectorAll(`.n`)
    const ms2 = document.querySelector(`.lang-settings`)
    const mt3 = document.querySelector(`.lang-credits`)
    const pi1 = document.querySelector(`.lang-playlocal`)
    const pi2 = document.querySelector(`.lang-playonline`)

    n.forEach(function() {
        ms2.addEventListener("click", function() {
            if (!isClicked) {
                isClicked = true;
                if (n.classList.contains("hover")) {
                    n.classList.remove("hover");
                }
            }
        });
        mt3.addEventListener("click", function() {
            if (!isClicked) {
                isClicked = true;
                if (n.classList.contains("hover")) {
                    n.classList.remove("hover");
                }
            }
        });
        pi1.addEventListener("click", function() {
            if (!isClicked) {
                isClicked = true;
                if (n.classList.contains("hover")) {
                    n.classList.remove("hover");
                }
            }
        });
        pi2.addEventListener("click", function() {
            if (!isClicked) {
                isClicked = true;
                if (n.classList.contains("hover")) {
                    n.classList.remove("hover");
                }
            }
        });
    });

    n.forEach(function(n) {

        n.addEventListener('mousedown', function() {
            isClicked = true;
            if (n.classList.contains('hover')) {
                n.classList.remove('hover');
            }
            n.classList.add('active');
            setTimeout(() => {
                isClicked = false;
                n.classList.remove("active");
            }, 1100);
        });
        
        n.addEventListener('mouseenter', function() {
            if (!isClicked) {
                n.classList.add('hover');
            } else {
                n.classList.remove('hover');
            }
        });
        
        n.addEventListener('mouseleave', function() {
            n.classList.remove('hover');
        });
    });
}

// Function for showing intro
function showIntro(intro) {
    pleaseBeRedIntro();
    const introTextElement = document.getElementById("introText");
    introTextElement.innerHTML = intro.first;

    setTimeout(() => {
        introTextElement.innerHTML = intro.second;
        if (intro.third) {
            setTimeout(() => {
                introTextElement.innerHTML = intro.third;
                setTimeout(() => {
                    startGame();
                }, 1500);
            }, 3000);
        } else {
            setTimeout(() => {
                startGame();
            }, 3000);
        }
    }, 3000);

    playIntroMusic();
    if (document.getElementById("preintro").style.display = "flex") {
        document.getElementById("preintro").style.display = "none";
    }
    if (document.getElementById("question").style.display = "flex") {
        document.getElementById("question").style.display = "none";
    }
    if (document.getElementById("result").style.display = "flex") {
        document.getElementById("result").style.display = "none";
    }
    if (document.getElementById("settings").style.display = "flex") {
        document.getElementById("settings").style.display = "none";
    }
    if (document.getElementById("credits").style.display = "flex") {
        document.getElementById("credits").style.display = "none";
    }
    document.getElementById("intro").style.display = "flex";
}

// Function to start the game
function startGame() {
    setTimeout(() => {
        isClicked = false;
        document.getElementById("intro").style.display = "none";
        document.getElementById("question").style.display = "flex";
        stopAudio();
        playRandomQuestionSound();
        let answerEC = false;
        document.addEventListener("keydown", function(event) {
            if (answerEC) {
                return;
            }
    
            if (event.keyCode === 49) {
                document.querySelector('.a1').click();
            }
            if (event.keyCode === 50) {
                document.querySelector('.a2').click();
            }
            if (event.keyCode === 51) {
                document.querySelector('.a3').click();
            }
            if (event.keyCode === 52) {
                document.querySelector('.a4').click();
            }
            answerEC = true;
        });
    }, 1000);
}

// Function for displaying the question and answers
function showQuestion(question, answer, category) {
    const categoryTextElement = document.getElementById("categoryText");
    const questionTextElement = document.getElementById("questionText");
    const answersElement = document.getElementById("answers");

    categoryTextElement.textContent = category;
    questionTextElement.innerHTML = question;
    
    answersElement.innerHTML = "";
    for (let i = 0; i < answer.order.length; i++) {
        const option = answer.order[i];
        const li = document.createElement("li");
        const p = document.createElement("p");
        const pn = document.createElement("p");
        li.setAttribute("class", `a${i + 1}`);
        pn.textContent = `${i + 1}`;
        pn.setAttribute("class", `n ma${i + 1}`);
        p.textContent = option;
        p.setAttribute("class", `pl${i + 1}`);
        li.appendChild(pn);
        li.appendChild(p);
        answersElement.appendChild(li);
    }

    let selected = false;

    const addClickListener = (index) => {
        const pl = document.querySelector(`.pl${index}`);
        const a = document.querySelector(`.a${index}`);
        const ma = document.querySelector(`.ma${index}`);

        a.addEventListener("click", function() {
            if (!selected) {
                selected = true;
                stopAudio();
                playStopSound();
                a.classList.add("red");
                if (!ma.classList.contains("cp")) {
                    ma.classList.add("cp");
                }
                if (!pl.classList.contains("cp")) {
                    pl.classList.add("cp");
                }
                setTimeout(() => {
                    checkAnswer(index);
                    ma.classList.remove("cp");
                    pl.classList.remove("cp");
                }, 1000);
            }
        });

        const n = document.querySelectorAll(`.n`)
    
        n.forEach(function() {
            pl.addEventListener("click", function() {
                if (!isClicked) {
                    isClicked = true;
                    if (n.classList.contains("hover")) {
                        n.classList.remove("hover");
                    }
                }
            });
        });

        ma.addEventListener('mousedown', function() {
            isClicked = true;
            if (ma.classList.contains('hover')) {
                ma.classList.remove('hover');
            }
            ma.classList.add('active');
            setTimeout(() => {
                isClicked = false;
                n.classList.remove("active");
            }, 1100);
        });
            
        ma.addEventListener('mouseenter', function() {
            if (!isClicked) {
                ma.classList.add('hover');
            } else {
                ma.classList.remove('hover');
            }
        });
        
        ma.addEventListener('mouseleave', function() {
            ma.classList.remove('hover');
        });
    };
    
    for (let i = 1; i <= 4; i++) {
        addClickListener(i);
    }
    
}

// Function for checking the selected response
function checkAnswer(selectedOption) {
    const explanationIndex = selectedOption;
    const correctAnswer = currentEpisode.answer.true_is; // Getting the correct answer from the current episode
    //const answerElement = document.getElementById("resultText");
    const explanationElement = document.getElementById("explanation");
    const resultElement = document.getElementById("result"); 

    if (selectedOption === correctAnswer) {
        stopAudio();
        playYeySound();
    } else {
        stopAudio();
        playOoOhSound();
    }

    // Отображаем выбранный вариант ответа
    const selectedOptionText = currentEpisode.answer.order[selectedOption - 1];
    const selectedOptionElement = document.getElementById("selectedOption");
    selectedOptionElement.textContent = selectedOptionText;

    explanationElement.innerHTML = currentEpisode.explanation[explanationIndex - 1];
    document.getElementById("question").style.display = "none";
    resultElement.style.display = "flex";
    isMusicPlaying = false;
    //document.getElementById("playAgainButton").style.display = "flex";
}


// Function to play again
function playAgain() {
    isClicked = false;
    if (selected) {
        selected = false;
    }
    document.getElementById("result").style.display = "none";
    loadRandomEpisode();
}


let selected = false;

function switchBack() {
    isClicked = false;
    skipLEC = false;
    answerEC = false;
    document.getElementById("settings").style.animationName = "fadeOut";
    document.getElementById("credits").style.animationName = "fadeOut";
    document.getElementById("result").style.animationName = "fadeOut";
    setTimeout(() => {
        document.getElementById("settings").style.display = "none";
        document.getElementById("credits").style.display = "none";
        document.getElementById("result").style.display = "none";
        document.getElementById("preintro").style.display = "flex";
        if (!isMusicPlaying) {
            playPreIntroMusic();
        }
        document.getElementById("settings").style.animationName = "fadeIn";
        document.getElementById("credits").style.animationName = "fadeIn";
        document.getElementById("result").style.animationName = "fadeIn";
    }, 1000);

    if (selected) {
        selected = false;
    }
}

function closeDev() {
    document.getElementById('dev').classList.add("seou");
    localStorage.setItem("dev", false);
    setTimeout(() => {
        document.getElementById("dev").style.display = "none";
        document.getElementById("devgui").style.display = "none";
    }, 1000);
}

if (localStorage.getItem("dev") === "true") {
    openDev();
}

function openDev() {
    localStorage.setItem("dev", true);
    const devon = document.createElement("div");
    devon.id = "dev";

    const dev = document.createElement("div");
    dev.id = "devgui";
    dev.style.display = "flex";
    dev.innerHTML = "";

    dev.classList.add("eye");
    setTimeout(() => {
        dev.classList.remove("eye");
    }, 1000);
    devon.style.display = "flex";
    dev.style.display = "flex";

    const div = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    div.setAttribute("class", `lefttoright`);
    div2.setAttribute("class", `lefttoright`);
    div3.setAttribute("class", `lefttoright`);

    const h2 = document.createElement("h2");
    h2.textContent = `DEVGUI`;
    dev.appendChild(h2);

    const btn = document.createElement("button");
    btn.textContent = `stop audio`;
    btn.addEventListener("click", stopAudio);
    div.appendChild(btn);

    for (let i = 1; i <= 10; i++) {
        const btnE = document.createElement("button");
        btnE.textContent = i.toString();
        btnE.addEventListener("click", function() {
            loadEpisodeById(i);
        });
        div2.appendChild(btnE);
    }

    for (let i = 1; i <= 7; i++) {
        const btnA = document.createElement("button");
        btnA.textContent = i.toString();
        btnA.addEventListener("click", function() {
            playByIdQuestionSound(i);
        });
        div3.appendChild(btnA);
    }

    const el = document.createElement("button");
    el.textContent = "extra loading";
    el.addEventListener("click", extraLoading);
    div.appendChild(el);

    const closeButton = document.createElement("button");
    closeButton.textContent = "close devgui";
    closeButton.addEventListener("click", closeDev);
    div.appendChild(closeButton);

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.addEventListener("click", decreaseVolume);
    div.appendChild(minus);

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", increaseVolume);
    div.appendChild(plus);

    const nl = document.createElement("button");
    nl.textContent = ">";
    nl.addEventListener("click", function() {
        switchLang("next");
    });
    div.appendChild(nl);

    dev.appendChild(div);
    dev.appendChild(div2);
    dev.appendChild(div3);
    devon.appendChild(dev);
    document.querySelector('body').appendChild(devon);
}

document.querySelector('#sadp').addEventListener("click", function() {
    console.log('Don\'t cry!');
    location.reload();
    stopAudio();
})

function preIntroCL(s1, s2, s3) {
    document.querySelector(s1).addEventListener("click", function() {
        if (!selected) {
            var targets1 = document.querySelector(s1);
            var targets2 = document.querySelector(s2);
            var targets3 = document.querySelector(s3);
            if (!targets1.classList.contains("red")) {
                targets1.classList.add("red");
                if (!targets2.classList.contains("cp")) {
                    targets2.classList.add("cp");
                }
                if (!targets3.classList.contains("cp")) {
                    targets3.classList.add("cp");
                }
            }
            setTimeout(() => {
                targets1.classList.remove("red");
                targets2.classList.remove("cp");
                targets3.classList.remove("cp");
                selected = true;
            }, 1000);
        }
    });
}

let skipLEC = false;

function skipLoading() {
    document.getElementById("loading").style.display = "none";
        document.getElementById("preintro").style.display = "flex";
        playPreIntroMusic();

        setTimeout(() => {
            preIntroCL('.pi1', '.pib1', '.lang-playlocal');
            preIntroCL('.pi2', '.pib2', '.lang-playonline');
            preIntroCL('.ms2', '.mb2', '.lang-settings');
            preIntroCL('.mt3', '.mb3', '.lang-credits');

            document.addEventListener("keydown", function(event) {
                if (skipLEC) {
                    return;
                }

                if (event.keyCode === 49) {
                    document.querySelector('.pi1').click();
                }
                if (event.keyCode === 50) {
                    document.querySelector('.pi2').click();
                }
                if (event.keyCode === 51) {
                    document.querySelector('.ms2').click();
                }
                if (event.keyCode === 52) {
                    document.querySelector('.mt3').click();
                }
                skipLEC = true;
            });

            document.querySelector('.pi1').addEventListener("click", function() {
                if (!selected) {
                    selected = true;
                    setTimeout(() => {
                        document.getElementById("preintro").style.display = "none";
                        document.getElementById("intro").style.display = "flex";
                        playAgain();
                        stopAudio();
                    }, 1000);
                }
            });
            document.querySelector('.pi2').addEventListener("click", function() {
                if (!selected) {
                    selected = true;
                    setTimeout(() => {
                        extraLoading();
                    }, 1000);
                }
            });
            document.querySelector('.ms2').addEventListener("click", function() {
                if (!selected) {
                    selected = true;
                    setTimeout(() => {
                        document.getElementById("preintro").style.display = "none";
                        document.getElementById("settings").style.display = "flex";
                    }, 1000);
                }
            });
            
            document.querySelector('.mt3').addEventListener("click", function() {
                if (!selected) {
                    selected = true;
                    setTimeout(() => {
                        document.getElementById("preintro").style.display = "none";
                        document.getElementById("credits").style.display = "flex";
                    }, 1000);
                }
            });

        }, 100);
}

function skipLoadingN() {
    localStorage.setItem("NSA", "skip");
    skipLoading();
}

function loading() {
    if (localStorage.getItem("NSA") === "skip") {
        skipLoadingN();
    } else {
        document.querySelector('.ls').classList.add("skipon");
        setTimeout(() => {
            document.querySelector('.ls').classList.remove("skipon");
            document.querySelector('.ls').classList.add("skipoff");
        }, 3000);
        setTimeout(() => {
            skipLoading();
            document.querySelector('.ls').classList.remove("skipoff");
        }, 5000);
    }
}

function extraLoading() {
    stopAudio();
    isClicked = false;
    if (selected) {
        selected = false;
    }
    alert('Some other time');
    location.reload();
}


// Loading the game after the page is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById('vertime').innerHTML = 'v.1687033861';
    loading();
    pleaseBeRedIntro();
});
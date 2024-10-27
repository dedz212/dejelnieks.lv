fetch('../assets/popupid.json')
    .then(response => response.json())
    .then(data => {
        const album = data["0"];
        document.getElementById('cover').src = album.img;
        document.getElementById('album-name').innerText = album.name;
        document.getElementById('author-name').innerText = album.author;
        const descriptions = album.description; // Получаем массив описаний
        const descContainer = document.getElementById('desc'); // Получаем контейнер для описаний

        // Очищаем контейнер перед добавлением новых элементов
        descContainer.innerHTML = '';

        // Перебираем массив описаний
        descriptions.forEach(description => {
            const p = document.createElement('p'); // Создаем новый элемент <p>
            p.innerHTML = description; // Устанавливаем текст для <p>
            descContainer.appendChild(p); // Добавляем <p> в контейнер
        });

        let currentTrackIndex = 0; // Переменная для отслеживания текущего трека

        // Добавление треков в список и обработка кликов
        const trackList = document.getElementById('track-list');
        album.list.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track');
            trackElement.innerText = track.name;
            trackElement.addEventListener('click', () => {
                playTrack(index);
            });
            trackList.appendChild(trackElement);
        });

        // Событие окончания трека для переключения на следующий
        audio.addEventListener('ended', () => {
            currentTrackIndex++;
            if (currentTrackIndex < album.list.length) {
                playTrack(currentTrackIndex); // Воспроизведение следующего трека
            } else {
                currentTrackIndex = 0; // Возвращаемся к первому треку, если список закончился
            }
        });

        for (let key in album.link) {
            const alink = document.createElement('a');
            alink.classList.add("ll");
            const image = document.createElement('img');
            image.className = `ii`;
            const logos = {
                spotify: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/spotify-white-icon.png",
                amazon: "https://img.icons8.com/ios7/600/FFFFFF/amazon-music.png",
                yandex: "https://img.icons8.com/ios7/600/FFFFFF/yandex-music.png",
                zvuk: "../assets/img/zvuk.png",
                tidal: "https://cdn.icon-icons.com/icons2/2429/PNG/512/tidal_logo_icon_147227.png",
                bandcamp: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bandcamp-button-circle-black.svg/1024px-Bandcamp-button-circle-black.svg.png"
            };
            if (logos[key]) {
                image.src = logos[key];
            }                    
            alink.appendChild(image);
            alink.href = album.link[key];
            document.getElementById('link').appendChild(alink);
        }
    });

    let currentTrackIndex = 0;
    const audio = document.getElementById('audio');
    const audioSource = document.getElementById('audio-source');

    // Функция для воспроизведения трека
    function playTrack(index) {
        currentTrackIndex = index;
        audioSource.src = `../assets/music/zeme/${index + 1}.mp3`; // Используйте правильный путь к файлу
        audio.load();
        audio.play();
        document.getElementById('play').disabled = true;
        document.getElementById('play').style.cursor = "not-allowed"
        document.getElementById('pause').disabled = false;
        document.getElementById('pause').style.cursor = "pointer"
        updateActiveTrackStyle(index);
        // Установить значение ползунка перемотки
        document.getElementById('seek-bar').max = audio.duration;
    }

// Обработчик событий для изменения громкости
document.getElementById('volume').addEventListener('input', (event) => {
    audio.volume = event.target.value;
    document.getElementById('current-volume').innerText = Math.round(event.target.value * 100) + '%'; 
    
    const min = event.target.min
    const max = event.target.max
    const currentVal = event.target.value
    document.getElementById('volume').style.backgroundSize = ((currentVal - min) / (max - min)) * 100 + "% 100%"
});

function updateActiveTrackStyle(index) {
    const tracks = document.querySelectorAll('.track');
    tracks.forEach((track, i) => {
        if (i === index) {
            track.classList.add('active'); // Добавить класс к активному треку
        } else {
            track.classList.remove('active'); // Удалить класс у остальных треков
        }
    });
    const p = document.querySelectorAll('p');
    p.forEach((p, i) => {
        if (i === index + 1) {
            p.classList.add('active'); // Добавить класс к активному треку
        } else {
            p.classList.remove('active'); // Удалить класс у остальных треков
        }
    });
}

// Обрботчик событий для перемотки
document.getElementById('seek-bar').addEventListener('input', (event) => {
    audio.currentTime = event.target.value;
});

// Обновление ползунка перемотки и текущего времени в процессе воспроизведения
audio.addEventListener('timeupdate', (event) => {
    document.getElementById('seek-bar').value = audio.currentTime;
    document.getElementById('seek-bar').max = audio.duration;

    const seekBar = document.getElementById('seek-bar');
    seekBar.value = audio.currentTime;

    // Форматирование текущего времени
    const currentTime = Math.floor(audio.currentTime);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    const min = seekBar.min;
    const max = seekBar.max;
    const currentVal = seekBar.value;
    seekBar.style.backgroundSize = ((currentVal - min) / (max - min)) * 100 + "% 100%";
    document.getElementById('current-time').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Обновление текста текущего времени
});

// Кнопки для управления
document.getElementById('play').addEventListener('click', () => {
    if (audioSource.src) {
        audio.play();
        document.getElementById('play').disabled = true;
        document.getElementById('play').style.cursor = "not-allowed"
        document.getElementById('pause').disabled = false;
        document.getElementById('pause').style.cursor = "pointer"
    } else {
        playTrack(0);
    }
});

document.getElementById('pause').addEventListener('click', () => {
    audio.pause();
    document.getElementById('play').disabled = false;
    document.getElementById('pause').style.cursor = "pointer"
    document.getElementById('pause').disabled = true;
    document.getElementById('pause').style.cursor = "not-allowed"
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentTrackIndex < document.querySelectorAll('.track').length - 1) {
        playTrack(currentTrackIndex + 1);
    }
});


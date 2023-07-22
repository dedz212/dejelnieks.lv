function translate() {
    var inputText = document.getElementById("text").value;
    var outputElement = document.getElementById("translation");

	if (inputText.trim() === "") {
		outputElement.value = "Введите что-то, чтобы перевести";
		return;
	}

    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', '../assets/json/translations.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var translations = JSON.parse(xhr.responseText);
        var words = inputText.split(" ");
		var translatedWords = [];

        words.forEach(function (word) {
			var translation = translations.translations.find(function (item) {
				return item.ru === word;
			});

			if (translation) {
				var translatedWord = translation.iz;
				translatedWords.push(translatedWord);
			} else {
				translatedWords.push(word);
			}
        });

        var translatedText = translatedWords.join(" ");
        outputElement.value = translatedText;
      }
    };
    xhr.send();
  }

  // Назначение обработчика события на кнопку перевода
  document.getElementById("translate-button").addEventListener("click", translate);
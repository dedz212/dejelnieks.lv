


// POPUP

const popup = document.getElementById("popup");

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
            <li></li>
          </ul>
          <ul class="value">
            <li>English</li>
            <li></li>
          </ul>
        </div>
      </div>
  </div>
  `);
  console.log('tiek izmantots popup.css');
};

if(popup){
  let popupBg = document.querySelector('.modal');
  let popup = document.querySelector('.content');
  let openPopupButtons = document.querySelectorAll('.open-popup');
  let closePopupButton = document.querySelector('.actions');
  
  openPopupButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          popupBg.classList.add('active');
          popup.classList.add('active');
      })
  });
  
  closePopupButton.addEventListener('click', () => {
      popupBg.classList.remove('active');
      popup.classList.remove('active');
  });
  
  document.addEventListener('click', (e) => {
      if (e.target === popupBg) {
          popupBg.classList.remove('active');
          popup.classList.remove('active');
      }
  });
}

// STACK

if(document.querySelector('#gamegame')){
  var stack = document.querySelectorAll(".h");

  if (stack.length) {
    console.log('ir')
  } else {
    console.log('nav')
  }

  for (var i = 0; i < stack.length; i++) {
    stack[i].addEventListener("click", function() {
      this.classList.add("active");
      console.log('nokliksnots');
    });
  }

  const itemsh = document.querySelectorAll('li.h');
  const firstItem = itemsh[0];
  firstItem.addEventListener('click', function() {
    for (let i = 1; i < itemsh.length; i++) {
      itemsh[i].classList.add("hide");
      itemsh[i].classList.remove("h");
    }

    setTimeout(function() {
      for (let i = 1; i < itemsh.length; i++) {
        const elem = itemsh[i];
        elem.remove();
      }
    }, 350);
  });
}
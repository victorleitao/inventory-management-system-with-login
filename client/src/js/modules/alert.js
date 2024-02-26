const showPopUp = (
	popUpBox,
	color,
	message = 'Essa função ainda não foi implementada.',
	duration = 4000
) => {
	if (document.getElementById('closePopup')) {
		return;
	} else {
		const popUp = document.createElement('div');
		popUp.classList.add('popup');
		switch (color) {
			case 'red':
				popUp.classList.add('red');
				break;
			case 'yellow':
				popUp.classList.add('yellow');
				break;
			case 'green':
				popUp.classList.add('green');
				break;
			default:
				popUp.classList.add('gray');
		}
		const popUpText = document.createElement('h4');
		popUpText.innerHTML = message;
		const durationBar = document.createElement('div');
		durationBar.setAttribute('id', 'durationBar');
		durationBar.style.animation = `anim ${duration}ms linear forwards`;
		const closeButton = document.createElement('a');
		closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
		closeButton.setAttribute('id', 'closePopup');
		popUp.appendChild(closeButton);
		popUp.appendChild(popUpText);
		popUp.appendChild(durationBar);
		popUpBox.appendChild(popUp);
		closePopup.addEventListener('click', event => {
			event.preventDefault();
			popUp.remove();
		});
		document.addEventListener('keydown', event => {
			if (event.key == 'Escape') {
				popUp.remove();
			}
		});
		setTimeout(() => {
			popUp.style.opacity = '0';
		}, duration);
		setTimeout(() => {
			closeButton.removeAttribute('id');
		}, duration + 1000);
	}
};

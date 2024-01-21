const showPopUp = (
	popUpBox,
	color,
	mensagem = 'Essa função ainda não foi implementada.'
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
			case 'green':
				popUp.classList.add('green');
				break;
			default:
				popUp.classList.add('gray');
		}
		const popUpText = document.createElement('h4');
		popUpText.innerHTML = mensagem;
		const closeButton = document.createElement('a');
		closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
		closeButton.setAttribute('id', 'closePopup');
		popUp.appendChild(closeButton);
		popUp.appendChild(popUpText);
		popUpBox.appendChild(popUp);
		closePopup.addEventListener('click', event => {
			event.preventDefault();
			popUp.remove();
		});
		setTimeout(() => {
			popUp.style.opacity = '0';
		}, 4000);
		setTimeout(() => {
			closeButton.removeAttribute('id');
		}, 5000);
	}
};

export default showPopUp;

const showConfirmation = (
	popUpBox,
	color = 'yellow',
	mensagem = 'Você tem certeza dessa ação?'
) => {
	if (document.getElementById('closePopup')) {
		return;
	} else {
		const popUp = document.createElement('div');
		popUp.classList.add('confirmation');
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
		popUpText.innerHTML = mensagem;
		const closeButton = document.createElement('a');
		closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
		closeButton.setAttribute('id', 'closePopup');
		const yesButton = document.createElement('button');
		yesButton.innerHTML = 'Sim';
		yesButton.setAttribute('id', 'affirmative');
		const noButton = document.createElement('button');
		noButton.innerHTML = 'Não';
		noButton.setAttribute('id', 'negative');
		popUp.appendChild(closeButton);
		popUp.appendChild(popUpText);
		popUp.appendChild(yesButton);
		popUp.appendChild(noButton);
		popUpBox.appendChild(popUp);
		closePopup.addEventListener('click', event => {
			event.preventDefault();
			popUp.remove();
		});
		affirmative.addEventListener('click', event => {
			popUp.style.opacity = '0';
			closeButton.removeAttribute('id');
			setTimeout(() => {
				popUp.remove();
			}, 200);
			return true;
		});
		negative.addEventListener('click', event => {
			popUp.style.opacity = '0';
			closeButton.removeAttribute('id');
			setTimeout(() => {
				popUp.remove();
			}, 200);
			return false;
		});
	}
};

export default showConfirmation;

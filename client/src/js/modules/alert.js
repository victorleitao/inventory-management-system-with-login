const showPopUp = (mensagem, popUpBox, color) => {
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
	popUp.appendChild(popUpText);
	popUpBox.appendChild(popUp);
	setTimeout(() => {
		popUp.style.opacity = '0';
	}, 4000);
};

export default showPopUp;

function showConfirmationPopup(
	message = 'Tem certeza dessa ação?',
	callback
) {
	if (message === '') {
		message = 'Tem certeza dessa ação?';
	}
	openConfirmationOverlay();
	const confirmationPopup = document.createElement('div');
	confirmationPopup.classList.add('confirmation-box');

	const messageBox = document.createElement('h4');
	messageBox.classList.add('message-box');
	messageBox.innerHTML = message;

	const buttonBox = document.createElement('div');
	buttonBox.classList.add('button-box');

	const yesButton = document.createElement('button');
	yesButton.classList.add('yes-button');
	yesButton.innerText = 'Sim';
	yesButton.addEventListener('click', () => {
		callback(true);
		confirmationPopup.remove();
		closeConfirmationOverlay();
	});

	const noButton = document.createElement('button');
	noButton.classList.add('no-button');
	noButton.innerText = 'Não';
	noButton.addEventListener('click', () => {
		callback(false);
		confirmationPopup.remove();
		closeConfirmationOverlay();
	});

	confirmationPopup.appendChild(messageBox);
	confirmationPopup.appendChild(buttonBox);
	buttonBox.appendChild(yesButton);
	buttonBox.appendChild(noButton);
	document.body.appendChild(confirmationPopup);
}

function openConfirmationOverlay() {
	confirmationOverlay.classList.add('active');
}

function closeConfirmationOverlay() {
	confirmationOverlay.classList.remove('active');
}

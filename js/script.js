let emailField = document.getElementById('Email');
emailField.style.maxHeight = '0';
let signInBtn = document.getElementById('signInBtn');
let signUpBtn = document.getElementById('signUp');
let forgotPasswordBtn = document.getElementById('forgot-password');
let title = document.getElementById('title');

signUpBtn.onclick = function() {
	if (signUpBtn.innerHTML === 'Não possuo cadastro') {
		emailField.style.maxHeight = '44px';
		title.innerHTML = 'Cadastrar';
		signInBtn.innerHTML = 'Cadastrar';
		signUpBtn.innerHTML = 'Já possuo cadastro';
	} else {
		emailField.style.maxHeight = '0';
		title.innerHTML = 'Entrar';
		signInBtn.innerHTML = 'Entrar';
		signUpBtn.innerHTML = 'Não possuo cadastro';
	}
};

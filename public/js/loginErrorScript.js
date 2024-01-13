// LOGIN PAGE
let emailField = document.getElementById('Email-field');
emailField.style.maxHeight = '0';
let signInBtn = document.getElementById('signInBtn');
let signUpBtn = document.getElementById('signUp');
let forgotPasswordBtn = document.getElementById('forgot-password');
let title = document.getElementById('title');
let email = document.getElementById('email');
let name = document.getElementById('name');
let form = document.getElementById('form');
let alertbox = document.getElementById('alert-box');

setTimeout(() => {
	alertbox.style.opacity = '0';
}, 2500);

signUpBtn.onclick = () => {
	if (signUpBtn.innerHTML === 'Não possuo cadastro') {
		email.setAttribute('required', true);
		form.setAttribute('action', '/register');
		emailField.style.maxHeight = '44px';
		title.innerHTML = 'Cadastrar';
		signInBtn.innerHTML = 'Cadastrar';
		signUpBtn.innerHTML = 'Já possuo cadastro';
	} else {
		email.removeAttribute('required');
		form.setAttribute('action', '/login');
		emailField.style.maxHeight = '0';
		title.innerHTML = 'Entrar';
		signInBtn.innerHTML = 'Entrar';
		signUpBtn.innerHTML = 'Não possuo cadastro';
	}
};

signInBtn.onclick = () => {
	sessionStorage.setItem('loggedUser', name.value);
	sessionStorage.setItem('registeredEmail', email.value);
};

forgotPasswordBtn.onclick = () => {
	alert('Função não implementada.');
};

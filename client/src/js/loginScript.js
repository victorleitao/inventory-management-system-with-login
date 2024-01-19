// LOGIN PAGE
import showPopUp from './modules/alert.js';
const emailField = document.getElementById('Email-field');
emailField.style.maxHeight = '0';
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUp');
const forgotPasswordBtn = document.getElementById('forgot-password');
const title = document.getElementById('title');
const email = document.getElementById('email');
const name = document.getElementById('name');
const password = document.getElementById('password');
const form = document.getElementById('form');
const popUpBox = document.getElementById('popUpBox');
let isRegistering = false;

signUpBtn.onclick = () => {
	if (!isRegistering) {
		email.setAttribute('required', true);
		form.setAttribute('action', '/register');
		emailField.style.maxHeight = '44px';
		title.innerHTML = 'Cadastrar';
		signInBtn.innerHTML = 'Cadastrar';
		signUpBtn.innerHTML = 'Já possuo cadastro';
		isRegistering = true;
	} else {
		email.removeAttribute('required');
		form.setAttribute('action', '/login');
		emailField.style.maxHeight = '0';
		title.innerHTML = 'Entrar';
		signInBtn.innerHTML = 'Entrar';
		signUpBtn.innerHTML = 'Não possuo cadastro';
		isRegistering = false;
	}
};

signInBtn.onclick = async () => {
	// const response = await fetch('http://localhost:3001/login', { method: POST });
	// console.log(response);
	// sessionStorage.setItem('registeredEmail', email.value);
	if (!isRegistering) {
		sessionStorage.setItem('loggedUser', name.value);
	} else {
		if (email.value.includes('@')) {
			if (name.value && email.value && password.value) {
				const mensagem = 'Usuário cadastrado com sucesso!';
				showPopUp(mensagem, popUpBox, 'green');
				email.removeAttribute('required');
				emailField.style.maxHeight = '0';
				title.innerHTML = 'Entrar';
				signInBtn.innerHTML = 'Entrar';
				signUpBtn.innerHTML = 'Não possuo cadastro';
				isRegistering = false;
				setTimeout(() => {
					form.setAttribute('action', '/login');
				}, 500);
			}
		} else {
			const mensagem = 'Digite um e-mail válido.';
			showPopUp(mensagem, popUpBox, 'red');
		}
	}
};

forgotPasswordBtn.onclick = () => {
	forgotPasswordBtn.setAttribute('disabled', true);
	const mensagem = 'Essa função ainda não foi implementada.';
	showPopUp(mensagem, popUpBox, 'red');
	setTimeout(() => {
		forgotPasswordBtn.removeAttribute('disabled');
	}, 5000);
};

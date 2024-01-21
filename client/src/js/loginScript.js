// LOGIN PAGE
import showPopUp from './modules/alert.js';
const popUpBox = document.getElementById('popUpBox');
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

let isRegistering = false;

signUpBtn.onclick = () => {
	if (!isRegistering) {
		setRegister();
	} else {
		setLogin();
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
				showPopUp(popUpBox, 'green', mensagem);
				setLogin();
			}
		} else {
			const mensagem = 'Digite um e-mail válido.';
			showPopUp(popUpBox, 'red', mensagem);
		}
	}
};

forgotPasswordBtn.onclick = () => {
	forgotPasswordBtn.setAttribute('disabled', true);
	showPopUp(popUpBox, 'red');
	setTimeout(() => {
		forgotPasswordBtn.removeAttribute('disabled');
	}, 5000);
};

function setLogin() {
	name.focus();
	email.removeAttribute('required');
	emailField.style.maxHeight = '0';
	title.innerHTML = 'Entrar';
	signInBtn.innerHTML = 'Entrar';
	signUpBtn.innerHTML = 'Não possuo cadastro';
	isRegistering = false;
	setTimeout(() => {
		form.setAttribute('action', '/login');
	}, 100);
}

function setRegister() {
	email.focus();
	email.setAttribute('required', true);
	form.setAttribute('action', '/register');
	emailField.style.maxHeight = '44px';
	title.innerHTML = 'Cadastrar';
	signInBtn.innerHTML = 'Cadastrar';
	signUpBtn.innerHTML = 'Já possuo cadastro';
	isRegistering = true;
}

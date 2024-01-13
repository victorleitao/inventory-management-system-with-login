if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const collection = require('./dbconfig');

app.use(
	favicon(
		path.join(__dirname, 'public/assets/images', 'favicon_nunes.ico')
	)
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('./passport-config')(passport);
app.use(
	session({
		secret            : process.env.SESSION_SECRET,
		resave            : false,
		saveUninitialized : false,
		cookie            : { maxAge: 30 * 60 * 1000 }
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/autherror', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/autherror.html'));
});

app.get('/goodregister', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/goodregister.html'));
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/dashboard',
		failureRedirect : '/autherror'
	})
);

app.post('/register', async (req, res) => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(
			req.body.password,
			saltRounds
		);
		const data = {
			id       : Date.now().toString(),
			name     : req.body.name,
			email    : req.body.email,
			password : hashedPassword
		};

		// VERIFICANDO REPETIÇÃO DE NOME DE USUÁRIO
		const existingUser = await collection.findOne({ name: data.name });
		if (existingUser) {
			res.send('Usuário já existe! Favor escolher outro.');
			// res.redirect('/chooseanotherusername')
		} else {
			await collection.insertMany(data);
			res.redirect('/goodregister');
		}
	} catch (error) {
		res.redirect('/');
	}
});

app.delete('/logout', (req, res) => {
	req.logOut(function(err) {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
});

app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/assets')));

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}
	next();
}

app.listen(process.env.PORT || 3000);

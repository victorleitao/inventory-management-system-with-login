if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	name => users.find(user => user.name === name),
	id => users.find(user => user.id === id)
);

const users = [ { name: 'admin', password: 'admin' } ];

app.use(
	favicon(
		path.join(__dirname, 'public/assets/images', 'favicon_nunes.ico')
	)
);
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
	session({
		secret            : process.env.SESSION_SECRET,
		resave            : false,
		saveUninitialized : false
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

app.get('/dashboard', checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/dashboard',
		failureRedirect : '/autherror',
		failureFlash    : true
	})
);

app.post('/register', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		users.push({
			id       : Date.now().toString(),
			name     : req.body.name,
			email    : req.body.email,
			password : hashedPassword
		});
		res.redirect('/');
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

app.listen(3000);

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	name => users.find(user => user.name === name),
	id => users.find(user => user.id === id)
);

const users = [];

app.use(
	favicon(
		path.join(__dirname, 'public/assets/images', 'favicon_nunes.ico')
	)
);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
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

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/dashboard', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/dashboard',
		failureRedirect : '/',
		failureFlash    : true
	})
);

// app.post('/login', (req, res) => {
// 	let name = req.body.name;
// 	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
// });

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
	console.log(users);
});

app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/assets')));

app.listen(3000);

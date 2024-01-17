if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const api = process.env.API_URL;
const userRouter = require('./routers/users');
const categoryRouter = require('./routers/categories');
const productRouter = require('./routers/products');

// Statics
app.use(
	favicon(
		path.join(__dirname, 'public/assets/images', 'favicon_nunes.ico')
	)
);
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/assets')));

// Middleware
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
app.use('/register', userRouter);
app.use(api + '/categories', categoryRouter);
app.use(api + '/products', productRouter);

app.get('/', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/loginerror', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/loginerror.html'));
});

app.get('/registererror', checkNotAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/registererror.html'));
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
		failureRedirect : '/loginerror'
	})
);

app.delete('/logout', (req, res) => {
	req.logOut(function(err) {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
});

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

app.listen(process.env.PORT || 3000, () => {
	// console.log();
});

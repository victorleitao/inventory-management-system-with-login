if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const api = process.env.API_URL;
const CONFIG_URL = './config';
const ROUTE_URL = './routes';
const SERVICES_URL = './services';
const loginRouter = require(ROUTE_URL + '/login');
const registerRouter = require(ROUTE_URL + '/register');
const categoryRouter = require(SERVICES_URL + '/categories');
const productRouter = require(SERVICES_URL + '/products');

// Connecting to DB
require(CONFIG_URL + '/dbconfig');

// Middleware
app.use(express.json());
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
app.use(api + '/categories', categoryRouter);
app.use(api + '/products', productRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// Listen
app.listen(process.env.PORT || 3001);

// const path = require('path');
// const methodOverride = require('method-override');
// const dashboardRouter = require('./routes/dashboard');
// const userRouter = require('./routes/users');

// app.use(methodOverride('_method'));
// app.use('/register', userRouter);

// app.delete('/logout', (req, res) => {
// 	req.logOut(function(err) {
// 		if (err) {
// 			return next(err);
// 		}
// 		res.redirect('/login');
// 	});
// });

// function checkAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect('/');
// }

// function checkNotAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return res.redirect('/dashboard');
// 	}
// 	next();
// }

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
// const path = require('path');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/loginLayout');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.get('/test', (req, res) => {
	res.render('test.ejs', { layout: 'testLayout' });
});

app.get('/', (req, res) => {
	res.render('login.ejs');
});

app.get('/login', (req, res) => {
	res.render('login.ejs');
});

app.post('/login', (req, res) => {
	res.render('dashboard.ejs', { layout: 'layouts/dashboardLayout' });
});

app.post('/register', (req, res) => {
	// res.render('login');
});

app.get('/dashboard', (req, res) => {
	res.render('dashboard.ejs', { layout: 'layouts/dashboardLayout' });
});

app.post('/dashboard', (req, res) => {
	res.render('dashboard.ejs', { layout: 'layouts/dashboardLayout' });
});

app.get('/logout', (req, res) => {
	res.render('login.ejs');
});

app.post('/logout', (req, res) => {
	res.render('login.ejs');
});

// app.post('/login', (req, res) => {});

// app.post(
// 	'/login',
// 	passport.authenticate('local', {
// 		successRedirect : '/dashboard',
// 		failureRedirect : '/loginerror'
// 	})
// );

app.listen(process.env.PORT || 3000);
// const path = require('path');
// const passport = require('passport');
// const session = require('express-session');
// const methodOverride = require('method-override');
// const api = process.env.API_URL;
// const loginRouter = require('./src/js/login');
// const dashboardRouter = require('./routes/dashboard');
// const userRouter = require('./routes/users');
// const categoryRouter = require('./routes/categories');
// const productRouter = require('./routes/products');

// Middleware
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.use('/', loginRouter);
// app.use('/dashboard', dashboardRouter);

// require('./passport-config')(passport);
// app.use(
// 	session({
// 		secret            : process.env.SESSION_SECRET,
// 		resave            : false,
// 		saveUninitialized : false,
// 		cookie            : { maxAge: 30 * 60 * 1000 }
// 	})
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride('_method'));
// app.use('/register', userRouter);
// app.use(api + '/categories', categoryRouter);
// app.use(api + '/products', productRouter);

// app.get('/', checkNotAuthenticated, (req, res) => {
// 	res.render('index.ejs', { name: 'Kyle' });
// 	// res.sendFile(path.join(__dirname, '/index.html'));
// });

// app.get('/loginerror', checkNotAuthenticated, (req, res) => {
// 	res.sendFile(path.join(__dirname, '/public/loginerror.html'));
// });

// app.get('/registererror', checkNotAuthenticated, (req, res) => {
// 	res.sendFile(path.join(__dirname, '/public/registererror.html'));
// });

// app.get('/goodregister', checkNotAuthenticated, (req, res) => {
// 	res.sendFile(path.join(__dirname, '/public/goodregister.html'));
// });

// app.get('/dashboard', checkAuthenticated, (req, res) => {
// 	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
// });

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

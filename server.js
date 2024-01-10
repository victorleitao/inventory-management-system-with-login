const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');

app.use(
	favicon(
		path.join(__dirname, 'public/assets/images', 'favicon_nunes.ico')
	)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {});

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

// app.set('view-engine', 'ejs');

// app.get('/', (req, res) => {
// 	res.render('index.ejs');
// });

// app.use((req, res) => {
// 	res.status(404);
// 	res.send(`<h1>Error 404: Resource not found</h1>`);
// });

// app.set('view-engine');

// app.post('/index', (req, res) => {});

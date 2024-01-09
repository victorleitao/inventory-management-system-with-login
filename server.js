const { log } = require('console');
const express = require('express');
const path = require('path');

const app = express();

app.get('/public', (req, res) => {
	app.use(index);
});

app.listen(3000);

// app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res) => {
// 	res.status(404);
// 	res.send(`<h1>Error 404: Resource not found</h1>`);
// });

// app.set('view-engine');

// app.post('/index', (req, res) => {});

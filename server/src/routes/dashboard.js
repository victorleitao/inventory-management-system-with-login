const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('../views/dashboard');
});

const dashboardRouter = router;

module.exports = dashboardRouter;

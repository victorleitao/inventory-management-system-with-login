const express = require('express');
const router = express.Router();
const passport = require('passport');

// Setting up passport
require('../config/passport-config')(passport);

router.post(
	'/',
	passport.authenticate('local', {
		successRedirect : '/deucerto',
		failureRedirect : '/loginerror'
	})
);

const loginRouter = router;

module.exports = loginRouter;

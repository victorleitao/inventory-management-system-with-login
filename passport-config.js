require('./dbconfig');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const userCollection = require('./models/user');

module.exports = function(passport) {
	async function findUser(name) {
		const username = await userCollection.findOne({ name: name });
		return username;
	}

	async function findUserById(id) {
		const userId = await userCollection.findOne({ id: id });
		return userId;
	}

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await findUserById(id);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	});
	passport.use(
		new LocalStrategy(
			{ usernameField: 'name' },
			async (name, password, done) => {
				try {
					const user = await findUser(name);

					// VERIFICANDO SE USUÁRIO EXISTE
					if (!user) {
						return done(null, false);
					}

					// VERIFICANDO PASSWORD
					if (await bcrypt.compare(password, user.password)) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				} catch (err) {
					done(err, false);
				}
			}
		)
	);
};

const passport = require("passport");
const { Strategy } = require("passport-local");
const { Users } = require("../database/models");
const { comparePassword } = require("../utils/helpers");

passport.serializeUser((user, done) => {
	console.log("Serializing user . . .");
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	console.log("Deserializing user . . .");
	try {
		const user = await Users.findOne({ where: { id: id } });
		if (!user) throw new Error("User not found ");
		done(null, user);
	} catch (err) {
		console.log(err);
		done(err, null);
	}
});

passport.use(
	new Strategy(
		{
			usernameField: "email",
		},
		async (email, password, done) => {
			try {
				if (!email || !password) {
					done(new Error("Bad Request. Missing credentials"), null);
				}
				const userDB = await Users.findOne({ where: { email: email } });
				if (userDB === null) {
					return done(null, false);
				}
				const isValid = comparePassword(password, userDB.dataValues.password);
				if (isValid) {
					done(null, userDB);
				} else {
					done(null, null);
				}
			} catch (err) {
				done(err, null);
			}
		}
	)
);

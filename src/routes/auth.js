const { Router } = require("express");
const router = Router();
const usersInstance = require("../instances/userInstance");
const { hashPassword } = require("../utils/helpers");
const passport = require("passport");
const setInstance = require("../instances/setInstance");

router.post("/register", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) res.sendStatus(404);
	const hashedPassword = hashPassword(password);
	usersInstance
		.createUser(email, hashedPassword)
		.then((r) => {
			res.sendStatus(201);
		})
		.catch((r) => {
			console.log("creating user error");
			console.log(r);
			res.status(403).send(r);
		});
});

router.post("/login", passport.authenticate("local"), (req, res) => {
	res.sendStatus(200);
});

module.exports = router;

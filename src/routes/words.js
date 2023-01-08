const { Router } = require("express");
const router = Router();
const { Words, Words_sets, Sets } = require("../database/models");
const wordInstance = require("../instances/wordInstance");

router.use((req, res, next) => {
	console.log("Calling sets route middlwear");
	if (req.user) return next();
	res.sendStatus(401);
});

router.post("/", (req, res) => {
	const { name, definition, lvl, setName } = req.body;

	if (!name && !definition) {
		return res.sendStatus(422);
	}
	const userId = req.user.dataValues.id;

	wordInstance
		.createWord(name, definition, lvl)
		.then((r) => {
			const wordId = r.dataValues.id;
			Sets.findOne({
				where: {
					name: setName || "no set",
					user_id: userId,
				},
			})
				.then((r) => {
					const setId = r.dataValues.id;
					console.log(`set id: ${setId}`);
					wordInstance
						.createWordSet_Connection(setId, wordId)
						.then((r) => {
							console.log(r);
							res.send(name || definition);
						})
						.catch((r) => {
							console.log(r);
							res.sendStatus(403);
						});
				})
				.catch((r) => {
					console.log(r);
					res.sendStatus(403);
				});
		})
		.catch((r) => {
			console.log(r);
			res.sendStatus(403);
		});
});

module.exports = router;

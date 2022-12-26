const { Router } = require("express");
const router = Router();
const { sets, words, words_sets, users } = require("../database/models");
const setInstance = require("../instances/setInstance");
const db = require("../database/databse");

router.use((req, res, next) => {
	console.log("Calling sets route middlwear");
	if (req.user) return next();
	res.sendStatus(401);
});

router.post("/:setName", (req, res) => {
	const { setName } = req.params;
	console.log(setName);
	if (!setName || !isNaN(setName)) return res.sendStatus(422);
	const userId = req.user.dataValues.id;
	setInstance
		.createSet(userId, setName)
		.then((r) => {
			res.send(setName);
		})
		.catch((r) => res.sendStatus(403));
});
//get sets name /dictionary/set
router.get("/", async (req, res) => {
	const { page } = req.query;
	if (!page) return res.sendStatus(422);
	const userId = req.user.dataValues.id;
	let userName = await users.findOne({ where: { id: userId } });
	console.log("userName.dataValues.email");
	console.log(userName.dataValues.email);
	let setsName = await sets.findAndCountAll({
		limit: 100,
		offset: page * 100,
		where: {
			user_id: userId,
		},
	});
	setsName.rows = setsName.rows.map(({ name }) => name);
	res.send({
		username: userName,
		sets: setsName,
	});
});

router.get("/:setName", async (req, res) => {
	const { setName } = req.params;
	console.log("setName");
	console.log(setName);
	if (!setName) return res.sendStatus(422);
	const userId = req.user.dataValues.id;

	console.log(userId);
	db.query(
		`SELECT words.name, words.definition, words.lvl FROM words INNER JOIN words_sets ON words.id = words_sets.word_id  INNER JOIN sets ON words_sets.set_id = sets.id WHERE sets.user_id = ${userId} AND sets.name = '${setName}'`,
		[userId, setName]
	)
		.then((r) => {
			console.log(r[0]);
			res.send(r[0]);
		})
		.catch((r) => {
			console.log(r);
			res.sendStatus(422);
		});
});

module.exports = router;

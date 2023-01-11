const { Router } = require("express");
const router = Router();
const { Words, Words_sets, Sets, Permissions } = require("../database/models");
const wordInstance = require("../instances/wordInstance");
const { PERMISSIONS } = require("../utils/ENUMS");

router.use((req, res, next) => {
	console.log("Calling sets route middlwear");
	if (req.user) return next();
	res.sendStatus(401);
});

router.post("/", (req, res) => {
	const { name, definition, lvl, set_id } = req.body;

	if (!name && !definition) {
		return res.sendStatus(422);
	}
	const userId = req.user.dataValues.id;

	Permissions.findOne({ where: { UserId: userId, SetId: set_id, permissions: PERMISSIONS.OWNER } }).then(
		(r) => {
			if (!r) {
				//no such set
				return res.sendStatus(403);
			}
		}
	);

	wordInstance
		.createWord(name, definition, lvl || 0, set_id, true)
		.then((r) => {
			console.log(r);
			res.send(r);
		})
		.catch((r) => {
			res.sendStatus(403);
		});
});

module.exports = router;

const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const {
	Words,
	Words_sets,
	Sets,
	Permissions,
	Users,
} = require("../database/models");
const wordInstance = require("../instances/wordInstance");
const { PERMISSIONS } = require("../utils/ENUMS");

router.use((req, res, next) => {
	console.log("Calling sets route middlwear");
	if (req.user) return next();
	res.sendStatus(401);
});

//to add word to set with owner or editable permissions
router.post("/", (req, res) => {
	const { name, definition, lvl, set_id, is_word } = req.body;

	if ((!name && !definition) || !set_id) {
		return res.sendStatus(422);
	}
	const userId = req.user.dataValues.id;
	let access, set;
	Permissions.findOne({
		where: {
			UserId: userId,
			SetId: set_id,
			permissions: { [Op.in]: [PERMISSIONS.OWNER, PERMISSIONS.EDITABLE] },
		},
	})
		.then((r) => {
			access = r;
			if (!access) {
				console.log("No such set with permission");
				res.sendStatus(422);
			}
			access.getSet().then((r) => {
				set = r;
				set
					.createWord({
						name: name || null,
						definition: definition || null,
						lvl: lvl || 0,
						is_word: is_word || true,
					})
					.then((r) => {
						res.send(r.toJSON());
					});
			});
		})
		.catch((r) => {
			res.sendStatus(422);
		});
});

router.patch("/", (req, res) => {
	const { set_id, word } = req.body;
	if (!set_id || !word || !word.id) {
		return res.sendStatus(422);
	}
	let word_id = word.id;
	delete word.id;
	const userId = req.user.dataValues.id;
	let access, set;
	Permissions.findOne({
		where: {
			SetId: set_id,
			UserId: userId,
			permissions: { [Op.in]: [PERMISSIONS.OWNER, PERMISSIONS.EDITABLE] },
		},
	})
		.then((r) => {
			if (!r) {
				// no permission
				return res.sendStatus(422);
			}
			if (r) {
				access = r;
				access.getSet().then((r) => {
					wordInstance
						.updateWord(r, word_id, word)
						.then((r) => {
							return res.send(r);
						})
						.catch((r) => {
							return res.sendStatus(422);
						});
				});
			}
		})
		.catch((r) => {
			return res.sendStatus(422);
		});
});

module.exports = router;

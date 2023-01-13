const { Router } = require("express");
const router = Router();
const { PERMISSIONS } = require("../utils/ENUMS");
const { Op } = require("sequelize");

const {
	Sets,
	Words,
	Words_sets,
	Users,
	Permissions,
} = require("../database/models");
const setInstance = require("../instances/setInstance");
const db = require("../database/databse");
const permissionInstance = require("../instances/setInstance");

router.use((req, res, next) => {
	console.log("Calling sets route middlwear");
	if (req.user) return next();
	res.sendStatus(401);
});

//creating set for current user UPDATED
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

//get sets name /dictionary/set in permission pass permission UPDATED
router.get("/permissions/:permissions", async (req, res) => {
	const { permissions } = req.params;
	if (!permissions) return res.sendStatus(422);
	const userId = req.user.dataValues.id;
	setInstance
		.getCultivatedSetsNames(userId, permissions)
		.then((r) => {
			res.send(r);
		})
		.catch((r) => {
			res.sendStatus(403);
		});
	// res.send({
	// 	username: userName.email,
	// 	sets: setsName,
	// });
});

//get words from set UPDATED
router.get("/:set_id", async (req, res) => {
	const { set_id } = req.params;

	if (!set_id) return res.sendStatus(422);
	const userId = req.user.dataValues.id;

	let access, set;
	Permissions.findOne({
		where: {
			UserId: userId,
			SetId: set_id,
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
				set.getWords({ raw: true }).then((r) => {
					let words = r.map((word) => {
						return {
							id: word.id,
							name: word.name,
							definition: word.definition,
							lvl: word.lvl,
							is_word: word.is_word,
						};
					});
					res.send(words);
				});
			});
		})
		.catch((r) => {
			res.sendStatus(422);
		});
});

module.exports = router;

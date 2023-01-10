const { Router } = require("express");
const router = Router();
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

//creaying set for current user UPDATED
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
	let userName = await Users.findOne({ where: { id: userId } });
	console.log("userName.dataValues.email");
	console.log(userName.dataValues.email);
	let setsName = await Sets.findAndCountAll({
		limit: 100,
		offset: page * 100,
		where: {
			user_id: userId,
		},
	});
	setsName.rows = setsName.rows.map(({ name }) => name);
	res.send({
		username: userName.email,
		sets: setsName,
	});
});

router.get("/:setName", async (req, res) => {
	const { setName } = req.params;
	if (!setName) return res.sendStatus(422);
	const userId = req.user.dataValues.id;

	await setInstance
		.getCurrentUserSet(userId, setName)
		.then((words) => {
			const data = words.map((word) => {
				return {
					name: word.name,
					definition: word.definition,
					lvl: word.lvl,
				};
			});
			res.send(data);
		})
		.catch((r) => {
			console.log(r);
			res.sendStatus(403);
		});
});

router.post("/permissions/add", async (req, res) => {
	const { user, setName, enableEdit } = req.body;
	if (!user || !setName) {
		return res.sendStatus(400);
	}
	const ownerUserId = req.user.dataValues.id;
	let setId, permissionUserId;

	Users.findOne({ raw: true, where: { email: user } }).then((r) => {
		if (r.id) {
			permissionUserId = r.id;
		} else {
			res.status(422);
		}
	});

	Sets.findOne({ raw: true, where: { user_id: ownerUserId, name: setName } })
		.then((r) => {
			if (r.id) {
				setId = r.id;
			} else {
				res.status(422);
			}
			setInstance
				.createPermissions(permissionUserId, setId, enableEdit || false)
				.then((r) => {
					console.log(r);
				})
				.catch((r) => {
					//permission exists
					console.log(r);
				});
		})
		.catch((r) => res.sendStatus(422));
});

router.get("/getOtherSet/:user/:setName", async (req, res) => {
	const { user, setName } = req.params;
	if (!user || !setName) {
		res.sendStatus(400);
	}
	const userId = req.user.dataValues.id;
});

module.exports = router;

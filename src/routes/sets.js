const { Router } = require("express");
const router = Router();
const {
	Sets,
	Words,
	Words_sets,
	Users,
	permissions,
} = require("../database/models");
const setInstance = require("../instances/setInstance");
const db = require("../database/databse");
const permissionInstance = require("../instances/setInstance");

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
	console.log("setName");
	console.log(setName);
	if (!setName) return res.sendStatus(422);
	const userId = req.user.dataValues.id;

	console.log(userId);
	db.query(
		`SELECT Words.name, Words.definition, Words.lvl FROM Words INNER JOIN Words_sets ON Words.id = Words_sets.WordId  INNER JOIN Sets ON Words_sets.SetId = Sets.id WHERE Sets.user_id = ${userId} AND Sets.name = '${setName}'`,
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

router.post("/permissions/add", async (req, res) => {
	const { user, setName, enableEdit } = req.body;
	if (!user || !setName) {
		return res.sendStatus(400);
	}
	console.log(user);
	console.log(setName);
	const userId = req.user.dataValues.id;
	const setRespons = await Sets.findOne({
		where: { user_id: userId, name: setName },
	});
	const userResponse = await Users.findOne({ where: { email: user } });
	if (!setRespons || !userResponse) {
		return res.sendStatus(400);
	}
	const setId = setRespons.dataValues.id;
	const permnissionuserId = userResponse.dataValues.id;
	console.log("setId");
	console.log(setId);
	console.log("user:");
	console.log(permnissionuserId);
	permissionInstance
		.createPermissions(permnissionuserId, setId, enableEdit)
		.then((r) => {
			console.log(r);
			res.sendStatus(200);
		})
		.catch((r) => {
			//wysli error
			console.log("error:");
			console.log(r);
			return res.sendStatus(400);
		});
});

router.get("/getOtherSet/:user/:setName", async (req, res) => {
	const { user, setName } = req.params;
	if (!user || !setName) {
		res.sendStatus(400);
	}
	console.log(user);
	console.log(setName);
	const userResponse = await Users.findOne({ where: { email: user } });
	if (!userResponse) {
		// wuslij info o braku usera
		return res.sendStatus(400);
	}
	const permnissionuserId = userResponse.dataValues.id;
	const setResponse = await Sets.findOne({
		where: { user_id: permnissionuserId, name: setName },
	});
	if (!setResponse) {
		//wyrzuc info o braku takiego zestawu
		return res.sendStatus(400);
	}
	const setId = setResponse.dataValues.id;
	const permissionResponse = await permissions.findOne({
		where: { user_id: permnissionuserId, set_id: setId },
	});
	console.log(permissionResponse);
	if (!permissionResponse) {
		//wyrzucic blad brak uprawnien
		return res.sendStatus(400);
	}
	const enableEdit = permissionResponse.dataValues.editable;
	db.query(
		`SELECT Words.name, Words.definition, Words.lvl FROM Words INNER JOIN Words_sets ON Words.id = Words_sets.WordId  INNER JOIN Sets ON Words_sets.SetId = Sets.id WHERE Sets.user_id = ${permnissionuserId} AND Sets.name = '${setName}'`,
		[permnissionuserId, setName]
	)
		.then((r) => {
			console.log(r[0]);
			return res.send({
				words: r[0],
				enableEdit: enableEdit ? true : false,
				setName: setName,
				owner: user,
			});
		})
		.catch((r) => {
			console.log(r);
			return res.sendStatus(422);
		});
});

module.exports = router;

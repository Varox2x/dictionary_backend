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

// router.get("/:setName", async (req, res) => {
// 	const { setName } = req.params;
// 	if (!setName) return res.sendStatus(422);
// 	const userId = req.user.dataValues.id;

// 	await setInstance
// 		.getCurrentUserSet(userId, setName)
// 		.then((words) => {
// 			const data = words.map((word) => {
// 				return {
// 					name: word.name,
// 					definition: word.definition,
// 					lvl: word.lvl,
// 				};
// 			});
// 			res.send(data);
// 		})
// 		.catch((r) => {
// 			console.log(r);
// 			res.sendStatus(403);
// 		});
// });



module.exports = router;

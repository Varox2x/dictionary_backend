const { Router } = require("express");
const router = Router();
const {
	sets,
	words,
	words_sets,
	users,
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

router.post("/permissions/add", async (req, res) => {
	const { user, setName, enableEdit } = req.body;
	if (!user || !setName) {
		return res.sendStatus(400);
	}
	console.log(user);
	console.log(setName);
	const userId = req.user.dataValues.id;
	const setRespons = await sets.findOne({
		where: { user_id: userId, name: setName },
	});
	const userResponse = await users.findOne({ where: { email: user } });
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
	//usyskaj z nazwy user id danego usera - jesli nie ma w resp wyrzuc błąd
	//poszukaj w tabeli set id o nazwie setname oraz userId - jesli nie ma wyrzuc blad
	// sprawdz w tabeli premissions po user id (ten wysylajacy zapytanie) oraz set_id czy istnieje (jesli nie zwroc blad) jesli tak zwroc editable
	//pobierz wyrazy z setu
	//w resp wyrzuć nazwe setu, imie wlasciciela setu, wyrazy[]
	res.sendStatus(200);
});

module.exports = router;

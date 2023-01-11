const { where } = require("sequelize");
const { Sets, Permissions, Users } = require("../database/models");
const { PERMISSIONS } = require("../utils/ENUMS");

//updated
const createSet = async (user_id, name) => {
	let User;
	return Users.findOne({ where: { id: user_id } }).then((r) => {
		User = r;
		console.log(r);
		return User.createSet({ name: name })
			.then((r) => {
				console.log(r);
			})
			.catch((r) => {
				throw r;
			});
	});
};

//updated
const getCultivatedSetsNames = async (user_id, permissions) => {
	if (!PERMISSIONS[permissions]) {
		throw "no such permission";
	}
	return Users.findAll({
		joinTableAttributes: ["selfGranted"],
		where: { id: user_id },
		raw: true,
		include: [
			{
				model: Sets,
				through: {
					where: { permissions: permissions },
				},
			},
		],
	})
		.then((r) => {
			let response = r.map((setInfo) => {
				return { name: setInfo["Sets.name"], pk: setInfo["Sets.id"] };
			});
			return response;
		})
		.catch((r) => {
			throw r;
		});
};

exports.createSet = createSet;
exports.getCultivatedSetsNames = getCultivatedSetsNames;

const { where } = require("sequelize");
const { Sets, Permissions, Users } = require("../database/models");
const { PERMISSIONS } = require("../utils/ENUMS");

//updated
const createSet = async (user_id, name) => {
	let User, newSet;
	return Users.findOne({ where: { id: user_id } }).then((r) => {
		User = r;
		return User.createSet({ raw: true, name: name })
			.then((r) => {
				newSet = r.toJSON();
				return { id: newSet.id, name: newSet.name };
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
				return { name: setInfo["Sets.name"], id: setInfo["Sets.id"] };
			});
			return response;
		})
		.catch((r) => {
			throw r;
		});
};

exports.createSet = createSet;
exports.getCultivatedSetsNames = getCultivatedSetsNames;

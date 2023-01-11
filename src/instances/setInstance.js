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
	}).then((r) => {
		console.log("wartosci");
		console.log(r[0]);
		let response = r.map((setInfo) => {
			return { name: setInfo["Sets.name"], pk: setInfo["Sets.id"] };
		});
		return response;
	});
};

const getCurrentUserSet = async (user_id) => {
	let set;
	return Permissions.findAll({
		where: { user_id: user_id, permissions: PERMISSIONS.OWNER },
	}).then((r) => {
		console.log(r);
	});
};

const createPermissions = async (user_id, set_id, enableEdit) => {
	const permission = Permissions.build({
		user_id: user_id,
		set_id: set_id,
		enableEdit: enableEdit,
	});

	return await permission
		.save()
		.then((r) => {
			console.log("permission to database success :)");
			console.log("//");
			return r;
		})
		.catch((r) => {
			console.log("Failed while adding permission :(");
			console.log("//");
			throw "permission exists";
		});
};

exports.createSet = createSet;
exports.getCultivatedSetsNames = getCultivatedSetsNames;
exports.getCurrentUserSet = getCurrentUserSet;
exports.createPermissions = createPermissions;

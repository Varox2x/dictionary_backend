const { Sets, Permissions, Users } = require("../database/models");

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

const getCurrentUserSet = async (user_id, name) => {
	let set;
	return Sets.findOne({ where: { user_id: user_id, name: name } }).then((r) => {
		set = r;
		if (!r) throw "no such set";
		return set
			.getWords({ raw: true, attributes: ["name", "definition", "lvl"] })
			.then((r) => {
				return r;
			});
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
exports.getCurrentUserSet = getCurrentUserSet;
exports.createPermissions = createPermissions;

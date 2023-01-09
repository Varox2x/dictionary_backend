const { Sets, Permissions } = require("../database/models");

const createSet = async (user_id, name) => {
	const set = Sets.build({ user_id: user_id, name: name });

	return await set
		.save()
		.then((r) => {
			console.log("set to database success :)");
			console.log("//");
			return r;
		})
		.catch((r) => {
			console.log("Failed while adding set :(");
			console.log("//");
			throw "user exists";
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

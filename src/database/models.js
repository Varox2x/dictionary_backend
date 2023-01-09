const { DataTypes } = require("sequelize");
const db = require("./databse");

const Users = db.define(
	"Users",
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{}
);

const Sets = db.define(
	"Sets",
	{
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["user_id", "name"],
			},
		],
	}
);

const Words = db.define("Words", {
	name: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	definition: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	lvl: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});

const Words_sets = db.define(
	"Words_sets",
	{
		words_setsId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
	},
	{
		timestamps: false,
	}
);

//table permission
// set_id - setreference
// user_id - user we want to have permission

const Permissions = db.define(
	"Permissions",
	{
		set_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Sets",
				key: "id",
			},
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		enableEdit: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["user_id", "set_id"],
			},
		],
	}
);

Words.belongsToMany(Sets, { through: Words_sets });
Sets.belongsToMany(Words, { through: Words_sets });


db.sync().then(() => {
	console.log("Tables Created");
});

module.exports = { Users, Sets, Words, Words_sets, Permissions };

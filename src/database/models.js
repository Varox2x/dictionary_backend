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

const Sets = db.define("Sets", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	is_public: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
});

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
	is_word: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
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

const Permissions = db.define("Permissions", {
	permissionsId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	permissions: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "EDITABLE",
	},
});

Words.belongsToMany(Sets, { through: Words_sets });
Sets.belongsToMany(Words, { through: Words_sets });

Words_sets.belongsToMany(Users, { through: Permissions });
Users.belongsToMany(Words_sets, { through: Permissions });

db.sync().then(() => {
	console.log("Tables Created");
});

module.exports = { Users, Sets, Words, Words_sets, Permissions };

const { DATABASE_TYPES } = require("../utils/ENUMS");

const wordKeys = [
	{ key: "name", type: DATABASE_TYPES.STRING, max: 50 },
	{ key: "definition", type: DATABASE_TYPES.STRING, max: 50 },
	{ key: "lvl", type: DATABASE_TYPES.NUMBER, max: 4 },
	{ key: "is_word", type: DATABASE_TYPES.BOOLEAN },
];

const wordValidation = async (word) => {
	for (const [key, value] of Object.entries(word)) {
		var checkKeyExists = wordKeys.some((wordCheck) => wordCheck.key == key);
		if (!checkKeyExists) {
			throw "undesirable key";
		}
		let wordCheck = wordKeys.filter((wordCheck) => wordCheck.key == key)[0];
		if (typeof value !== wordCheck.type) {
			throw `wrong data type in: ${key} - expected: ${wordCheck.type}`;
		}
		if (typeof value === DATABASE_TYPES.NUMBER) {
			if (value < 0 || value > 6) {
				throw `wrong data in ${key}`;
			}
		}
		if (typeof value === DATABASE_TYPES.STRING) {
			if (value.length == 0) {
				throw `too few characters in ${key}`;
			}
			if (value.length > wordCheck.max) {
				throw `too much characters in ${key} - avaible only ${wordCheck.max}`;
			}
		}
	}
	return true
};

module.exports = {
	wordValidation,
};

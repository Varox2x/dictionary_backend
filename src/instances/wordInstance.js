const { Sets, Words, Words_sets } = require("../database/models");
const { wordValidation } = require("../validation/wordValidation");

const createWord = async (name, definition, lvl, set_id, is_word) => {
	let Set, word;
	return Sets.findOne({ where: { id: set_id } }).then((r) => {
		Set = r;
		return Set.createWord({
			name: name || null,
			definition: definition || null,
			lvl: lvl || 0,
			is_word: is_word || true,
		})
			.then((r) => {
				return r;
			})
			.catch((r) => {
				throw r;
			});
	});
};
// {word_id, name, definition, lvl, is_word}
let data = {
	name: "kuku",
	definition: "definicjaaaa",
	lvl: 3,
	is_word: false,
};
const updateWord2 = async (data, id) => {
	let word;
	wordValidation(data).catch((r) => {
		throw r;
	});
	return Words.findOne({ where: { id: id } }).then((r) => {
		if (!r) {
			throw "";
		}
		word = r;
		for (const [key, value] of Object.entries(data)) {
			word[key] = value;
		}
		return r
			.save({ raw: false })
			.then((r) => {
				return data;
			})
			.catch((r) => {
				throw r;
			});
	});
};

const updateWord = async (set, word_id, data) => {
	let word;
	await wordValidation(data).catch((r) => {
		throw r;
	});
	return set.getWords({ where: { id: word_id } }).then((r) => {
		if (!r) {
			throw "no such word";
		}
		word = r[0];
		for (const [key, value] of Object.entries(data)) {
			word[key] = value;
		}
		return word
			.save({ raw: false })
			.then((r) => {
				return data;
			})
			.catch((r) => {
				throw r;
			});
	});
};

exports.createWord = createWord;
exports.updateWord = updateWord;

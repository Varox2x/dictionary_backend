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
const updateWord = async (data) => {
	let word;
	wordValidation(data).catch((r) => {
		throw r;
	});
	return Words.findOne({ where: { id: 1 } }).then((r) => {
		console.log(r);
		if (r) {
			word = r;
			for (const [key, value] of Object.entries(data)) {
				word[key] = value;
			}
			r.save({ raw: false })
				.then((r) => {
					console.log(r);
				})
				.catch((r) => {
					console.log(r);
				});
		}
	});
};

updateWord(data);

exports.createWord = createWord;

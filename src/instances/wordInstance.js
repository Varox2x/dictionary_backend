const { Sets, Words, Words_sets } = require("../database/models");

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

exports.createWord = createWord;

const { Sets, Words, Words_sets } = require("../database/models");

const createWord = async (name, definition, lvl, setName, user_id) => {
	let set, word;
	return Sets.findOne({ where: { user_id: user_id, name: setName } })
		.then((r) => {
			if (!r) throw "no such set";
			return r;
		})
		.then((r) => {
			set = r;
			return Words.create({ name: name, definition: definition, lvl: lvl });
		})
		.then((r) => {
			word = r;
			return set.addWords(word);
		})
        .catch(r => {
            throw 'failed while adding word'
        })
};

const createWordSet_Connection = async (set_id, word_id) => {
	const word_set = Words_sets.build({ SetId: set_id, WordId: word_id });

	return await word_set
		.save()
		.then((r) => {
			console.log("connection added to database success :)");
			console.log("//");
			return r;
		})
		.catch((r) => {
			console.log("Failed while adding connection :(");
			console.log("//");
			throw "user can't add connection";
		});
};

exports.createWord = createWord;
exports.createWordSet_Connection = createWordSet_Connection;

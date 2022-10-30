const {sets, words, words_sets} = require('../database/models')

const createWord = async (name, definition, lvl) => {

    const word = words.build({name: name, definition: definition, lvl: lvl})

    return await word.save()
    .then(r => {
        console.log('word added to database success :)')
        console.log("//")
        return r
    })
    .catch(r => {
        console.log("Failed while adding word :(")
        console.log("//")
        throw "can't add word"
    })
}


const createWordSet_Connection = async (set_id, word_id) => {

    const word_set = words_sets.build({set_id: set_id, word_id: word_id})

    return await word_set.save()
    .then(r => {
        console.log('connection added to database success :)')
        console.log("//")
        return r
    })
    .catch(r => {
        console.log("Failed while adding connection :(")
        console.log("//")
        throw "user can't add connection"
    })
}




exports.createWord = createWord
exports.createWordSet_Connection = createWordSet_Connection
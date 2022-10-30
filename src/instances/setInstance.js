const {sets} = require('../database/models')

const createSet = async (user_id, name) => {

    const set = sets.build({user_id: user_id, name: name})

    return await set.save()
    .then(r => {
        console.log('set to database success :)')
        console.log("//")
        return r
    })
    .catch(r => {
        console.log("Failed while adding set :(")
        console.log("//")
        throw "user exists"
    })
}








exports.createSet = createSet
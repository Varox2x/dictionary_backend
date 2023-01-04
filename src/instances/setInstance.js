const {sets, permissions} = require('../database/models')

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


const createPermissions = async (user_id, set_id, enableEdit) => {

    const permission = permissions.build({user_id: user_id, set_id: set_id, enableEdit: enableEdit})

    return await permission.save()
    .then(r => {
        console.log('permission to database success :)')
        console.log("//")
        return r
    })
    .catch(r => {
        console.log("Failed while adding permission :(")
        console.log("//")
        throw "permission exists"
    })
}








exports.createSet = createSet
exports.createPermissions = createPermissions
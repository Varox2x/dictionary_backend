const {users} = require('../database/models')

const createUser = async (email, password) => {

    const user = users.build({email: email, password: password})

    return await user.save()
    .then(r => {
        console.log('added to database success :)')
        console.log("//")
        return r
    })
    .catch(r => {
        console.log("Failed while adding user :(")
        console.log("//")
        throw "user exists"
    })
}




exports.createUser = createUser
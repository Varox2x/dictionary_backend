const {Router} = require('express')
const router = Router();
const {sets, words, words_sets} = require('../database/models')
const setInstance = require('../instances/setInstance')
const db = require('../database/databse')

router.use((req, res, next) => {
    console.log("Calling sets route middlwear")
    if(req.user) return next()
    res.sendStatus(401)
})

router.post("/:setName", (req,res) => {
    const {setName} = req.params;
    console.log(setName)
    if(!setName || !isNaN(setName)) return res.sendStatus(422)
    const userId = req.user.dataValues.id;
    setInstance.createSet(userId, setName)
        .then(r => {
            res.send(setName);
        })
        .catch(r => res.sendStatus(403))
    
})

router.get("/", async (req, res) => {
    const {page} = req.query;
    const setsName = await sets.findAndCountAll({
        limit: 100,
        offset: page * 100
    })
    res.send(setsName)
})

router.get("/:setName",async (req,res) => {
    const {setName} = req.params;
    console.log(setName)
    if(!setName) return res.sendStatus(422)
    const userId = req.user.dataValues.id;

    console.log(userId)
    db.query(`SELECT words.name, words.definition, words.lvl FROM words INNER JOIN words_sets ON words.id = words_sets.word_id  INNER JOIN sets ON words_sets.set_id = sets.id WHERE sets.user_id = ${userId}`,[userId])
    .then(r => {
        console.log(r[0])
        res.send(r[0])
    })
    .catch(r => res.sendStatus(422))

})


module.exports = router;

const {Router} = require('express')
const router = Router();
const {sets} = require('../database/models')
const setInstance = require('../instances/setInstance')

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

module.exports = router;

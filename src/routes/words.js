const {Router} = require('express')
const router = Router();
const {sets} = require('../database/models')

router.use((req, res, next) => {
    console.log("Calling words route middlwear")
    if(req.user) return next()
    res.sendStatus(401)
})

router.post("/", (req,res) => {
    const {set_name} = req.body;
    if(!set_name) return res.sendStatus(422)
    res.send(set_name);
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

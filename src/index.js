const express = require('express');
const app = express();
const dotenv = require('dotenv')
const db = require('./database/databse')
const passport = require('passport')
const session = require('express-session')
const authRoute = require('./routes/auth')
const setRoute = require('./routes/sets')
const setInstance = require('./instances/setInstance')
require('./strategies/local.js')
dotenv.config();

const PORT = process.env.PORT;

db.authenticate()
.then(() => console.log('Database connected . . .'))
.catch( err => console.log(err))


app.use(
    session({
        secret: "GREGDRGRGRDGRDHB",
        resave: false,
        saveUninitialized: false,
    })
)
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session())

app.use(('/auth'), authRoute);
app.use(('/dictionary/set'), setRoute);

// for(let i = 0; i < 25; i++){
//     setInstance.createSet(1, `test${i}`)
//     .then(r => console.log(r))
//     .catch(r => console.log(r))
// }


app.listen(PORT, () => {
    console.log(`App listening at port: ${PORT}`)
});
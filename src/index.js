const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db = require("./database/databse");
const passport = require("passport");
const session = require("express-session");
const authRoute = require("./routes/auth");
const setRoute = require("./routes/sets");
const wordRoute = require("./routes/words");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./strategies/local.js");
dotenv.config();

const PORT = process.env.PORT;

db.authenticate()
	.then(() => console.log("Database connected . . ."))
	.catch((err) => console.log(err));

const options = {
	credentials: true,
	origin: "http://localhost:3000",
};
app.use(cors(options));
app.use(
	session({
		secret: "GREGDRGRGRDGRDHB",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(function errorHandler(err, req, res, next) {
	res.send("error happened " + err.message);
});

app.use("/auth", authRoute);
app.use("/dictionary/set", setRoute);
app.use("/dictionary/word", wordRoute);

app.listen(PORT, () => {
	console.log(`App listening at port: ${PORT}`);
});

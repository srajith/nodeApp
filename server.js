require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initialize = require('./utils/passport-config');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const app = express();
const methodOverride = require('method-override');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', e => console.log(e));
db.on('open', () => console.log("Database connected !"));


initialize(passport);

app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.urlencoded({
    extended: false
}));
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(process.env.LOG_LEVEL));
app.use(methodOverride('_method'));
app.use(helmet());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

app.use("/", require('./routes/index'));


let port = process.env.PORT || 3000;
app.listen(port, () => console.log("app listening on http://localhost:" + port));
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./Utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const usersRoutes = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localPassport = require('passport-local');
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const dbUrl= process.env.DB_URL
//const dbUrl= 'mongodb://127.0.0.1:27017/yelp-camp';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", (e)=>{
    console.log('error',e);
})
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log("DB Connected");
}
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store,
    name:'nawras',
    secret: 'thisWillBeBetter',
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly : true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7, 
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo= req.originalUrl;
    }
   res.locals.success =  req.flash('success');
   res.locals.error =  req.flash('error');
   res.locals.currentUser = req.user;
   next();
});


app.use('/',usersRoutes);
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/reviews', reviewRoutes);


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'oh no Something Went wrong'
    res.status(statusCode).render('error.ejs', { err });
});

app.listen(3000, () => {
    console.log("on the listen part");
});

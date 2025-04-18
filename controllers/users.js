const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs');
}


module.exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to Yelp Camp!');
            res.redirect('/campground');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login =(req, res) => {
    req.flash('success', 'welcome back ');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
        res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campground');
    })
}


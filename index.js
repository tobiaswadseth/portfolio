const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const axios = require('axios');

const cookieSession = require('cookie-session');

const monk = require('monk');

const langFile = require('./language.json');

const app = express();

const path = require('path');

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);

const langDB = db.get('lang');
const portDB = db.get('port');
const portcatsDB = db.get('portcats');

const getLangFile = async (langKey) => {
    return await langDB.findOne({ lang: langKey }, {});
}

const getProjects = async () => {
    return await portDB.find({},{});
}

const getCats = async () => {
    return await portcatsDB.find({},{});
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

const BASE_URL = process.env.ENVIRONMENT === 'PRODUCTION' ? 'https://tobiaswadseth.com' : 'http://127.0.0.1:3000';

passport.use(new GitHubStrategy({
    clientID: process.env.ENVIRONMENT === 'PRODUCTION' ? process.env.GITHUBCLIENTID : process.env.GITHUBCLIENTIDLOCAL,
    clientSecret: process.env.ENVIRONMENT === 'PRODUCTION' ? process.env.GITHUBCLIENTSECRET : process.env.GITHUBCLIENTSECRETLOCAL,
    callbackURL: BASE_URL + '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    if (profile.id == process.env.GITHUBUSERID) {
        let user = {
            id: profile.id,
            name: profile.displayName
        }
        done(null, user);
    }
}))

app.set('trust proxy', true);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIESECRET]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSIONSECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static('./public'));

// Projects
app.use('/projects/bitcoin-clicker', express.static('./projects/bitcoin-clicker'));
app.use('/projects/wu1-final', express.static('./projects/wu1-final'));

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
};

const ensureNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { res.redirect('/'); }
    return next();
}

app.get('/', async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/home', {
        activeLang: langFile.lang,
        lang: langFile.index,
        header: langFile.header,
        footer: langFile.footer,
        page: 'home',
        user: req.user
    });
});

app.get('/resume', async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/resume', {
        activeLang: langFile.lang,
        lang: langFile.resume,
        header: langFile.header,
        footer: langFile.footer,
        page: 'resume',
        user: req.user
    });
});

app.get('/works', async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/works', {
        activeLang: langFile.lang,
        lang: langFile.works,
        header: langFile.header,
        footer: langFile.footer,
        page: 'works',
        user: req.user,
        projectcategories: await getCats(),
        projects: await getProjects()
    });
});

app.get('/contact', async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/contact', {
        activeLang: langFile.lang,
        lang: langFile.contact,
        header: langFile.header,
        footer: langFile.footer,
        page: 'contact',
        user: req.user
    });
});

app.get('/files/:file', (req, res) => {
    if (req.params.file === 'cv') {
        res.sendFile(path.join(__dirname, '/files/CV.pdf'));
    } else if (req.params.file === 'gymnasiearbete') {
        res.sendFile(path.join(__dirname, '/files/Gymnasiearbete R.L. T.W..pdf'));
    }
});

// Admin
// TODO: Add admin panel and switch to db storage for portfolio items and language

app.get('/login', ensureNotAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('admin/pages/login', {
        activeLang: langFile.lang,
        lang: langFile.resume,
        header: langFile.header,
        footer: langFile.footer,
        page: 'login',
        user: req.user
    })
});

app.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/admin', ensureAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('admin/pages/home', {
        activeLang: langFile.lang,
        lang: langFile.resume,
        header: langFile.header,
        footer: langFile.footer,
        page: 'admin',
        user: req.user
    })
});

app.get('/admin/portfolio', ensureAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('admin/pages/portfolio', {
        activeLang: langFile.lang,
        lang: langFile.resume,
        header: langFile.header,
        footer: langFile.footer,
        page: 'admin-portfolio',
        user: req.user
    })
});

app.get('/admin/language', ensureAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('admin/pages/language', {
        activeLang: langFile.lang,
        lang: langFile.resume,
        header: langFile.header,
        footer: langFile.footer,
        page: 'admin-language',
        user: req.user
    })
});

app.get('/auth/github', ensureNotAuthenticated && passport.authenticate('github', { scope: [ 'user:email' ]}), (req, res) => {});

app.get('/auth/github/callback', ensureNotAuthenticated && passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

app.post('/admin/portfolio/update', ensureAuthenticated, async (req, res) => {

});

// Lang and errors

app.get('/se', (req, res) => {
    res.cookie('lang', 'se', { expire: (2592 * (10^6)) + Date.now() });
    res.redirect(req.headers.referer);
});

app.get('/en', (req, res) => {
    res.cookie('lang', 'en', { expire: (2592 * (10^6)) + Date.now() });
    res.redirect(req.headers.referer);
});

app.use(async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');

    res.status(404).render('pages/error', {
        activeLang: langFile.lang,
        lang: langFile[404],
        header: langFile.header,
        footer: langFile.footer,
        page: '404'
    });
});

app.use(async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');

    res.status(500).render('pages/error', {
        activeLang: langFile.lang,
        lang: langFile[500],
        header: langFile.header,
        footer: langFile.footer,
        page: '500'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));
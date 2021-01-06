const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const axios = require('axios');

const cookieSession = require('cookie-session');

const monk = require('monk');

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

const getLangFiles = async () => {
    return await langDB.find({},{});
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
console.log(BASE_URL);

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

app.get('/login', ensureNotAuthenticated, (req, res) => {
    res.redirect('/auth/github');
});

app.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/admin/getlang', ensureAuthenticated, async (req, res) => {
    const langFiles = await getLangFiles();
    if (langFiles) {
        res.json({
            ok: true,
            lang: langFiles
        });
    } else {
        res.json({
            ok: false
        });
    }
});

app.post('/admin/updatelang', ensureAuthenticated, async (req, res) => {
    let enRes = await langDB.findOneAndUpdate({ lang: 'en' }, { $set: req.body.lang.en });
    let seRes = await langDB.findOneAndUpdate({ lang: 'se' }, { $set: req.body.lang.se });
    res.json({
        ok: true
    });
});

app.post('/admin/getprojects', ensureAuthenticated, async (req, res) => {
    const cats = await getCats();
    const projects = await getProjects();
    if (cats && projects) {
        res.json({
            ok: true,
            cats,
            projects
        });
    } else {
        res.json({
            ok: false
        });
    }
});

app.post('/admin/updateprojects', ensureAuthenticated, async (req, res) => {
    req.body.projects.cats.forEach(async (cat) => {
        await portcatsDB.findOneAndUpdate({ _id: cat['_id'] }, { $set: cat });
    });
    req.body.projects.projects.forEach(async (project) => {
        await portDB.findOneAndUpdate({ _id: project['_id'] }, { $set: project })
    })
    res.json({
        ok: true
    });
});

app.get('/admin/projects', ensureAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/projects', {
        activeLang: langFile.lang,
        lang: langFile.projects,
        header: langFile.header,
        footer: langFile.footer,
        page: 'admin-projects',
        user: req.user
    })
});

app.get('/admin/language', ensureAuthenticated, async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');
    res.render('pages/language', {
        activeLang: langFile.lang,
        lang: langFile.language,
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
        page: '404',
        user: req.user
    });
});

app.use(async (req, res) => {
    const langFile = await getLangFile(req.cookies.lang || 'en');

    res.status(500).render('pages/error', {
        activeLang: langFile.lang,
        lang: langFile[500],
        header: langFile.header,
        footer: langFile.footer,
        page: '500',
        user: req.user
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));
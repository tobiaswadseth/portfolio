const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const langFile = require('./language.json');

const app = express();

app.use(cookieParser());
app.use(express.static('./public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const lang = req.cookies.lang || 'en';
    console.log(langFile[lang].index)
    res.render('pages/home', {
        activeLang: lang,
        lang: langFile[lang].index,
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: 'home'
    });
});

app.get('/resume', (req, res) => {
    const lang = req.cookies.lang || 'en';
    res.render('pages/resume', {
        activeLang: lang,
        lang: langFile[lang].resume,
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: 'resume'
    });
});

app.get('/works', (req, res) => {
    const lang = req.cookies.lang || 'en';
    res.render('pages/works', {
        activeLang: lang,
        lang: langFile[lang].works,
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: 'works',
        projects: {

        }
    });
});

app.get('/contact', (req, res) => {
    const lang = req.cookies.lang || 'en';
    res.render('pages/contact', {
        activeLang: lang,
        lang: langFile[lang].contact,
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: 'contact'
    });
});

app.get('/se', (req, res) => {
    res.cookie('lang', 'se', { expire: (2592 * (10^6)) + Date.now() });
    res.redirect(req.headers.referer);
});

app.get('/en', (req, res) => {
    res.cookie('lang', 'en', { expire: (2592 * (10^6)) + Date.now() });
    res.redirect(req.headers.referer);
});

app.use((req, res) => {
    const lang = req.cookies.lang || 'en';
    
    res.status(404).render('pages/error', {
        activeLang: lang,
        lang: langFile[lang][404],
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: '404'
    });
});

app.use((req, res) => {
    const lang = req.cookies.lang || 'en';
    res.status(500).render('pages/error', {
        activeLang: lang,
        lang: langFile[lang][404],
        header: langFile[lang].header,
        footer: langFile[lang].footer,
        page: '500'
    });
});

// const views = ['index', 'contact', 'resume', 'works', '404'];

// app.get('/:lang?/:view?/:project?', (req, res) => {
//     let lang = req.params.lang || 'en';
//     const view = req.params.view || 'index';
    
//     if (!req.params.lang) {
//         res.redirect('/en/');
//         return;
//     }

//     if (!views.includes(view)) {
//         res.redirect(`/${lang}/404`);
//         return;
//     }

//     if (lang === 'sv') {
//         res.render(__dirname + `/static/${view}-se`);
//         return;
//     } else {
//         lang = 'en';
//         res.render(__dirname + `/static/${view}-en`);
//     }
// });

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
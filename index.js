const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const langFile = require('./language.json');

const app = express();

app.use(cookieParser());
app.use(express.static('./public'));

// Projects
app.use('/projects/bitcoin-clicker', express.static('./projects/bitcoin-clicker'));
app.use('/projects/wu1-final', express.static('./projects/wu1-final'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const lang = req.cookies.lang || 'en';
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
        projectcategories: {
            'box-item': {
                title_en: "All",
                title_se: "Alla",
                value: "box-item"
            },
            web: {
                title_en: "Web Development",
                title_se: "Webbutveckling",
                value: "web"
            },
            spigot: {
                title_en: "Spigot Plugins",
                title_se: "Spigot Plugins",
                value: "spigot"
            },
            java: {
                title_en: "Java",
                title_se: "Java",
                value: "java"
            },
            javascript: {
                title_en: "Javascript",
                title_se: "Javascript",
                value: "javascript"
            }
        },
        projects: [
            {
                id: "backpacks",
                title: "Backpacks",
                image: "images/backpack.jpg",
                sourcecode: "https://www.spigotmc.org/resources/backpacks.80583",
                projectpath: "",
                category: ["spigot", "java"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "chatlink",
                title: "ChatLink",
                image: "images/link.jpg",
                sourcecode: "https://www.spigotmc.org/resources/chatlink.74046",
                projectpath: "",
                category: ["spigot", "java"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "clearentities",
                title: "ClearEntities",
                image: "images/trash.jpg",
                sourcecode: "https://www.spigotmc.org/resources/clearentities.80272",
                projectpath: "",
                category: ["spigot", "java"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "bitcoin",
                title: "Bitcoin Clicker",
                image: "images/bitcoin.jpg",
                sourcecode: "https://github.com/tobiaswadseth/bitcoin-clicker",
                projectpath: "/projects/bitcoin-clicker",
                category: ["web", "javascript"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "wu1-final",
                title: "Webbutveckling 1 Final Project",
                image: "images/wu1-final.jpg",
                sourcecode: "https://github.com/tobiaswadseth/wu1_towa",
                projectpath: "/projects/wu1-final",
                category: ["web"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "url-shortener",
                title: "URL Shortener",
                image: "images/shortener.jpg",
                sourcecode: "https://github.com/tobiaswadseth/url-shortener",
                projectpath: "",
                category: ["web", "javascript"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "wysiwyg",
                title: "WYSIWYG Editor",
                image: "images/wysiwyg.jpg",
                sourcecode: "https://github.com/tobiaswadseth/wysiwyg-editor",
                projectpath: "",
                category: ["web", "javascript"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
            {
                id: "movie-tickets",
                title: "Movie Ticket Booking App",
                image: "images/tickets.jpg",
                sourcecode: "https://github.com/tobiaswadseth/movie-tickets",
                projectpath: "",
                category: ["java"],
                en: {
                    description: ""
                },
                se: {
                    description: ""
                }
            },
        ]
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

app.get('/download-cv', (req, res) => {
    res.download(path.join(__dirname, '/CV.pdf'));
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
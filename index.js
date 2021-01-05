const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const langFile = require('./language.json');

const app = express();

// TODO: Add admin panel and switch to db storage for portfolio items and language

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
            },
            research: {
                title_en: "Research",
                title_se: "Undersökning",
                value: "research"
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
                    description: "A plugin for Minecraft servers to allow for backpacks"
                },
                se: {
                    description: "Ett plugin till Minecraft servrar som tillägger ryggsäckar"
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
                    description: "A plugin for Minecraft servers that allows for players to showcase their items in the chat"
                },
                se: {
                    description: "Ett plugin till Minecraft servrar som tillåter spelare att visa sina saker i chatten"
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
                    description: "A plugin for Minecraft servers that removes all entities in a world on a set interval to ease the lag"
                },
                se: {
                    description: "Ett plugin till Minecraft servrar som tar bort alla enheter i en värld på en satt intervall fär att underlätta lagg"
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
                    description: "A Cookie Clicker clone but with a bitcoin frontend"
                },
                se: {
                    description: "En Cookie Clicker klon fast med ett utseende som skall likna bitcoin"
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
                    description: "My final project in the course \"Web development 1\" at school"
                },
                se: {
                    description: "Mitt slutprojekt i kursen \"Webbutveckling 1\" på gymnasiet"
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
                    description: "A very simple URL shortener built using nodejs and vue"
                },
                se: {
                    description: "En väldigt simpel URL förkortare som är byggd med nodejs och vue"
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
                    description: "A WYSIWYG editor (What You See Is What You Get) that allows for editing text in real-time"
                },
                se: {
                    description: "En WYSIWYG redigerare (What You See Is What You Get) som tillåter för redigering av text i real-tid"
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
                    description: "A project in the course \"Java basics\" at school. A GUI application that allows for booking movie tickets"
                },
                se: {
                    description: "Ett projekt i kursen \"Java grunder\" på högskolan. En GUI applikation som tillåter användaren att boka bio biljetter"
                }
            },
            {
                id: "chat-room",
                title: "Chat Room",
                image: "images/chatroom.jpg",
                sourcecode: "https://github.com/tobiaswadseth/chat-room",
                projectpath: "",
                category: ["web", "javascript"],
                en: {
                    description: "A chat application built using nodejs, reactjs, and firebase"
                },
                se: {
                    description: "En chatt applikation som är byggd med nodejs, reactjs och firebase"
                }
            },
            {
                id: "discordbot",
                title: "Discord Moderation Bot",
                image: "images/modbot.jpg",
                sourcecode: "https://github.com/tobiaswadseth/discordbot",
                projectpath: "",
                category: ["javascript"],
                en: {
                    description: "A discord moderation bot built using nodejs and the discord bot api"
                },
                se: {
                    description: "En discord modererings bott som är byggd med nodejs och discord bott api"
                }
            },
            {
                id: "gymnasiearbete",
                title: "Gymnasiearbete",
                image: "images/research.png",
                sourcecode: "",
                projectpath: "/files/gymnasiearbete",
                category: ["research"],
                en: {
                    description: "A research project for school. <br><strong>This document is written in Swedish</strong>"
                },
                se: {
                    description: "Ett undersöknings projekt på gymnasiet. <br><strong>Detta dokument är skrivet på Svenska</strong>"
                }
            },
            {
                id: "portfolio",
                title: "Portfolio",
                image: "images/portfolio.jpg",
                sourcecode: "https://github.com/tobiaswadseth/portfolio",
                projectpath: "/",
                category: ["web", "javascript"],
                en: {
                    description: "This website (My web based portfolio) on GitHub"
                },
                se: {
                    description: "Den här webbplatsen (Mitt webb baserade portfolio) på GitHub"
                }
            }
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

app.get('/files/:file', (req, res) => {
    if (req.params.file === 'cv') {
        res.sendFile(path.join(__dirname, '/files/CV.pdf'));
    } else if (req.params.file === 'gymnasiearbete') {
        res.sendFile(path.join(__dirname, '/files/Gymnasiearbete R.L. T.W..pdf'));
    }
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.static('./public'));

// app.use((req, res) => {
//     console.log(req.path);
//     res.status(404).send('404: Page not found')
// });

const views = ['index', 'contact', 'resume', 'works'];

app.get('/:lang?/:view?/:project?', (req, res) => {
    let lang = req.params.lang || 'en';
    const view = req.params.view || 'index';
    
    if (!req.params.lang) {
        res.redirect('/en/');
        return;
    }

    if (!views.includes(view)) {
        res.status(404).send('404');
        return;
    }

    if (lang === 'sv') {
        res.sendFile(__dirname + `/static/${view}-se.html`);
        return;
    } else {
        lang = 'en';
        res.sendFile(__dirname + `/static/${view}-en.html`);
    }
});

// app.get('/verify', (req, res, next) => {
//     console.info('Auth and redirect');
//     res.redirect('/user');
// })

// app.get('/user', (req, res) => {
//     res.send('User authenticated');
// })

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/static/index-en.html');
// });

// app.get('/resume', (req, res) => {
//     res.sendFile(__dirname + '/static/resume-en.html');
// });

// app.get('/contact', (req, res) => {
//     res.sendFile(__dirname + '/static/contact-en.html');
// });

// app.get('/works', (req, res) => {
//     res.sendFile(__dirname + '/static/works-en.html');
// });

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
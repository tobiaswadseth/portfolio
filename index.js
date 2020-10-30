const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.static('./public'));

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

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
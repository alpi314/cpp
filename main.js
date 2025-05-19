const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 80;

const app = express();

// Questions data - import from data folder
const all_q = require('./data/questions').all_q || [];

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

app.get('/tasks', (req, res) => {
    const custom_selection = req.query.cs;

    if (custom_selection) {
        try {
            const selection = JSON.parse(custom_selection);
            const html = selection.map(num => all_q[num]).filter(Boolean);
            const numbers = selection;
            res.render('tasks', { html, numbers });
        } catch (e) {
            console.error('Custom selection error:', e);
            res.redirect('/tasks');
        }
    } else {
        let start = Number(req.query.start) || 0;
        let end = Number(req.query.end) || 20;

        if (isNaN(start) || start < 0 || end < start) {
            start = 0;
            end = 20;
        }

        const numbers = Array.from({ length: end - start }, (_, i) => start + i);
        const html = all_q.slice(start, end);
        res.render('tasks', { html, numbers });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
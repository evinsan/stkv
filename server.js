const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/rankings', (req, res) => {
    // Read rankings from file and send as JSON
    const rankings = readRankings();
    res.json(rankings);
});

app.post('/api/rankings', (req, res) => {
    // Add a new result to rankings and save to file
    const result = req.body;
    addResult(result);
    res.json({ message: 'Result added successfully.' });
});

function readRankings() {
    try {
        const data = fs.readFileSync(__dirname + '/rankings.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function addResult(result) {
    const rankings = readRankings();
    rankings.push(result);
    fs.writeFileSync(__dirname + '/rankings.json', JSON.stringify(rankings, null, 2), 'utf8');
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

app.set('view engine', 'ejs');
app.use(express.static('public'));


router.get('/', (req, res) => {
    res.sendFile('views/index.html');
});
router.get('/ejs', (req, res) => {
    res.render('index');
});

app.use('/.netlify/functions/api', router);  // path must route to lambda

module.exports.handler = serverless(app);
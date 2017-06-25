var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Mongo Scraper',
        homepage: true
    });
});

router.get('/saved-articles', function(req, res, next) {
    res.render('index', {
        title: 'Mongo Scraper | Saved Articles',
        articles: true
    });
});

module.exports = router;

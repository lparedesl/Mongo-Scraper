var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/articles");
var Saved = require("../models/saved");
var Note = require("../models/note");

function exit() {
    mongoose.disconnect();
}

function storeArticles(i, articles, results, cb) {
    if (i < articles.length) {
        Saved.findOne({
            title: articles[i].title
        }, function(error, data) {
            if (data) {
                articles[i]._id = data._id;
                articles[i].saved = true;
            }
            articles[i].save(function(error, data) {
                if (data) {
                    results.push(data);
                }
                i++;
                if (i === articles.length) {
                    return cb(results);
                }
                storeArticles(i, articles, results, cb);
            });
        });
    }
}

router.get('/', function(req, res, next) {
    Article.find({}, function(error, data) {
        res.render('index', {
            title: 'Mongo Scraper',
            data: data,
            homepage: true
        });
    });
});

router.get('/saved-articles', function(req, res, next) {
    Saved.find({}, function(error, data) {
        res.render('index', {
            title: 'Mongo Scraper | Saved Articles',
            data: data,
            articles: true
        });
    });
});

router.post('/scrape', function(req, res, next) {
    request("https://www.washingtonpost.com/world/", function(error, response, html) {
        var $ = cheerio.load(html);
        var articles = [];
        Article.remove({}, function(error, data) {
            $("div.story-headline").each(function(i, element) {
                var title = $(element).children("h3").children("a").text();

                var desc = $(element).siblings(".story-description").children("p").text();

                var img = $(element).parents(".story-body").siblings(".story-image").children("a").children("img").data("hi-res-src");

                var authors = "";
                $(element).siblings(".story-list-meta-social").children("ul").children("li").children("a").children("span.author").each(function(i, element) {
                    var author = $(element).text();
                    authors += author + ", ";
                });
                $(element).siblings(".story-list-meta-social").children("ul").children("li").children("span.author").each(function(i, element) {
                    var author = $(element).text();
                    authors += author + ", ";
                });
                $(element).parents(".story-body").siblings(".col-lg-12").children(".story-list-meta-social").children("ul").children("li").children("a").children("span.author").each(function(i, element) {
                    var author = $(element).text();
                    authors += author + ", ";
                });
                $(element).parents(".story-body").siblings(".col-lg-12").children(".story-list-meta-social").children("ul").children("li").children("span.author").each(function(i, element) {
                    var author = $(element).text();
                    authors += author + ", ";
                });
                authors = authors.substring(0, authors.length-2);

                var from = "";
                if ($(element).siblings(".story-list-meta-social").children("ul").children("li.timestamp").text()) {
                    from = $(element).siblings(".story-list-meta-social").children("ul").children("li.timestamp").text();
                } else {
                    from = $(element).parents(".story-body").siblings(".col-lg-12").children(".story-list-meta-social").children("ul").children("li.timestamp").text();
                }

                articles.push(new Article({
                    title: title,
                    desc: desc,
                    img: img,
                    authors: authors,
                    from: from,
                    saved: false
                }));
            });

            var results = [];
            storeArticles(0, articles, results, function(data) {
                res.json(data);
            });
        });
    });
});

router.post('/save-article', function(req, res, next) {
    Article.findByIdAndUpdate(req.body._id, {
        saved: true
    }, function(error, data) {
        Saved.create({
            _id: req.body._id,
            title: data.title,
            desc: data.desc,
            img: data.img,
            authors: data.authors
        }, function (error, data) {
            res.end();
        });
    });
});

router.post('/delete-article', function(req, res, next) {
    Article.findByIdAndUpdate(req.body._id, {
        saved: false
    }, function(error, data) {
        Saved.findByIdAndRemove(req.body._id, function (error, data) {
            res.end();
        });
    });
});

router.post('/get-notes/:articleId', function(req, res, next) {
    Saved.findById(req.params.articleId)
    .populate("notes")
    .exec(function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.json(data);
        }
    });
});

router.post('/save-note/:articleId', function(req, res, next) {
    Note.create(req.body, function (error, data) {
        if (error) {
            res.send(error);
        } else {
            Saved.findOneAndUpdate({
                _id: req.params.articleId
            }, {
                $push: {
                    "notes": data._id
                }
            }, {
                new: true
            }, function(err, newdata) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.end();
                }
            });
        }
    });
});

router.post('/delete-note', function(req, res, next) {
    Note.findByIdAndRemove(req.body.id, function (error, data) {
        res.end();
    });
});

module.exports = router;

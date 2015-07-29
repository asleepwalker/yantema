var express = require('express');
var router = express.Router();

var posts = require('../models/posts.js');

/* GET /posts listing. */
router.get('/', function(req, res, next) {
	posts.find(function(err, all) {
		if (err) {
			return next(err);
		}
		res.json(all);
	});
});

/* POST /posts */
router.post('/', function(req, res, next) {
	posts.create(req.body, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

/* GET /posts/id */
router.get('/:id', function(req, res, next) {
	posts.findById(req.params.id, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

/* PUT /posts/:id */
router.put('/:id', function(req, res, next) {
	posts.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

/* DELETE /posts/:id */
router.delete('/:id', function(req, res, next) {
	posts.findByIdAndRemove(req.params.id, req.body, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

module.exports = router;

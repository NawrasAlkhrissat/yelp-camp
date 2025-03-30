const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utils/catchAsync');
const{validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews.js');

router.post('/', isLoggedIn ,validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,isReviewAuthor ,catchAsync(reviews.deleteReview));

module.exports = router;
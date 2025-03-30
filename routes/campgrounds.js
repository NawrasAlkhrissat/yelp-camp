const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const { isLoggedIn,validateCampground,isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const {storage} =  require('../cloudinary/index.js');
const multer = require('multer');
const upload = multer({storage});

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { isLoggedIn } = require('../middlewares/user');

router.get('/places', searchController.getAllPlaces);
router.get('/places/location', searchController.getPlacesByLocation);
router.post('/preferences', isLoggedIn, searchController.saveSearchPreferences);

module.exports = router;
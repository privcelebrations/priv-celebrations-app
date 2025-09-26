// /server/routes/public.js
const router = require('express').Router();
const publicController = require('../controllers/publicController');

// Existing routes
router.get('/data', publicController.getWebsiteData);
router.post('/bookings', publicController.createBooking);
router.post('/contacts', publicController.createContact);

// --- ADD THIS NEW ROUTE ---
router.get('/slots/availability', publicController.getSlotAvailability);

module.exports = router;
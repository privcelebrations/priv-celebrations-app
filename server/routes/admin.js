const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- DASHBOARD & ANALYTICS ---
router.get('/analytics', auth, adminController.getAnalytics);
router.get('/chart-data', auth, adminController.getChartData);
router.get('/bookings', auth, adminController.getBookings);
// --- NEW ROUTE ---
// This route will handle updating the status of a booking by its ID.
router.put('/bookings/:id/status', auth, adminController.updateBookingStatus);
router.get('/contacts', auth, adminController.getContacts);


// --- THEATRE MANAGEMENT ---
router.get('/theatres', auth, adminController.getTheatres);
router.post('/theatres', [auth, upload], adminController.createTheatre);
router.put('/theatres/:id', [auth, upload], adminController.updateTheatre);
router.delete('/theatres/:id', auth, adminController.deleteTheatre);


// --- PACKAGE (COMBO) MANAGEMENT ---
router.get('/packages', auth, adminController.getPackages);
router.post('/packages', auth, adminController.createPackage);
router.put('/packages/:id', auth, adminController.updatePackage);
router.delete('/packages/:id', auth, adminController.deletePackage);


// --- ADDON MANAGEMENT ---
router.get('/addons', auth, adminController.getAddons);
router.post('/addons', auth, adminController.createAddon);
router.put('/addons/:id', auth, adminController.updateAddon);
router.delete('/addons/:id', auth, adminController.deleteAddon);

// --- GALLERY MANAGEMENT (NEW) ---
router.get('/gallery', auth, adminController.getGalleryImages);
router.post('/gallery', [auth, upload], adminController.uploadGalleryImages);
router.delete('/gallery/:id', auth, adminController.deleteGalleryImage);

module.exports = router;

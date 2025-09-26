const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware'); // Middleware to protect these routes

// --- DASHBOARD & ANALYTICS ---
// Fetches the main analytics data (total bookings, etc.)
router.get('/analytics', auth, adminController.getAnalytics);
// Fetches all booking records
router.get('/bookings', auth, adminController.getBookings);
// Fetches all contact inquiry records
router.get('/contacts', auth, adminController.getContacts);


// --- PACKAGE (COMBO) MANAGEMENT ---
// GET all packages to display in the manager
router.get('/packages', auth, adminController.getPackages);
// POST a new package
router.post('/packages', auth, adminController.createPackage);
// PUT (update) an existing package by its ID
router.put('/packages/:id', auth, adminController.updatePackage);
// DELETE a package by its ID
router.delete('/packages/:id', auth, adminController.deletePackage);


// --- ADDON MANAGEMENT ---
// GET all addons to display in the manager
router.get('/addons', auth, adminController.getAddons);
// POST a new addon
router.post('/addons', auth, adminController.createAddon);
// PUT (update) an existing addon by its ID
router.put('/addons/:id', auth, adminController.updateAddon);
// DELETE an addon by its ID
router.delete('/addons/:id', auth, adminController.deleteAddon);

// Note: Routes for 'offers' would be added here in the future.

module.exports = router;
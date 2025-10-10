const db = require('../db');
const fs = require('fs'); // Node.js File System module
const path = require('path');
// --- THEATRE MANAGEMENT CONTROLLERS ---
exports.getTheatres = async (req, res) => {
    try {
        const theatres = await db.query('SELECT * FROM theatres ORDER BY id');
        res.json(theatres.rows);
    } catch (err) {
        console.error("Error fetching theatres:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.createTheatre = async (req, res) => {
    const { name, subtitle, description, details, price } = req.body;
    // req.files is an array of uploaded file info provided by multer
    // We map over it to create an array of URL paths.
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
        const newTheatre = await db.query(
            `INSERT INTO theatres (name, subtitle, description, details, price, images) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, subtitle, description, details.split(','), price, imageUrls]
        );
        res.json(newTheatre.rows[0]);
    } catch (err) {
        console.error("Error creating theatre:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTheatre = async (req, res) => {
    const { id } = req.params;
    const { name, subtitle, description, details, price, existingImages } = req.body;

    // Get URLs of any newly uploaded files
    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // The client sends existingImages as a JSON string. We parse it and combine it with new images.
    let allImages = [];
    try {
        const parsedExisting = JSON.parse(existingImages || '[]');
        allImages = [...parsedExisting, ...newImageUrls];
    } catch (e) {
        allImages = [...newImageUrls]; // Fallback if parsing fails
    }


    try {
        const updatedTheatre = await db.query(
            `UPDATE theatres SET name = $1, subtitle = $2, description = $3, details = $4, price = $5, images = $6 
             WHERE id = $7 RETURNING *`,
            [name, subtitle, description, details.split(','), price, allImages, id]
        );
        res.json(updatedTheatre.rows[0]);
    } catch (err) {
        console.error("Error updating theatre:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteTheatre = async (req, res) => {
    // Note: This only deletes the database record. For a production app, you might also
    // want to delete the actual image files from the /uploads folder using Node's `fs` module.
    const { id } = req.params;
    try {
        await db.query("DELETE FROM theatres WHERE id = $1", [id]);
        res.json({ msg: 'Theatre deleted successfully' });
    } catch (err) {
        console.error("Error deleting theatre:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const totalBookings = await db.query('SELECT COUNT(*) FROM bookings');
        const totalContacts = await db.query('SELECT COUNT(*) FROM contacts');
        const monthlyBookings = await db.query("SELECT COUNT(*) FROM bookings WHERE date_trunc('month', datetime) = date_trunc('month', current_date)");
        const popularTheatre = await db.query(`
            SELECT theatre_name, COUNT(*) as count 
            FROM bookings 
            GROUP BY theatre_name 
            ORDER BY count DESC 
            LIMIT 1
        `);

        res.json({
            totalBookings: totalBookings.rows[0].count,
            totalContacts: totalContacts.rows[0].count,
            monthlyBookings: monthlyBookings.rows[0].count,
            popularTheatre: popularTheatre.rows.length > 0 ? popularTheatre.rows[0].theatre_name : 'N/A'
        });
    } catch (err) {
        console.error("Error fetching analytics:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.getChartData = async (req, res) => {
    try {
        const recentBookings = await db.query(
            `SELECT DATE_TRUNC('day', datetime AT TIME ZONE 'UTC') AS day, COUNT(*) AS count
             FROM bookings
             WHERE datetime > NOW() - INTERVAL '30 days'
             GROUP BY day
             ORDER BY day ASC`
        );
        const packagePopularity = await db.query(
            `SELECT package_name, COUNT(*) AS count
             FROM bookings
             WHERE package_name IS NOT NULL AND package_name != 'None'
             GROUP BY package_name
             ORDER BY count DESC`
        );
        res.json({
            bookingsByDay: recentBookings.rows,
            packagePopularity: packagePopularity.rows,
        });
    } catch (err) {
        console.error("Error fetching chart data:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(bookings.rows);
    } catch (err) {
        console.error("Error fetching bookings:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(contacts.rows);
    } catch (err) {
        console.error("Error fetching contacts:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION for Booking Status ---
exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // A list of allowed statuses to prevent invalid data
    const allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const updatedBooking = await db.query(
            "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (updatedBooking.rows.length === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.json(updatedBooking.rows[0]);
    } catch (err) {
        console.error("Error updating booking status:", err.message);
        res.status(500).send('Server Error');
    }
};
// --- PACKAGE MANAGEMENT CONTROLLERS ---

exports.getPackages = async (req, res) => {
    try {
        const packages = await db.query('SELECT * FROM packages ORDER BY id');
        res.json(packages.rows);
    } catch (err) {
        console.error("Error fetching packages:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.createPackage = async (req, res) => {
    const { name, price, original_price, description, items } = req.body;
    try {
        const newPackage = await db.query(
            "INSERT INTO packages (name, price, original_price, description, items) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, price, original_price, description, items]
        );
        res.json(newPackage.rows[0]);
    } catch (err) {
        console.error("Error creating package:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.updatePackage = async (req, res) => {
    const { id } = req.params;
    const { name, price, original_price, description, items } = req.body;
    try {
        const updatedPackage = await db.query(
            "UPDATE packages SET name = $1, price = $2, original_price = $3, description = $4, items = $5 WHERE id = $6 RETURNING *",
            [name, price, original_price, description, items, id]
        );
        res.json(updatedPackage.rows[0]);
    } catch (err) {
        console.error("Error updating package:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM packages WHERE id = $1", [id]);
        res.json({ msg: 'Package deleted successfully' });
    } catch (err) {
        console.error("Error deleting package:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- ADDON MANAGEMENT CONTROLLERS ---

exports.getAddons = async (req, res) => {
    try {
        const addons = await db.query('SELECT * FROM addons ORDER BY id');
        res.json(addons.rows);
    } catch (err) {
        console.error("Error fetching addons:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.createAddon = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newAddon = await db.query(
            "INSERT INTO addons (name, description, price) VALUES ($1, $2, $3) RETURNING *",
            [name, description, price]
        );
        res.json(newAddon.rows[0]);
    } catch (err) {
        console.error("Error creating addon:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateAddon = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        const updatedAddon = await db.query(
            "UPDATE addons SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
            [name, description, price, id]
        );
        res.json(updatedAddon.rows[0]);
    } catch (err) {
        console.error("Error updating addon:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteAddon = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM addons WHERE id = $1", [id]);
        res.json({ msg: 'Addon deleted successfully' });
    } catch (err) {
        console.error("Error deleting addon:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- GALLERY MANAGEMENT CONTROLLERS (NEW) ---

exports.getGalleryImages = async (req, res) => {
    try {
        const images = await db.query('SELECT * FROM gallery_images ORDER BY id DESC');
        res.json(images.rows);
    } catch (err) {
        console.error("Error fetching gallery images:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.uploadGalleryImages = async (req, res) => {
    const { category, caption } = req.body;
    const files = req.files; // Array of files from multer

    if (!files || files.length === 0) {
        return res.status(400).json({ msg: 'No images uploaded.' });
    }

    try {
        const promises = files.map(file => {
            const imageUrl = `/uploads/${file.filename}`;
            return db.query(
                `INSERT INTO gallery_images (image_url, category, caption) VALUES ($1, $2, $3) RETURNING *`,
                [imageUrl, category, caption]
            );
        });
        
        const results = await Promise.all(promises);
        const insertedImages = results.map(result => result.rows[0]);
        
        res.json(insertedImages);
    } catch (err) {
        console.error("Error uploading gallery images:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteGalleryImage = async (req, res) => {
    const { id } = req.params;
    try {
        // First, get the image URL from the database to delete the file
        const result = await db.query('SELECT image_url FROM gallery_images WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const imageUrl = result.rows[0].image_url;
            const imagePath = path.join(__dirname, '..', imageUrl); // Create absolute path

            // Delete the file from the /uploads folder
            fs.unlink(imagePath, (err) => {
                if (err) {
                    // Log the error but don't stop the process, as the DB entry is more important
                    console.error("Error deleting image file:", err);
                }
            });
        }

        // Then, delete the record from the database
        await db.query("DELETE FROM gallery_images WHERE id = $1", [id]);
        res.json({ msg: 'Gallery image deleted successfully' });

    } catch (err) {
        console.error("Error deleting gallery image:", err.message);
        res.status(500).send('Server Error');
    }
};

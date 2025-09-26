const db = require('../db');

// --- ANALYTICS & DATA FETCHING ---

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
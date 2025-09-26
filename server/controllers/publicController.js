const db = require('../db');

/**
 * Fetches all active theatres, packages, and addons for the main website display.
 */
exports.getWebsiteData = async (req, res) => {
    try {
        const theatres = await db.query('SELECT * FROM theatres WHERE is_active = true ORDER BY id');
        const packages = await db.query('SELECT * FROM packages WHERE is_active = true ORDER BY id');
        const addons = await db.query('SELECT * FROM addons WHERE is_active = true ORDER BY id');
        
        res.json({
            theatres: theatres.rows,
            packages: packages.rows,
            addons: addons.rows
        });
    } catch (err) {
        console.error("Error fetching website data:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Creates a new booking record in the database.
 */
exports.createBooking = async (req, res) => {
    const { name, phone, theatre_name, package_name, party_size, datetime, selected_addons, requests } = req.body;
    try {
        const newBooking = await db.query(
            "INSERT INTO bookings (name, phone, theatre_name, package_name, party_size, datetime, selected_addons, requests) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [name, phone, theatre_name, package_name, party_size, datetime, selected_addons, requests]
        );
        res.json(newBooking.rows[0]);
    } catch (err) {
        console.error("Error creating booking:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Creates a new contact inquiry record in the database.
 */
exports.createContact = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newContact = await db.query(
            "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
            [name, email, message]
        );
        res.json(newContact.rows[0]);
    } catch (err) {
        console.error("Error creating contact:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Calculates the number of available booking slots for a given theatre on a specific date.
 */
exports.getSlotAvailability = async (req, res) => {
    const { theatreName, date } = req.query;

    if (!theatreName || !date) {
        return res.status(400).json({ msg: 'Theatre name and date are required.' });
    }

    // --- Business Logic Configuration ---
    const BOOKING_DURATION_HOURS = 3; // Each booking blocks a 3-hour window
    const BUSINESS_START_HOUR = 9;    // Business opens at 9:00 AM
    const BUSINESS_END_HOUR = 24;     // Business closes at midnight (effectively end of 23:00 hour)

    try {
        // 1. Get all existing bookings for the specified theatre on the specified date
        const bookingsResult = await db.query(
            "SELECT datetime FROM bookings WHERE theatre_name = $1 AND datetime::date = $2",
            [theatreName, date]
        );

        // 2. Create a set of all occupied hours for fast O(1) lookups
        const occupiedHours = new Set();
        bookingsResult.rows.forEach(booking => {
            // Get the starting hour of the booking in the server's local timezone
            const startTime = new Date(booking.datetime).getHours();
            // Mark the start hour and the next (duration - 1) hours as occupied
            for (let i = 0; i < BOOKING_DURATION_HOURS; i++) {
                occupiedHours.add(startTime + i);
            }
        });

        // 3. Calculate all potential start times for a new booking
        let availableSlots = 0;
        // The last possible time a 3-hour slot can START is the closing hour minus the duration.
        // e.g., if closing is 24 and duration is 3, the last start time is 21:00 (for 21, 22, 23).
        const lastPossibleStartTime = BUSINESS_END_HOUR - BOOKING_DURATION_HOURS; 

        for (let hour = BUSINESS_START_HOUR; hour <= lastPossibleStartTime; hour++) {
            let isSlotAvailable = true;
            // Check if the entire 3-hour window for this potential slot is free
            for (let i = 0; i < BOOKING_DURATION_HOURS; i++) {
                if (occupiedHours.has(hour + i)) {
                    isSlotAvailable = false;
                    break; // This time window is blocked, so move to the next potential hour
                }
            }

            if (isSlotAvailable) {
                availableSlots++;
            }
        }
        
        // 4. Return the final count to the frontend
        res.json({ availableSlots });

    } catch (err) {
        console.error("Error calculating slot availability:", err.message);
        res.status(500).send('Server Error');
    }
};
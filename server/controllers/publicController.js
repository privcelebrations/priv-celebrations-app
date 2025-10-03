const db = require('../db');

/**
 * FINAL VERSION: Fetches all active data needed for the main website display.
 * This includes theatres, packages, addons, and gallery images.
 */
exports.getWebsiteData = async (req, res) => {
    try {
        // Fetch all data streams in parallel for maximum efficiency
        const [theatresRes, packagesRes, addonsRes, galleryImagesRes] = await Promise.all([
            db.query('SELECT * FROM theatres WHERE is_active = true ORDER BY id'),
            db.query('SELECT * FROM packages WHERE is_active = true ORDER BY id'),
            db.query('SELECT * FROM addons WHERE is_active = true ORDER BY id'),
            db.query('SELECT * FROM gallery_images WHERE is_active = true ORDER BY id DESC')
        ]);
        
        // Respond with a single JSON object containing all the data
        res.json({
            theatres: theatresRes.rows,
            packages: packagesRes.rows,
            addons: addonsRes.rows,
            galleryImages: galleryImagesRes.rows
        });
    } catch (err) {
        console.error("Error fetching website data:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Creates a new booking record in the database from the booking form.
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
 * Creates a new contact inquiry record in the database from the contact/inquiry forms.
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
 * dynamic closing times, and a subtle "popularity" algorithm.
 */
exports.getSlotAvailability = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ msg: 'Date is required.' });
    }

    try {
        // --- Business Logic Configuration ---
        const selectedDay = new Date(date).getDay(); // 0=Sun, 6=Sat
        const isWeekend = (selectedDay === 0 || selectedDay === 6);

        const BUSINESS_START_HOUR = 9;
        const BUSINESS_END_HOUR = isWeekend ? 24 : 23.5;

        // Define the fixed 3-hour booking slots with their start times
        const potentialSlots = [
            { start: 9,  end: 12 },
            { start: 12, end: 15 },
            { start: 15, end: 18 },
            { start: 18, end: 21 },
            { start: 21, end: 24 },
        ];

        // 1. Get ALL theatres and ALL bookings for the selected date
        const [theatresResult, bookingsResult] = await Promise.all([
            db.query('SELECT name FROM theatres WHERE is_active = true ORDER BY id'),
            db.query("SELECT theatre_name, datetime FROM bookings WHERE datetime::date = $1", [date])
        ]);

        const theatres = theatresResult.rows;
        const bookings = bookingsResult.rows;

        // 2. Create a map of which slots (by start hour) are occupied for each theatre
        const occupiedSlotsByTheatre = {};
        theatres.forEach(t => occupiedSlotsByTheatre[t.name] = new Set());

        bookings.forEach(booking => {
            const bookingStartHour = new Date(booking.datetime).getHours();
            for (const slot of potentialSlots) {
                if (bookingStartHour >= slot.start && bookingStartHour < slot.end) {
                    occupiedSlotsByTheatre[booking.theatre_name].add(slot.start);
                    break;
                }
            }
        });

        // 3. Calculate the list of available slot start times for each theatre
        const availabilityResults = [];
        const lastPossibleStart = BUSINESS_END_HOUR - 3;
        
        theatres.forEach(theatre => {
            const availableTimes = [];
            for (const slot of potentialSlots) {
                if (slot.start >= BUSINESS_START_HOUR && slot.start <= lastPossibleStart) {
                    if (!occupiedSlotsByTheatre[theatre.name].has(slot.start)) {
                        availableTimes.push(slot.start);
                    }
                }
            }
            availabilityResults.push({ name: theatre.name, availableTimes: availableTimes });
        });
        
        // 4. --- CORRECTED "POPULARITY" ALGORITHM ---
        // Find theatres that have more than one slot available.
        const eligibleTheatres = availabilityResults.filter(r => r.availableTimes.length > 1);

        if (eligibleTheatres.length > 0) {
            // Pick one of these eligible theatres at random.
            const randomEligibleIndex = Math.floor(Math.random() * eligibleTheatres.length);
            const theatreToModify = eligibleTheatres[randomEligibleIndex];

            // Pick a random slot to remove from that theatre's available times.
            const randomSlotIndexToRemove = Math.floor(Math.random() * theatreToModify.availableTimes.length);
            
            // Remove just that one slot.
            theatreToModify.availableTimes.splice(randomSlotIndexToRemove, 1);
        }

        // 5. Convert the final lists of times into simple counts for the frontend
        const finalResponse = availabilityResults.map(r => ({
            name: r.name,
            slots: r.availableTimes.length // The frontend only needs the count
        }));

        res.json({ availability: finalResponse });

    } catch (err) {
        console.error("Error calculating slot availability:", err.message);
        res.status(500).send('Server Error');
    }
};
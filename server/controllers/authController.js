// --- Imports ---
const bcrypt = require('bcryptjs'); // For password hashing comparison
const jwt = require('jsonwebtoken');   // For generating JSON Web Tokens
const db = require('../db');         // Your database connection/query utility
// Make sure to load environment variables at the application entry point (e.g., server.js)
// For example: require('dotenv').config();

// --- Login Controller Function ---
exports.login = async (req, res) => {
    // 1. Destructure username and password from the request body
    const { username, password } = req.body;

    // 2. Basic input validation (optional but recommended for production)
    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter both username and password' });
    }

    try {
        // 3. Query the database for the user by username
        const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        // 4. Check if user exists
        if (!user) {
            // Use a generic message for security (don't reveal if username or password was wrong)
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // 5. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            // Use a generic message for security
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // 6. Define the JWT payload
        // IMPORTANT: Only include non-sensitive, necessary data.
        const payload = {
            user: {
                id: user.id,
                username: user.username // Can be useful, but often just ID is enough
            }
        };

        // 7. Sign and send the JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from environment variables
            { expiresIn: '1h' },    // Token expiry: '1h', '8h', '1d', etc. Adjust as needed.
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err); // Log the JWT specific error
                    throw err; // Re-throw to be caught by the outer catch block
                }
                res.json({ token }); // Send the token in the response
            }
        );

    } catch (err) {
        // 8. Centralized error handling
        console.error('Login Error:', err.message); // Log the specific error message
        res.status(500).send('Server error during login process'); // Generic server error message
    }
};

// You might also add other authentication-related functions here,
// e.g., exports.register, exports.getCurrentUser, etc.
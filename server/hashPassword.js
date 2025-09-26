// This is a simple utility script to generate a bcrypt hash for a new password.
// To run: `node hashPassword.js your_new_password_here`

const bcrypt = require('bcryptjs');

// Get the password from the command-line arguments.
// process.argv[2] is the first argument after 'node' and the script name.
const password = process.argv[2];

if (!password) {
    console.error('Error: Please provide a password to hash.');
    console.log('Usage: node hashPassword.js <your-password>');
    process.exit(1); // Exit with an error code
}

// Generate a salt and hash the password.
// 10 is the number of salt rounds - a good standard for security.
bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        console.log('--- New Admin User Details ---');
        console.log('Password provided:', password);
        console.log('\nGenerated Bcrypt Hash:');
        console.log(hash);
        console.log('\n--- SQL Command to Create New Admin ---');
        console.log(`INSERT INTO users (username, password_hash) VALUES ('admin', '${hash}');`);
        console.log('\nCopy and run the INSERT command above in your SQL client to create the user.');
    });
});
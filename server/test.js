// This is an updated standalone script to test the database connection.
// It EXPLICITLY reads from your .env file, just like the main server.
// If this script works, your main server connection is configured correctly.
// To run: `node testDbConnection.js` from within the /server directory.

// 1. Load environment variables from the .env file at the very top.
require('dotenv').config(); 
const { Pool } = require('pg');

// 2. Create the connection configuration object by reading the loaded variables.
//    This mirrors the logic in your corrected /server/db/index.js file.
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
};

// 3. Create a new Pool instance with our explicit configuration.
const pool = new Pool(dbConfig);

async function testConnectionAndReadData() {
    let client;
    try {
        console.log('--- Database Connection Test ---');
        console.log('Reading credentials from your /server/.env file...');
        console.log(`Attempting to connect to database "${dbConfig.database}" at ${dbConfig.host}...`);
        
        // Get a client from the connection pool
        client = await pool.connect();
        
        console.log('\n✅ Connection Successful!');
        console.log('------------------------------------------');
        console.log('Attempting to read data from the "theatres" table...');

        // Run a query to select all rows from the 'theatres' table
        const result = await client.query('SELECT * FROM theatres ORDER BY id;');
        
        console.log('✅ Query Executed Successfully!');
        console.log('------------------------------------------');

        if (result.rows.length > 0) {
            console.log(`Found ${result.rows.length} theatre(s) in the database:\n`);
            result.rows.forEach(theatre => {
                console.log(`  ID: ${theatre.id}, Name: ${theatre.name}, Price: ₹${theatre.price}`);
            });
        } else {
            console.log('🟡 The "theatres" table is empty, but the connection works.');
            console.log('   If you expected data, please re-run the db.sql script.');
        }

    } catch (error) {
        console.error('\n❌ DATABASE TEST FAILED:');
        console.error('   ' + error.message); // Print the specific, helpful error message
        console.log('\n--- TROUBLESHOOTING CHECKLIST ---');
        console.log(`1. Is your PostgreSQL server running at ${dbConfig.host}:${dbConfig.port}?`);
        console.log(`2. Does the user "${dbConfig.user}" exist?`);
        console.log(`3. Is the password for "${dbConfig.user}" correct in your .env file?`);
        console.log(`4. Does the database "${dbConfig.database}" exist?`);
        console.log('5. Did you run the db.sql script to create the "theatres" table in that database?');
        
    } finally {
        if (client) {
            client.release();
        }
        pool.end();
        console.log('------------------------------------------');
        console.log('Test finished.');
    }
}

// Run the test function
testConnectionAndReadData();
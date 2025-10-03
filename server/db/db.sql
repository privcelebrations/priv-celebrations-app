-- =====================================================================
-- ==      FINAL SQL SCHEMA FOR PRIV CELEBRATIONS APPLICATION         ==
-- =====================================================================
-- This script creates all necessary tables, relationships, and initial data.
-- Run this entire script in your PostgreSQL client (psql, DBeaver, Supabase SQL Editor)
-- to set up a new database or reset an existing one.
-- =====================================================================


-- STEP 1: DROP EXISTING TABLES
-- This ensures a clean slate by deleting old tables in reverse order of creation.
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS addons;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS theatres;
DROP TABLE IF EXISTS users;


-- STEP 2: CREATE TABLES

-- Table for Admin Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Stores login credentials for admin users of the dashboard.';


-- Table for Theatres
CREATE TABLE theatres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    details TEXT[], -- An array of strings for features, e.g., '{"Up to 8 guests", "3-hour experience"}'
    price NUMERIC(10, 2) NOT NULL,
    images TEXT[], -- An array of image URLs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE theatres IS 'Defines the different private theatre rooms available for booking.';


-- Table for Packages (Main Combos)
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    description TEXT,
    items TEXT[], -- An array of strings for what the package includes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE packages IS 'Stores main combo packages that customers can choose as a base for their booking.';


-- Table for Addons (Individual Items)
CREATE TABLE addons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE addons IS 'Stores individual add-on items that customers can select on top of packages.';


-- Table for Bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    theatre_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255), -- The selected main package/combo
    party_size INTEGER NOT NULL,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    selected_addons TEXT, -- A comma-separated string of selected individual addons
    requests TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- Can be 'Pending', 'Confirmed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE bookings IS 'Contains all customer booking requests submitted from the website or by an admin.';


-- Table for Contact Inquiries
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE contacts IS 'Contains all inquiries from the "Contact Us" or "Quick Inquiry" forms.';


-- STEP 3: RESET PRIMARY KEY SEQUENCES
-- Ensures that after a full reset, the IDs start from 1 again.
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE theatres_id_seq RESTART WITH 1;
ALTER SEQUENCE packages_id_seq RESTART WITH 1;
ALTER SEQUENCE addons_id_seq RESTART WITH 1;
ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE contacts_id_seq RESTART WITH 1;


-- STEP 4: INSERT INITIAL DATA

-- Insert a default admin user
-- IMPORTANT: This hash is for a specific password. If you want to change the password,
-- you must generate a new hash using the /server/hashPassword.js script.
INSERT INTO users (username, password_hash) VALUES 
('admin', '$2a$10$YourUniqueGeneratedHashStringShouldGoHere.123abc'); -- Replace with your own generated hash


-- Insert initial data for Theatres
INSERT INTO theatres (name, subtitle, description, details, price, images) VALUES 
('Imperial Suite', 'For The Elite', 'Our premium suite featuring 8 luxury recliners with personalized service that redefines entertainment.', '{"Up to 8 guests", "3-hour premium experience", "Personal concierge service", "Gourmet refreshments & snacks"}', 2699.00, '{}'),
('Golden Imperial', 'For Grand Celebrations', 'A magnificent theatre space designed for memorable gatherings with luxury tiered seating.', '{"Up to 20 guests", "4-hour celebration experience", "Premium party amenities & decor", "Professional event coordination"}', 3699.00, '{}'),
('Velvet Amour', 'For Intimate Moments', 'An intimate sanctuary with plush seating, perfect for romantic evenings and special occasions.', '{"Up to 8 guests", "2.5-hour intimate experience", "Romantic ambiance & lighting", "Premium beverage service"}', 1699.00, '{}');


-- Insert initial data for ALL 9 Packages (Combos)
INSERT INTO packages (name, price, original_price, description, items) VALUES
(
    'Minimal Combo', 
    1899.00, 
    2380.00, 
    'Elegant personalized decorations to make your celebration truly special, focusing on refined aesthetics.', 
    '{"Custom Party Props", "LED Number Display", "LED Alphabet Lighting", "Professional Fog Effect", "Event Photography (30 min)"}'
),
(
    'Kiddo Combo', 
    3199.00, 
    4000.00, 
    'The ultimate celebration package designed specifically for unforgettable kids parties, packed with fun elements.', 
    '{"Photo Clippings (16 Premium Pics)", "Themed Party Props", "LED Number/Alphabet Display", "Magical Fog Effect", "Professional Photography (1 hr)", "Spectacular Cold Fire Entry", "Balloons & Party Favors"}'
),
(
    'Family Combo', 
    3299.00, 
    4130.00, 
    'A comprehensive celebration package perfect for memorable family gatherings, offering comfort and grandeur.', 
    '{"Photo Clippings (16 Premium Pics)", "Elegant Party Props", "LED Number/Alphabet Display", "Professional Fog Effect", "Event Photography (1 hr)", "Grand Cold Fire Entry", "Romantic Rose Petals Heart", "Customized Cake (1kg)"}'
),
(
    'Premium Catering', 
    2999.00, 
    3750.00, 
    'Gourmet dining experience with chef-prepared meals, exquisite presentation, and premium service, tailored to your tastes.', 
    '{"5-course gourmet meal (per person)", "Premium non-alcoholic beverage pairing", "Professional service staff", "Custom menu consultation", "Dessert selection"}'
),
(
    'Entertainment Plus', 
    1799.00, 
    2250.00, 
    'Enhanced audio-visual experience with interactive gaming entertainment, perfect for an engaging party atmosphere.', 
    '{"Latest generation gaming console (PS5/Xbox)", "Premium surround sound system upgrade", "Professional karaoke system setup", "Interactive entertainment guide & assistant", "VR Experience (30 min)"}'
),
(
    'Kids Party Special', 
    2299.00, 
    2880.00, 
    'Fun-filled celebration package specially curated for children''s entertainment, ensuring smiles and laughter.', 
    '{"Colorful themed decorations", "Kids movie selection & animated shorts", "Interactive party games & activities", "Special children''s gourmet menu & treats", "Kids activity packs"}'
),
(
    'Professional Fog Effect', 
    899.00, 
    1130.00, 
    'Create a dramatic and memorable grand entrance or a mystifying ambiance with our professional fog machine setup.', 
    '{"High-output fog machine", "Safe, non-toxic fog fluid", "Duration: 30 minutes", "Operator included"}'
),
(
    'Spectacular Cold Fire Entry', 
    999.00, 
    1250.00, 
    'A spectacular and completely safe indoor firework effect for grand entrances, leaving a lasting impression.', 
    '{"Two cold fire sparkler systems", "Safe & non-toxic sparks (no heat)", "Duration: 30 seconds per burst", "Operator included"}'
),
(
    'Event Photography Package', 
    1199.00, 
    1500.00, 
    'Capture every precious moment with our professional photography service, preserving your memories in high-quality images.', 
    '{"1 hour professional photography", "High-resolution edited photos (50+ digital)", "Online digital gallery delivery", "Optional: Photo print package (additional cost)"}'
);


-- Insert initial data for Addons
INSERT INTO addons (name, description, price) VALUES
('Birthday Decorations', 'Complete themed birthday decorations including banners and balloons.', 699.00),
('Rose Petal Path', 'A romantic and beautiful walkway decorated with fresh rose petals.', 499.00),
('Extra Hour of Photography', 'Add an additional hour to your photography package.', 799.00),
('Welcome Drink & Appetizers', 'A selection of premium non-alcoholic drinks and starters for your guests upon arrival.', 1499.00);

-- Table for Gallery Images (NEW)
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Decorations', 'Celebrations', 'Ambiance'
    caption TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE gallery_images IS 'Stores images uploaded by the admin for the public gallery.';

CREATE TABLE bookings ( /* ... existing bookings table ... */ );
CREATE TABLE contacts ( /* ... existing contacts table ... */ );


-- STEP 3: RESET PRIMARY KEY SEQUENCES
ALTER SEQUENCE gallery_images_id_seq RESTART WITH 1; -- New
-- ... other ALTER SEQUENCE commands ...


-- STEP 4: INSERT INITIAL DATA
-- ... existing INSERT statements for users, theatres, packages, addons ...

-- Insert sample gallery images (optional)
INSERT INTO gallery_images (image_url, category, caption) VALUES
('/uploads/sample-gallery-1.jpg', 'Celebrations', 'Birthday Celebration Setup'),
('/uploads/sample-gallery-2.jpg', 'Ambiance', 'Romantic Evening Decor');

-- =====================================================================
-- ==                      END OF SCRIPT                              ==
-- =====================================================================
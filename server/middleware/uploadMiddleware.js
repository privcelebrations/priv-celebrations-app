const multer = require('multer');
const path = require('path');

// Set up the storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        // Create a unique filename to prevent overwriting files with the same name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// A function to check if the uploaded file is a valid image type
function checkFileType(file, cb){
    // Define the allowed file extensions
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check if the file's extension and mime type match the allowed types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true); // Allow the upload
    } else {
        cb('Error: You can only upload image files (jpeg, jpg, png, gif, webp)!'); // Reject with an error
    }
}

// Initialize the main upload variable
const upload = multer({
    storage: storage,
    // --- THIS IS THE CORRECTED LINE ---
    // Increased the file size limit from 5MB to 20MB (20,000,000 bytes)
    limits: { fileSize: 20000000 }, 
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
    // '.array('images', 5)' allows up to 5 files to be uploaded at once under the field name 'images'
}).array('images', 5);

// Export the configured multer instance
module.exports = upload;
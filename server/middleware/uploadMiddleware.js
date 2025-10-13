const multer = require('multer');
const path = require('path');

// Set up the storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        // Create a unique filename to prevent overwriting files
        cb(null, 'upload-' + Date.now() + path.extname(file.originalname));
    }
});

// A function to check if the uploaded file is a valid image type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb(new Error('Error: You can only upload image files!'));
    }
}

// Initialize the main upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 20000000 }, // 20MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

// We will export the configured multer instance directly
// and specify the field name in the route itself.
// This is a more flexible approach.
module.exports = upload;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowed_formats: ["png", "jpg", "jpeg"], // Corrected typo
      format: async (req, file) => 'png', // Optionally set a default format
      public_id: (req, file) => file.originalname.split('.')[0],
    },
});

module.exports = {cloudinary , storage};


// https://console.cloudinary.com/pm/c-4f81ab24c86c0642d0df69f9b2ac3b/media-explorer/wanderlust_DEV
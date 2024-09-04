const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//setting clodinary configurations
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key :  process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
})

//Use of Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wandurlust_DEV',
      supportedFiles : ["jpg", "png", "jpeg"]
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }
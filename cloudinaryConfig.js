const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//setting clodinary configurations
cloudinary.config({
    cloud_name : process.env.cloud_name,
    api_key :  process.env.cloud_api_key,
    api_secret : process.env.cloud_api_secret,
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